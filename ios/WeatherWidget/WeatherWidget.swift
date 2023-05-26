//
//  WeatherWidget.swift
//  WeatherWidget
//
//  Created by Vadim Dzerniuk on 23.05.2023.
//

import WidgetKit
import SwiftUI
import Intents

struct WidgetData: Decodable {
   var temp: String
   var day: String
   var main: String
}

struct Provider: IntentTimelineProvider {
    func placeholder(in context: Context) -> SimpleEntry {
      SimpleEntry(date: Date(), configuration: ConfigurationIntent(), temp: "13 °C", day: "Tue May 23 2023", main: "Clouds")
    }

    func getSnapshot(for configuration: ConfigurationIntent, in context: Context, completion: @escaping (SimpleEntry) -> ()) {
      let entry = SimpleEntry(date: Date(), configuration: configuration, temp: "13 °C", day: "Tue May 23 2023", main: "Clouds")
        completion(entry)
    }

    func getTimeline(for configuration: ConfigurationIntent, in context: Context, completion: @escaping (Timeline<SimpleEntry>) -> ()) {
      let userDefaults = UserDefaults.init(suiteName: "group.vdzeer.weather")
            if userDefaults != nil {
              let entryDate = Date()
              if let savedData = userDefaults!.value(forKey: "widgetVdzeer") as? String {
                  let decoder = JSONDecoder()
                  let data = savedData.data(using: .utf8)
                  if let parsedData = try? decoder.decode(WidgetData.self, from: data!) {
                      let nextRefresh = Calendar.current.date(byAdding: .second, value: 5, to: entryDate)!
                      let entry = SimpleEntry(date: nextRefresh, configuration: configuration, temp: parsedData.temp, day: parsedData.day, main: parsedData.main)
                      let timeline = Timeline(entries: [entry], policy: .atEnd)
                      completion(timeline)
                  } else {
                      print("Could not parse data")
                  }
              } else {
                  let nextRefresh = Calendar.current.date(byAdding: .second, value: 5, to: entryDate)!
                  let entry = SimpleEntry(date: nextRefresh, configuration: configuration, temp: "-", day: "No Data", main: "-")
                  let timeline = Timeline(entries: [entry], policy: .atEnd)
                  completion(timeline)
              }
            }
    }
}

struct SimpleEntry: TimelineEntry {
    let date: Date
    let configuration: ConfigurationIntent
    let temp: String
    let day: String
    let main: String
}

struct WeatherWidgetEntryView : View {
    var entry: Provider.Entry
  
  var body: some View {
      HStack(spacing: 20) {
        VStack(alignment: .center) {
          Text(entry.day).bold().font(.system(size: 12)).foregroundColor(.red).italic().padding(.bottom, 0.5)
          Text(entry.temp)
            .bold()
            .font(.system(size: 30))
            .foregroundColor(Color.black)
            .shadow(color: .gray, radius: 15, x: 7, y: 7)
            .minimumScaleFactor(0.7)
          Text(entry.main)
            .bold()
            .font(.system(size: 25))
            .foregroundColor(Color.black)
            .shadow(color: .gray, radius: 15, x: 7, y: 7)
            .minimumScaleFactor(0.5)
          
        }
      }.padding(.all, 5)
    }
}

struct WeatherWidget: Widget {
    let kind: String = "WeatherWidget"

    var body: some WidgetConfiguration {
        IntentConfiguration(kind: kind, intent: ConfigurationIntent.self, provider: Provider()) { entry in
            WeatherWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("My Widget")
        .description("This is an example widget.")
    }
}

struct WeatherWidget_Previews: PreviewProvider {
    static var previews: some View {
      WeatherWidgetEntryView(entry: SimpleEntry(date: Date(), configuration: ConfigurationIntent(), temp: "13 °C", day: "Tue May 23 2023", main: "Clouds"))
            .previewContext(WidgetPreviewContext(family: .systemSmall))
    }
}
