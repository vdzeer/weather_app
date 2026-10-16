import BackgroundFetch, {
  type HeadlessEvent,
} from 'react-native-background-fetch';

import { fetchForecast } from '@entities/forecast';
import { selectPrimaryPlace, usePlacesStore } from '@entities/place';
import { useSettingsStore } from '@entities/settings';
import {
  checkPrecipitationAlert,
  scheduleMorningForecasts,
} from '@features/notifications';
import { syncWidget } from '@features/widget-sync';
import { BACKGROUND_TASK_INTERVAL_MIN } from '@shared/config';
import { whenHydrated } from '@shared/lib/hydration';

// Refreshes the primary place: widget data, the next morning forecasts and a
// rain/snow alert if it's about to start. Runs when the OS lets us — on iOS
// that can be rare, which is why the widget also fetches on its own.
export const runBackgroundRefresh = async () => {
  await Promise.all([
    whenHydrated(usePlacesStore),
    whenHydrated(useSettingsStore),
  ]);
  const place = selectPrimaryPlace(usePlacesStore.getState());
  if (!place) {
    return;
  }
  const { units, notifications } = useSettingsStore.getState();
  const forecast = await fetchForecast(place);
  const input = { forecast, place, units, settings: notifications };

  syncWidget(place, forecast, units);
  await scheduleMorningForecasts(input);
  await checkPrecipitationAlert(input);
};

const runTask = async (taskId: string) => {
  try {
    await runBackgroundRefresh();
  } catch {
    // Nothing to show the user from here; the next run will try again.
  } finally {
    BackgroundFetch.finish(taskId);
  }
};

export const configureBackgroundFetch = () =>
  BackgroundFetch.configure(
    {
      minimumFetchInterval: BACKGROUND_TASK_INTERVAL_MIN,
      stopOnTerminate: false,
      startOnBoot: true,
      enableHeadless: true,
      requiredNetworkType: BackgroundFetch.NETWORK_TYPE_ANY,
    },
    runTask,
    taskId => BackgroundFetch.finish(taskId),
  );

// Android: runs after the app was swiped away or the phone rebooted.
export const headlessTask = async ({ taskId, timeout }: HeadlessEvent) => {
  if (timeout) {
    BackgroundFetch.finish(taskId);
    return;
  }
  await runTask(taskId);
};
