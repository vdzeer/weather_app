import Foundation
import WidgetKit

// Called from RCTWeatherNative.mm by its Objective-C runtime name.
@objc(WidgetBridge)
final class WidgetBridge: NSObject {
  @objc static func reloadAll() {
    WidgetCenter.shared.reloadAllTimelines()
  }
}
