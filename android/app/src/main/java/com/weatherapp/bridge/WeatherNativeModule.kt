package com.weatherapp.bridge

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.weatherapp.nativebridge.NativeWeatherNativeSpec

class WeatherNativeModule(reactContext: ReactApplicationContext) :
    NativeWeatherNativeSpec(reactContext) {

  override fun getName() = NAME

  // The home-screen widget is iOS-only for now.
  override fun setWidgetData(json: String) = Unit

  // Android 13+ asks through PermissionsAndroid on the JS side; older versions
  // allow notifications unless the user turned them off in settings.
  override fun requestNotificationPermission(promise: Promise) {
    promise.resolve(ForecastNotifications.isEnabled(reactApplicationContext))
  }

  override fun getNotificationPermission(promise: Promise) {
    promise.resolve(ForecastNotifications.isEnabled(reactApplicationContext))
  }

  override fun scheduleNotification(id: String, title: String, body: String, timestamp: Double) {
    ForecastNotifications.schedule(reactApplicationContext, id, title, body, timestamp.toLong())
  }

  override fun showNotification(id: String, title: String, body: String) {
    ForecastNotifications.show(reactApplicationContext, id, title, body)
  }

  override fun cancelNotification(id: String) {
    ForecastNotifications.cancel(reactApplicationContext, id)
  }

  companion object {
    const val NAME = "WeatherNative"
  }
}
