import Foundation

// The widget refreshes itself: iOS runs the app's background task rarely,
// but it reliably asks widgets for a new timeline.
enum WeatherFetcher {
  private struct Response: Decodable {
    struct Current: Decodable {
      let time: Double
      let temperature_2m: Double
      let weather_code: Int
      let is_day: Int
    }
    struct Hourly: Decodable {
      let time: [Double]
      let temperature_2m: [Double?]
      let weather_code: [Int?]
      let is_day: [Int?]
    }
    struct Daily: Decodable {
      let temperature_2m_max: [Double?]
      let temperature_2m_min: [Double?]
    }
    let utc_offset_seconds: Int
    let current: Current
    let hourly: Hourly
    let daily: Daily
  }

  static func fetch(latitude: Double, longitude: Double) async throws -> WidgetPayload.Snapshot {
    var components = URLComponents(string: "https://api.open-meteo.com/v1/forecast")!
    // 2 decimal places (~1 km), like the app: see src/shared/api/coordinates.ts.
    components.queryItems = [
      URLQueryItem(name: "latitude", value: String(format: "%.2f", latitude)),
      URLQueryItem(name: "longitude", value: String(format: "%.2f", longitude)),
      URLQueryItem(name: "current", value: "temperature_2m,weather_code,is_day"),
      URLQueryItem(name: "hourly", value: "temperature_2m,weather_code,is_day"),
      URLQueryItem(name: "daily", value: "temperature_2m_max,temperature_2m_min"),
      URLQueryItem(name: "forecast_days", value: "2"),
      URLQueryItem(name: "timezone", value: "auto"),
      URLQueryItem(name: "timeformat", value: "unixtime"),
    ]
    var request = URLRequest(url: components.url!)
    request.timeoutInterval = 10

    let (data, response) = try await URLSession.shared.data(for: request)
    guard (response as? HTTPURLResponse)?.statusCode == 200 else {
      throw URLError(.badServerResponse)
    }
    let decoded = try JSONDecoder().decode(Response.self, from: data)

    let start = decoded.hourly.time.lastIndex { $0 <= decoded.current.time } ?? 0
    let hours = decoded.hourly.time.indices.dropFirst(start).prefix(24).map { i in
      WidgetPayload.Hour(
        time: decoded.hourly.time[i],
        temperature: decoded.hourly.temperature_2m[i] ?? decoded.current.temperature_2m,
        weatherCode: decoded.hourly.weather_code[i] ?? 3,
        isDay: (decoded.hourly.is_day[i] ?? 1) == 1
      )
    }

    return WidgetPayload.Snapshot(
      fetchedAt: Date().timeIntervalSince1970 * 1000,
      utcOffsetSeconds: decoded.utc_offset_seconds,
      temperature: decoded.current.temperature_2m,
      weatherCode: decoded.current.weather_code,
      isDay: decoded.current.is_day == 1,
      min: decoded.daily.temperature_2m_min.first.flatMap { $0 } ?? decoded.current.temperature_2m,
      max: decoded.daily.temperature_2m_max.first.flatMap { $0 } ?? decoded.current.temperature_2m,
      hours: hours
    )
  }
}
