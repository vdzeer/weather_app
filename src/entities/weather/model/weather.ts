import AsyncStorage from '@react-native-async-storage/async-storage';
import { AxiosError, AxiosPromise } from 'axios';
import { UseQueryOptions, useQuery } from 'react-query';
import { create } from 'zustand';
import { shallow } from 'zustand/shallow';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

import {
  WeatherData,
  WeatherDataByName,
  WeatherStoreData,
  getCityWeather,
  getCityWeatherByName,
} from 'shared/api';

export type TPosition = {
  latitude: number;
  longitude: number;
};

type WeatherStore = {
  currentCityWeatherData: WeatherStoreData | null;
  actions: {
    setCurrentCityData: (data: WeatherStoreData | null) => void;
  };
};

const cityKeyFactory = {
  cities: ['all-cities'],
  citiesByLocation: (position: TPosition) => [
    ...cityKeyFactory.cities,
    `${position.latitude}:${position.longitude}`,
  ],
  citiesByName: (name: string) => [...cityKeyFactory.cities, name],
} as const;

export const useGetCityWeatherByLocation = (
  position: TPosition,
  options?: UseQueryOptions<
    AxiosPromise<WeatherData>,
    AxiosError,
    WeatherData,
    readonly (string | number)[]
  >,
) => {
  return useQuery({
    queryFn: () => getCityWeather({ position }),
    queryKey: [...cityKeyFactory.citiesByLocation(position)],
    ...options,
  });
};

export const useGetCityWeatherByName = (
  name: string,
  options?: UseQueryOptions<
    AxiosPromise<WeatherDataByName>,
    AxiosError,
    WeatherDataByName,
    readonly (string | number)[]
  >,
) => {
  return useQuery({
    queryFn: () => getCityWeatherByName({ name }),
    queryKey: [...cityKeyFactory.citiesByName(name)],
    ...options,
  });
};

export const useWeatherStore = create(
  devtools(
    persist<WeatherStore>(
      (set, get) => ({
        currentCityWeatherData: null,
        actions: {
          setCurrentCityData: currentCityWeatherData =>
            set({
              currentCityWeatherData,
            }),
          resetCurrentCity: () => set({ currentCityWeatherData: null }),
        },
      }),
      {
        name: 'weather-store',
        storage: createJSONStorage(() => AsyncStorage),
      },
    ),
  ),
);

export const useWeatherActions = () => useWeatherStore(state => state.actions);

export const useCurrentCityWeather = () =>
  useWeatherStore(state => state.currentCityWeatherData, shallow);
