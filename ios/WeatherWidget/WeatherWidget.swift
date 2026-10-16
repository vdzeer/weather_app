import SwiftUI
import WidgetKit

struct WeatherEntry: TimelineEntry {
  let date: Date
  let payload: WidgetPayload?

  var language: String {
    payload?.language ?? (Locale.preferredLanguages.first ?? "en")
  }

  // Conditions at `date`: live values for the first hour, forecast afterwards.
  var conditions: (temperature: Double, code: Int, isDay: Bool)? {
    guard let snapshot = payload?.snapshot else { return nil }
    let unix = date.timeIntervalSince1970
    // Once we're in an hour that started after the fetch, the forecast for
    // that hour is a better guess than the old observation.
    if let hour = snapshot.hours.last(where: { $0.time <= unix }),
      hour.time > snapshot.fetchedAt / 1000
    {
      return (hour.temperature, hour.weatherCode, hour.isDay)
    }
    return (snapshot.temperature, snapshot.weatherCode, snapshot.isDay)
  }

  func upcomingHours(_ count: Int) -> [WidgetPayload.Hour] {
    guard let hours = payload?.snapshot.hours else { return [] }
    let unix = date.timeIntervalSince1970
    return Array(hours.filter { $0.time > unix }.prefix(count))
  }

  static let preview = WeatherEntry(
    date: Date(),
    payload: WidgetPayload(
      version: 1,
      language: Locale.preferredLanguages.first ?? "en",
      place: .init(name: "Київ", latitude: 50.45, longitude: 30.52, isCurrent: true),
      units: .init(temperature: "celsius", wind: "ms"),
      snapshot: .init(
        fetchedAt: Date().timeIntervalSince1970 * 1000,
        utcOffsetSeconds: 10800,
        temperature: 14,
        weatherCode: 2,
        isDay: true,
        min: 8,
        max: 16,
        hours: (1...6).map { i in
          .init(
            time: Date().timeIntervalSince1970 + Double(i) * 3600,
            temperature: 14 + Double(i % 3),
            weatherCode: i < 4 ? 2 : 61,
            isDay: true
          )
        }
      )
    )
  )
}

struct Provider: TimelineProvider {
  func placeholder(in context: Context) -> WeatherEntry { .preview }

  func getSnapshot(in context: Context, completion: @escaping (WeatherEntry) -> Void) {
    if context.isPreview {
      completion(.preview)
    } else {
      completion(WeatherEntry(date: Date(), payload: WidgetStore.load()))
    }
  }

  func getTimeline(in context: Context, completion: @escaping (Timeline<WeatherEntry>) -> Void) {
    Task {
      let now = Date()
      guard var payload = WidgetStore.load() else {
        let entry = WeatherEntry(date: now, payload: nil)
        completion(Timeline(entries: [entry], policy: .after(now.addingTimeInterval(3600))))
        return
      }

      if let fresh = try? await WeatherFetcher.fetch(
        latitude: payload.place.latitude,
        longitude: payload.place.longitude
      ) {
        payload.snapshot = fresh
        WidgetStore.save(payload)
      }

      // One entry per upcoming hour keeps the widget sensible even if the
      // next refresh comes late or the phone is offline.
      let calendar = Calendar.current
      let nextHour = calendar.nextDate(
        after: now, matching: DateComponents(minute: 0), matchingPolicy: .nextTime) ?? now
      var entries = [WeatherEntry(date: now, payload: payload)]
      for i in 0..<6 {
        if let date = calendar.date(byAdding: .hour, value: i, to: nextHour) {
          entries.append(WeatherEntry(date: date, payload: payload))
        }
      }
      completion(Timeline(entries: entries, policy: .after(now.addingTimeInterval(30 * 60))))
    }
  }
}

// MARK: - Views

struct WeatherWidgetView: View {
  @Environment(\.widgetFamily) private var family
  let entry: WeatherEntry

  var body: some View {
    Group {
      if let payload = entry.payload, let now = entry.conditions {
        switch family {
        case .systemMedium:
          MediumView(entry: entry, payload: payload, now: now)
        case .accessoryInline:
          Label(
            "\(WeatherStyle.temperature(now.temperature, unit: payload.units.temperature)) \(WeatherStyle.condition(code: now.code, language: entry.language))",
            systemImage: WeatherStyle.symbol(code: now.code, isDay: now.isDay)
          )
        case .accessoryCircular:
          CircularView(payload: payload, now: now)
        case .accessoryRectangular:
          RectangularView(entry: entry, payload: payload, now: now)
        default:
          SmallView(entry: entry, payload: payload, now: now)
        }
      } else {
        EmptyStateView(language: entry.language)
      }
    }
    .containerBackground(for: .widget) {
      if let now = entry.conditions {
        WeatherStyle.gradient(code: now.code, isDay: now.isDay)
      } else {
        WeatherStyle.gradient(code: 3, isDay: false)
      }
    }
  }
}

private struct PlaceName: View {
  let payload: WidgetPayload

  var body: some View {
    HStack(spacing: 4) {
      if payload.place.isCurrent {
        Image(systemName: "location.fill").font(.system(size: 10, weight: .semibold))
      }
      Text(payload.place.name).font(WidgetFont.strong(14)).lineLimit(1)
    }
  }
}

private struct HighLow: View {
  let payload: WidgetPayload

