import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import RNLocation from 'react-native-location';

import { DailyData, WeatherData } from 'entities';
import { styles } from './styles.module';
import {
  TPosition,
  useCurrentCityWeather,
  useGetCityWeatherByLocation,
  useWeatherActions,
} from 'entities/weather/model';
import { Loading } from 'shared/ui';
import { WeatherStoreData } from 'shared/api';

/* eslint-disable */

RNLocation.configure({
  distanceFilter: 5.0,
});

export const DayWeather = () => {
  const [position, setPosition] = useState<TPosition>({
    latitude: 0,
    longitude: 0,
  });

  const { data, isLoading, isError } = useGetCityWeatherByLocation(position);
  const currentCityWeather = useCurrentCityWeather();
  const { setCurrentCityData } = useWeatherActions();

  useEffect(() => {
    let unsubscribe: () => void;
    RNLocation.requestPermission({
      ios: 'whenInUse',
      android: {
        detail: 'coarse',
      },
    }).then(granted => {
      if (granted) {
        unsubscribe = RNLocation.subscribeToLocationUpdates(locations => {
          const currentLocation = locations?.[0] ?? {};

          setPosition({
            longitude: currentLocation.longitude,
            latitude: currentLocation.latitude,
          });
        });
      }
    });

    return () => {
      unsubscribe?.();
    };
  }, []);

  const weatherData = useMemo(() => {
    if (!data) return currentCityWeather ?? null;

    const { temp, humidity, wind_speed, weather, pressure } = data.current;
    const { daily } = data;

    const days: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const daysData: string[] = [];
    const tempData: number[] = [];

    daily.forEach((e, index: number): void => {
      if (index >= 1) {
        const dd: number = new Date(e.dt * 1000).getUTCDay();
        daysData.push(days[dd]);
        tempData.push((e.temp as any)?.['day'] as number);
      }
    });

    const weatherData: WeatherStoreData = {
      day: new Date().toDateString(),
      hours: new Date().getHours(),
      main: weather[0].main,
      temp,
      humidity,
      wind_speed,
      pressure,
      daysData,
      tempData,
    };

    setCurrentCityData?.(weatherData);

    return weatherData;
  }, [data]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {isLoading || isError || !weatherData ? (
        <Loading />
      ) : (
        <>
          <WeatherData weatherData={weatherData} />

          <View style={styles.dailyWrapper}>
            <DailyData
              daysData={weatherData.daysData}
              tempData={weatherData.tempData}
            />
          </View>
        </>
      )}
    </ScrollView>
  );
};
