//
//  WeatherWidgetBundle.swift
//  WeatherWidget
//
//  Created by Vadim Dzerniuk on 23.05.2023.
//

import WidgetKit
import SwiftUI

@main
struct WeatherWidgetBundle: WidgetBundle {
    var body: some Widget {
        WeatherWidget()
        WeatherWidgetLiveActivity()
    }
}
