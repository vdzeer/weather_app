import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  // iOS: stores the payload in the shared App Group and reloads widget timelines.
  setWidgetData(json: string): void;
  requestNotificationPermission(): Promise<boolean>;
  getNotificationPermission(): Promise<boolean>;
  // `timestamp` is in milliseconds since the epoch.
  scheduleNotification(
    id: string,
    title: string,
    body: string,
    timestamp: number,
  ): void;
  showNotification(id: string, title: string, body: string): void;
  cancelNotification(id: string): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('WeatherNative');