  var body: some View {
    let unit = payload.units.temperature
    Text("↑\(WeatherStyle.temperature(payload.snapshot.max, unit: unit))  ↓\(WeatherStyle.temperature(payload.snapshot.min, unit: unit))")
      .font(WidgetFont.text(12))
      .opacity(0.8)
  }
}

private struct SmallView: View {
  let entry: WeatherEntry
  let payload: WidgetPayload
  let now: (temperature: Double, code: Int, isDay: Bool)

  var body: some View {
    VStack(alignment: .leading, spacing: 0) {
      PlaceName(payload: payload)
      Text(WeatherStyle.temperature(now.temperature, unit: payload.units.temperature))
        .font(WidgetFont.display(48))
        .minimumScaleFactor(0.6)
        .lineLimit(1)
      Spacer(minLength: 0)
      Image(systemName: WeatherStyle.symbol(code: now.code, isDay: now.isDay))
        .symbolRenderingMode(.multicolor)
        .font(.system(size: 20))
        .padding(.bottom, 4)
      Text(WeatherStyle.condition(code: now.code, language: entry.language))
        .font(WidgetFont.text(13))
        .lineLimit(1)
        .minimumScaleFactor(0.8)
      HighLow(payload: payload)
    }
    .foregroundStyle(.white)
    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
  }
}

private struct MediumView: View {
  let entry: WeatherEntry
  let payload: WidgetPayload
  let now: (temperature: Double, code: Int, isDay: Bool)

  var body: some View {
    HStack(alignment: .top, spacing: 12) {
      SmallView(entry: entry, payload: payload, now: now)
        .frame(width: 120)
      VStack(alignment: .trailing, spacing: 0) {
        HStack(spacing: 0) {
          ForEach(entry.upcomingHours(5), id: \.time) { hour in
            VStack(spacing: 8) {
              Text(WeatherStyle.hour(hour.time, offset: payload.snapshot.utcOffsetSeconds))
                .font(WidgetFont.text(12))
                .opacity(0.8)
              Image(systemName: WeatherStyle.symbol(code: hour.weatherCode, isDay: hour.isDay))
                .symbolRenderingMode(.multicolor)
                .font(.system(size: 18))
                .frame(height: 22)
              Text(WeatherStyle.temperature(hour.temperature, unit: payload.units.temperature))
                .font(WidgetFont.strong(15))
            }
            .frame(maxWidth: .infinity)
          }
        }
        .frame(maxHeight: .infinity)
        // Open-Meteo's CC BY 4.0 licence asks for credit where its data is
        // shown. The small and Lock Screen sizes have no room for it.
        Text("Open-Meteo.com")
          .font(WidgetFont.text(10))
          .opacity(0.6)
          .lineLimit(1)
      }
    }
    .foregroundStyle(.white)
  }
}

private struct CircularView: View {
  let payload: WidgetPayload
  let now: (temperature: Double, code: Int, isDay: Bool)

  var body: some View {
    ZStack {
      AccessoryWidgetBackground()
      VStack(spacing: 0) {
        Image(systemName: WeatherStyle.symbol(code: now.code, isDay: now.isDay))
          .font(.system(size: 14))
        Text(WeatherStyle.temperature(now.temperature, unit: payload.units.temperature))
          .font(.system(size: 17, weight: .semibold))
      }
    }
  }
}

private struct RectangularView: View {
  let entry: WeatherEntry
  let payload: WidgetPayload
  let now: (temperature: Double, code: Int, isDay: Bool)

  var body: some View {
    VStack(alignment: .leading, spacing: 1) {
      HStack(spacing: 6) {
        Image(systemName: WeatherStyle.symbol(code: now.code, isDay: now.isDay))
        Text(WeatherStyle.temperature(now.temperature, unit: payload.units.temperature))
          .font(.headline)
        Text(payload.place.name).font(.caption).lineLimit(1)
      }
      Text(WeatherStyle.condition(code: now.code, language: entry.language))
        .font(.caption)
      HighLow(payload: payload)
    }
    .frame(maxWidth: .infinity, alignment: .leading)
  }
}

private struct EmptyStateView: View {
  let language: String

  var body: some View {
    // Tapping the widget opens the app. Naming the app here ("Weather",
    // «Погода») would read like Apple's Weather or the OpenWeather brand.
    Text(
      language.hasPrefix("uk")
        ? "Торкніться, щоб вибрати місто"
        : "Tap to choose a place"
    )
    .font(WidgetFont.text(13))
    .foregroundStyle(.white)
    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
  }
}

// MARK: - Widget

struct WeatherWidget: Widget {
  let kind = "WeatherWidget"

  private var isUkrainian: Bool {
    Locale.preferredLanguages.first?.hasPrefix("uk") ?? false
  }

  var body: some WidgetConfiguration {
    StaticConfiguration(kind: kind, provider: Provider()) { entry in
      WeatherWidgetView(entry: entry)
    }
    .configurationDisplayName("WeatherApp")
    .description(
      isUkrainian
        ? "Погода для вашого місця або першого міста зі списку."
        : "Weather for your location or the first city in your list."
    )
    .supportedFamilies([
      .systemSmall, .systemMedium, .accessoryInline, .accessoryCircular, .accessoryRectangular,
    ])
  }
}

#Preview(as: .systemMedium) {
  WeatherWidget()
} timeline: {
  WeatherEntry.preview
}
