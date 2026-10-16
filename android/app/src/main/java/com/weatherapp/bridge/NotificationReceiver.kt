package com.weatherapp.bridge

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

class NotificationReceiver : BroadcastReceiver() {
  override fun onReceive(context: Context, intent: Intent) {
    val id = intent.getStringExtra(ForecastNotifications.EXTRA_ID) ?: return
    val title = intent.getStringExtra(ForecastNotifications.EXTRA_TITLE) ?: return
    val body = intent.getStringExtra(ForecastNotifications.EXTRA_BODY) ?: ""
    ForecastNotifications.show(context, id, title, body)
  }
}
