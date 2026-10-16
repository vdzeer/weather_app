import SwiftUI

// Keep in sync with src/shared/lib/weatherCode.ts and src/shared/theme/colors.ts.
enum WeatherStyle {
  static func symbol(code: Int, isDay: Bool) -> String {
    switch code {
    case 0, 1: return isDay ? "sun.max.fill" : "moon.stars.fill"
    case 2: return isDay ? "cloud.sun.fill" : "cloud.moon.fill"
    case 3: return "cloud.fill"
    case 45, 48: return "cloud.fog.fill"
    case 51...57: return "cloud.drizzle.fill"
    case 65, 67, 82: return "cloud.heavyrain.fill"
    case 61...67, 80...82: return "cloud.rain.fill"
    case 71...77, 85, 86: return "cloud.snow.fill"
    case 95...99: return "cloud.bolt.rain.fill"
    default: return "cloud.fill"
    }
  }

  private enum Sky { case clear, partly, cloudy, fog, rain, snow, storm }

  private static func sky(code: Int) -> Sky {
    switch code {
    case 0, 1: return .clear
    case 2: return .partly
    case 45, 48: return .fog
    case 51...67, 80, 81: return .rain
    case 71...77, 85, 86: return .snow
    case 82, 95...99: return .storm
    default: return .cloudy
    }
  }

  static func gradient(code: Int, isDay: Bool) -> LinearGradient {
    let hex: (UInt32, UInt32)
    switch (sky(code: code), isDay) {
    case (.clear, true): hex = (0x2A5FC4, 0x3E80DA)
    case (.clear, false): hex = (0x121738, 0x262B63)
    case (.partly, true): hex = (0x355E9E, 0x5079B4)
    case (.partly, false): hex = (0x171C3A, 0x2B3159)
    case (.cloudy, true): hex = (0x4A586F, 0x627189)
    case (.cloudy, false): hex = (0x1C2030, 0x31374D)
    case (.fog, true): hex = (0x535A66, 0x6B727E)
    case (.fog, false): hex = (0x202329, 0x373B45)
    case (.rain, true): hex = (0x2F3C54, 0x4A5D7B)
    case (.rain, false): hex = (0x131926, 0x263046)
    case (.snow, true): hex = (0x455A7C, 0x62799E)
    case (.snow, false): hex = (0x1A2135, 0x303C57)
    case (.storm, true): hex = (0x2A2240, 0x463966)
    case (.storm, false): hex = (0x151128, 0x2A2244)
    }
    return LinearGradient(
      colors: [Color(hex: hex.0), Color(hex: hex.1)],
      startPoint: .top,
      endPoint: .bottom
    )
  }

  static func condition(code: Int, language: String) -> String {
    let uk = language.hasPrefix("uk")
    switch code {
    case 0: return uk ? "Ясно" : "Clear"
    case 1: return uk ? "Переважно ясно" : "Mostly clear"
    case 2: return uk ? "Мінлива хмарність" : "Partly cloudy"
    case 3: return uk ? "Хмарно" : "Cloudy"
    case 45, 48: return uk ? "Туман" : "Fog"
    case 51...57: return uk ? "Мряка" : "Drizzle"
    case 61, 80: return uk ? "Невеликий дощ" : "Light rain"
    case 65, 82: return uk ? "Сильний дощ" : "Heavy rain"
    case 63, 66, 67, 81: return uk ? "Дощ" : "Rain"
    case 71, 85: return uk ? "Невеликий сніг" : "Light snow"
    case 75, 86: return uk ? "Сильний сніг" : "Heavy snow"
    case 73, 77: return uk ? "Сніг" : "Snow"
    case 95...99: return uk ? "Гроза" : "Thunderstorm"
    default: return uk ? "Хмарно" : "Cloudy"
    }
  }

  static func temperature(_ celsius: Double, unit: String) -> String {
    let value = unit == "fahrenheit" ? celsius * 9 / 5 + 32 : celsius
    let rounded = Int(value.rounded())
    // U+2212 minus, same as the app.
    return rounded < 0 ? "\u{2212}\(abs(rounded))°" : "\(rounded)°"
  }

  static func hour(_ unix: Double, offset: Int) -> String {
    let formatter = DateFormatter()
    formatter.locale = Locale.current
    formatter.timeZone = TimeZone(secondsFromGMT: offset)
    formatter.setLocalizedDateFormatFromTemplate("j")
    return formatter.string(from: Date(timeIntervalSince1970: unix))
  }
}

enum WidgetFont {
  static func display(_ size: CGFloat) -> Font { .custom("FixelDisplay-Light", size: size) }
  static func text(_ size: CGFloat) -> Font { .custom("FixelText-Medium", size: size) }
  static func strong(_ size: CGFloat) -> Font { .custom("FixelText-SemiBold", size: size) }
}

extension Color {
  init(hex: UInt32) {
    self.init(
      red: Double((hex >> 16) & 0xFF) / 255,
      green: Double((hex >> 8) & 0xFF) / 255,
      blue: Double(hex & 0xFF) / 255
    )
  }
}
