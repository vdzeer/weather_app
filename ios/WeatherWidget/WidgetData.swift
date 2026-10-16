import Foundation

// Mirrors `WidgetPayload` in src/features/widget-sync/syncWidget.ts.
struct WidgetPayload: Codable {
  struct Place: Codable {
    var name: String
    var latitude: Double
    var longitude: Double
    var isCurrent: Bool
  }

  struct Units: Codable {
    var temperature: String
    var wind: String
  }

  struct Hour: Codable {
    var time: Double
    var temperature: Double
    var weatherCode: Int
    var isDay: Bool
  }

  struct Snapshot: Codable {
    var fetchedAt: Double  // milliseconds
    var utcOffsetSeconds: Int
    var temperature: Double
    var weatherCode: Int
    var isDay: Bool
    var min: Double
    var max: Double
    var hours: [Hour]
  }

  var version: Int
  var language: String
  var place: Place
  var units: Units
  var snapshot: Snapshot
}

enum WidgetStore {
  static let appGroup = "group.vdzeer.weather"
  static let key = "widget"

  static func load() -> WidgetPayload? {
    guard
      let json = UserDefaults(suiteName: appGroup)?.string(forKey: key),
      let data = json.data(using: .utf8)
    else { return nil }
    return try? JSONDecoder().decode(WidgetPayload.self, from: data)
  }

  static func save(_ payload: WidgetPayload) {
    guard
      let data = try? JSONEncoder().encode(payload),
      let json = String(data: data, encoding: .utf8)
    else { return }
    UserDefaults(suiteName: appGroup)?.set(json, forKey: key)
  }
}
