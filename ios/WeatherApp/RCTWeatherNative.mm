#import "RCTWeatherNative.h"

#import <UserNotifications/UserNotifications.h>

// Shared with the widget extension (see WeatherWidget/WidgetData.swift).
static NSString *const kAppGroup = @"group.vdzeer.weather";
static NSString *const kWidgetKey = @"widget";

@implementation RCTWeatherNative

+ (NSString *)moduleName
{
  return @"WeatherNative";
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativeWeatherNativeSpecJSI>(params);
}

- (void)setWidgetData:(NSString *)json
{
  NSUserDefaults *defaults = [[NSUserDefaults alloc] initWithSuiteName:kAppGroup];
  [defaults setObject:json forKey:kWidgetKey];
  // WidgetCenter is Swift-only; WidgetBridge.swift exposes it under a fixed ObjC name.
  Class bridge = NSClassFromString(@"WidgetBridge");
  SEL reload = NSSelectorFromString(@"reloadAll");
  if ([bridge respondsToSelector:reload]) {
    ((void (*)(id, SEL))[bridge methodForSelector:reload])(bridge, reload);
  }
}

- (void)requestNotificationPermission:(RCTPromiseResolveBlock)resolve
                               reject:(RCTPromiseRejectBlock)reject
{
  UNAuthorizationOptions options =
      UNAuthorizationOptionAlert | UNAuthorizationOptionSound | UNAuthorizationOptionBadge;
  [[UNUserNotificationCenter currentNotificationCenter]
      requestAuthorizationWithOptions:options
                    completionHandler:^(BOOL granted, NSError *_Nullable error) {
                      resolve(@(granted));
                    }];
}

- (void)getNotificationPermission:(RCTPromiseResolveBlock)resolve
                           reject:(RCTPromiseRejectBlock)reject
{
  [[UNUserNotificationCenter currentNotificationCenter]
      getNotificationSettingsWithCompletionHandler:^(UNNotificationSettings *settings) {
        UNAuthorizationStatus status = settings.authorizationStatus;
        resolve(@(status == UNAuthorizationStatusAuthorized ||
                  status == UNAuthorizationStatusProvisional));
      }];
}

- (UNMutableNotificationContent *)contentWithTitle:(NSString *)title body:(NSString *)body
{
  UNMutableNotificationContent *content = [UNMutableNotificationContent new];
  content.title = title;
  content.body = body;
  content.sound = [UNNotificationSound defaultSound];
  return content;
}

- (void)scheduleNotification:(NSString *)id
                       title:(NSString *)title
                        body:(NSString *)body
                   timestamp:(double)timestamp
{
  NSDate *date = [NSDate dateWithTimeIntervalSince1970:timestamp / 1000.0];
  if ([date timeIntervalSinceNow] <= 0) {
    return;
  }
  // A calendar trigger fires at the wall-clock time even if the phone changes time zone.
  NSDateComponents *components = [[NSCalendar currentCalendar]
      components:NSCalendarUnitYear | NSCalendarUnitMonth | NSCalendarUnitDay |
                 NSCalendarUnitHour | NSCalendarUnitMinute
        fromDate:date];
  UNCalendarNotificationTrigger *trigger =
      [UNCalendarNotificationTrigger triggerWithDateMatchingComponents:components repeats:NO];
  UNNotificationRequest *request =
      [UNNotificationRequest requestWithIdentifier:id
                                           content:[self contentWithTitle:title body:body]
                                           trigger:trigger];
  [[UNUserNotificationCenter currentNotificationCenter] addNotificationRequest:request
                                                         withCompletionHandler:nil];
}

- (void)showNotification:(NSString *)id title:(NSString *)title body:(NSString *)body
{
  UNNotificationRequest *request =
      [UNNotificationRequest requestWithIdentifier:id
                                           content:[self contentWithTitle:title body:body]
                                           trigger:nil];
  [[UNUserNotificationCenter currentNotificationCenter] addNotificationRequest:request
                                                         withCompletionHandler:nil];
}

- (void)cancelNotification:(NSString *)id
{
  [[UNUserNotificationCenter currentNotificationCenter]
      removePendingNotificationRequestsWithIdentifiers:@[ id ]];
}

@end
