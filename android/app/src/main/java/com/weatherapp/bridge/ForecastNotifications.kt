package com.weatherapp.bridge

import android.app.AlarmManager
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import com.weatherapp.R

object ForecastNotifications {
  private const val CHANNEL_ID = "forecast"
  const val EXTRA_ID = "id"
  const val EXTRA_TITLE = "title"
  const val EXTRA_BODY = "body"

  private fun ensureChannel(context: Context) {
    val manager = context.getSystemService(NotificationManager::class.java)
    if (manager.getNotificationChannel(CHANNEL_ID) != null) return
    val channel =
        NotificationChannel(
            CHANNEL_ID,
            context.getString(R.string.channel_forecast),
            NotificationManager.IMPORTANCE_DEFAULT,
        )
    channel.description = context.getString(R.string.channel_forecast_description)
    manager.createNotificationChannel(channel)
  }

  fun isEnabled(context: Context): Boolean =
      NotificationManagerCompat.from(context).areNotificationsEnabled()

  fun show(context: Context, id: String, title: String, body: String) {
    if (!isEnabled(context)) return
    ensureChannel(context)
    val launch =
        context.packageManager.getLaunchIntentForPackage(context.packageName)?.let {
          PendingIntent.getActivity(
              context, 0, it, PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE)
        }
    val notification =
        NotificationCompat.Builder(context, CHANNEL_ID)
            .setSmallIcon(R.drawable.ic_notification)
            .setContentTitle(title)
            .setContentText(body)
            .setStyle(NotificationCompat.BigTextStyle().bigText(body))
            .setContentIntent(launch)
            .setAutoCancel(true)
            .build()
    try {
      NotificationManagerCompat.from(context).notify(id.hashCode(), notification)
    } catch (_: SecurityException) {
      // Permission was revoked between the check and the post.
    }
  }

  private fun alarmIntent(context: Context, id: String, title: String?, body: String?) =
      PendingIntent.getBroadcast(
          context,
          id.hashCode(),
          Intent(context, NotificationReceiver::class.java).apply {
            putExtra(EXTRA_ID, id)
            putExtra(EXTRA_TITLE, title)
            putExtra(EXTRA_BODY, body)
          },
          PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
      )

  // Inexact on purpose: no exact-alarm permission needed, and a few minutes'
  // drift doesn't matter for a morning forecast.
  fun schedule(context: Context, id: String, title: String, body: String, atMillis: Long) {
    if (atMillis <= System.currentTimeMillis()) return
    val alarms = context.getSystemService(AlarmManager::class.java)
    alarms.setAndAllowWhileIdle(
        AlarmManager.RTC_WAKEUP, atMillis, alarmIntent(context, id, title, body))
  }

  fun cancel(context: Context, id: String) {
    val alarms = context.getSystemService(AlarmManager::class.java)
    alarms.cancel(alarmIntent(context, id, null, null))
  }
}
