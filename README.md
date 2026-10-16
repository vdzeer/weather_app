# Weather

A React Native weather app for iOS and Android, in Ukrainian and English.

- Current conditions, the next 24 hours and a 10-day forecast, with details: feels like, wind, UV, pressure, sunrise and sunset, precipitation, visibility.
- Your location first, plus any cities you add.
- Works offline with the last forecast and tells you when it was updated.
- iOS widget (small, medium, Lock Screen) that refreshes itself.
- Optional morning forecast and rain/snow alerts.

Weather data comes from [Open-Meteo](https://open-meteo.com/). Place names for your current location come from [BigDataCloud](https://www.bigdatacloud.com/)'s client-side reverse geocoding. Neither needs an API key, and the app has no accounts, analytics or ads.

## Running it

Requires Node 22.11 or later, Xcode 26 or later with CocoaPods, and Android Studio with JDK 17.

```sh
npm install
cd ios && pod install && cd ..
npm run ios      # or: npm run android
```

If you manage CocoaPods with Bundler, the `Gemfile` pins compatible versions: run `bundle install`, then `bundle exec pod install` in `ios/`.

Checks: `npm test`, `npm run typecheck`, `npm run lint`.

## Using your own identifiers

The project carries the author's Apple team, bundle IDs and App Group. To run it on a device or publish your own build, replace them first.

| What | In this repository | Where to change it |
| --- | --- | --- |
| Apple team | `RV38A3JNTT` | `DEVELOPMENT_TEAM` in `ios/WeatherApp.xcodeproj/project.pbxproj` (Debug and Release of both targets), or Xcode > Signing & Capabilities for `WeatherApp` and `WeatherWidget` |
| iOS app bundle ID | `com.vdzeer.weather` | `PRODUCT_BUNDLE_IDENTIFIER` of the `WeatherApp` target |
| iOS widget bundle ID | `com.vdzeer.weather.WeatherWidget` | `PRODUCT_BUNDLE_IDENTIFIER` of the `WeatherWidget` target; it must start with the app's bundle ID |
| App Group | `group.vdzeer.weather` | `ios/WeatherApp/WeatherApp.entitlements`, `ios/WeatherWidget/WeatherWidget.entitlements`, `kAppGroup` in `ios/WeatherApp/RCTWeatherNative.mm`, `WidgetStore.appGroup` in `ios/WeatherWidget/WidgetData.swift`, `APP_GROUP` in `src/shared/config/index.ts` (reference only) |
| Android application ID | `com.vdzeer.weather` | `applicationId` in `android/app/build.gradle` |

Notes:

- App Group IDs are unique across all Apple developers, so pick your own, for example `group.<your bundle ID>`. Add it under Signing & Capabilities for both targets (with automatic signing Xcode registers it for you) and use the same string in all five places. If the app and the widget disagree, the widget keeps showing its "choose a place" message.
- On Android, `namespace "com.weatherapp"` and the codegen package `com.weatherapp.nativebridge` are Kotlin package names, not the application ID. They can stay as they are.
- Android release builds are signed with your upload key, read from Gradle properties as described in the [React Native docs](https://reactnative.dev/docs/signed-apk-android). Create the key with `keytool`, put the keystore file in `android/app`, and set these in `~/.gradle/gradle.properties` so the passwords stay outside the repository:

  ```properties
  MYAPP_UPLOAD_STORE_FILE=my-upload-key.keystore
  MYAPP_UPLOAD_KEY_ALIAS=my-key-alias
  MYAPP_UPLOAD_STORE_PASSWORD=...
  MYAPP_UPLOAD_KEY_PASSWORD=...
  ```

  Without these properties a release build falls back to the shared debug keystore (`android/app/debug.keystore`, password `android`) and Gradle prints a warning. Such a build is for testing only. `.gitignore` already excludes `*.keystore` (except `debug.keystore`) and `*.jks`.

## Data sources and their terms

**Open-Meteo** ([terms](https://open-meteo.com/en/terms), [licence](https://open-meteo.com/en/licence)) provides the forecast and the city search. The free API needs no key and is for non-commercial use only, within 10,000 calls per day, 5,000 per hour and 600 per minute. Its data is licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), which means crediting Open-Meteo with a link where the data is shown. The app credits Open-Meteo with a link under each forecast ("Weather data by Open-Meteo.com") and in Settings, and the medium widget shows "Open-Meteo.com". A commercial app, for example one with ads or subscriptions, needs a paid Open-Meteo plan.

**BigDataCloud** ([free client-side reverse geocoding](https://www.bigdatacloud.com/free-api/free-reverse-geocode-to-city-api), [fair use policy](https://www.bigdatacloud.com/support/fair-use-policy-for-free-client-side-reverse-geocoding-api)) turns your current coordinates into a place name. The free API may only be called from the user's device, with that device's current coordinates, obtained with the user's permission. Calls from a server or with stored or other coordinates break the policy and can get the IP address blocked. The app calls it only right after a fresh location fix (`src/features/location/useCurrentLocation.ts`). If you need names for other coordinates, use a different geocoder.

## Privacy

Nothing is sent to the author.

- Sent to Open-Meteo: the coordinates of your location and of your saved cities, rounded to 2 decimal places (about 1 km), and the text you type into city search.
- Sent to BigDataCloud: your current coordinates, rounded the same way, to look up the place name.
- In Apple's terms this is coarse location, not linked to you, not used for tracking, and used only for app functionality; `ios/WeatherApp/PrivacyInfo.xcprivacy` declares it that way.
- The app checks for a network connection with the system's own status only. The internet check of `@react-native-community/netinfo`, a request to `clients3.google.com/generate_204` about once a minute on iOS, is turned off (`src/shared/lib/network.ts`).
- Kept on the device: saved cities, the last known location, settings and recent forecasts, in AsyncStorage. On iOS the primary place and its forecast are also written to the App Group, where the widget reads them.

## Layout

The code follows [Feature-Sliced Design](https://feature-sliced.design/):

| Layer | What lives there |
| --- | --- |
| `src/app` | Providers, navigation, background task |
| `src/pages` | Home (city pager), Cities, City preview, Settings |
| `src/widgets` | `ForecastView`, the full forecast for one place |
| `src/features` | Location, city search, notifications, widget sync |
| `src/entities` | Forecast (API mapping, queries, UI blocks), places, settings |
| `src/shared` | API clients, i18n, units, theme, native module, UI kit |

UI strings live in `src/shared/lib/i18n` (`uk.ts` and `en.ts`), with a few native ones in `ios/WeatherApp/*.lproj`, `ios/WeatherWidget/` and `android/app/src/main/res/values*/strings.xml`.

Native code:

- `ios/WeatherApp/RCTWeatherNative.mm` and `android/app/src/main/java/com/weatherapp/bridge/` implement the `WeatherNative` Turbo Module (`src/shared/native/NativeWeatherNative.ts`): widget data and local notifications.
- `ios/WeatherWidget/` is the WidgetKit extension. It reads the place and units the app saves to the App Group and fetches its own forecast every 30 minutes.

## Background work

`react-native-background-fetch` refreshes the primary place (your location, or the first saved city) about every 30 minutes on Android. iOS decides when to run it, which can be rarely, so the app also schedules the next three morning notifications whenever it gets fresh data, and the widget fetches on its own.

## License

The source code is released under the [MIT License](LICENSE).

- Fonts: [Fixel](https://github.com/MacPaw/Fixel) by MacPaw, SIL Open Font License 1.1 (`assets/fonts/OFL.txt`).
- Weather data: [Open-Meteo](https://open-meteo.com/), CC BY 4.0.
