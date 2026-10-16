import { PermissionsAndroid, Platform } from 'react-native';

import WeatherNative from './NativeWeatherNative';

const POST_NOTIFICATIONS = PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS;
const needsRuntimeNotificationPermission =
  Platform.OS === 'android' && Number(Platform.Version) >= 33;

export const widget = {
  setData: (payload: unknown) => {
    WeatherNative.setWidgetData(JSON.stringify(payload));
  },
};

export const notifications = {
  // Also false when the user turned notifications off in system settings.
  hasPermission: () => WeatherNative.getNotificationPermission(),
  requestPermission: async () => {
    if (needsRuntimeNotificationPermission) {
      const result = await PermissionsAndroid.request(POST_NOTIFICATIONS);
      return result === PermissionsAndroid.RESULTS.GRANTED;
    }
    return WeatherNative.requestNotificationPermission();
  },
  schedule: (id: string, title: string, body: string, at: Date) => {
    WeatherNative.scheduleNotification(id, title, body, at.getTime());
  },
  show: (id: string, title: string, body: string) => {
    WeatherNative.showNotification(id, title, body);
  },
  cancel: (id: string) => {
    WeatherNative.cancelNotification(id);
  },
};
