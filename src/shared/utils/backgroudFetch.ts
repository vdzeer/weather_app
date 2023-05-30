import BackgroundFetch from 'react-native-background-fetch';
import SharedGroupPreferences from 'react-native-shared-group-preferences';
import { APP_IOS_GROUP } from '../config';
import { getCityWeather } from '../api';

/* eslint-disable */
export const initBackgroundFetch = async (position: {
  latitude: number;
  longitude: number;
}) => {
  await BackgroundFetch.configure(
    {
      minimumFetchInterval: 15,
      stopOnTerminate: false,
      enableHeadless: true,
      startOnBoot: true,
    },
    async (taskId: string) => {
      console.log('[BackgroundFetch] taskId', taskId);

      if (taskId === 'com.transistorsoft.updateInfoTask') {
        const data: any = await getCityWeather({
          position,
        });

        if (data) {
          const { temp, weather } = data.current;

          SharedGroupPreferences.setItem(
            'widgetVdzeer',
            {
              temp: temp.toFixed(0) + '°C',
              main: weather[0].main,
              day: new Date().toDateString(),
            },
            APP_IOS_GROUP,
          );
        }
      }
      BackgroundFetch.finish(taskId);
    },
    (taskId: string) => {
      console.log('[Fetch] TIMEOUT taskId:', taskId);
      BackgroundFetch.finish(taskId);
    },
  );
};

export const onScheduleTask = () => {
  BackgroundFetch.scheduleTask({
    taskId: 'com.transistorsoft.updateInfoTask',
    delay: 1000 * 60 * 15,
    periodic: true,
  })
    .then(() => {
      console.log('scheduleTask', 'Scheduled task with delay: 15m');
    })
    .catch(error => {
      console.log('scheduleTask ERROR', error);
    });
};
