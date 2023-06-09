import type { AxiosPromise } from 'axios';

import { API_KEY } from 'shared/config';
import { apiInstance } from './base';
import type { TWeatherData, WeatherDataByName } from './models';

export type GetCityWeatherParams = {
  position: {
    latitude: number;
    longitude: number;
  };
};

export type GetCityWeatherByNameParams = {
  name: string;
};

export const getCityWeather = async (
  params: GetCityWeatherParams,
): AxiosPromise<TWeatherData> => {
  return (
    await apiInstance.get(
      `onecall?lat=${params.position.latitude}&lon=${params.position.longitude}&units=metric&appid=${API_KEY}`,
    )
  ).data as AxiosPromise<TWeatherData>;
};

export const getCityWeatherByName = async (
  params: GetCityWeatherByNameParams,
): AxiosPromise<WeatherDataByName> => {
  return (
    await apiInstance.get(
      `weather?q=${params.name}&units=metric&appid=${API_KEY}`,
    )
  ).data as AxiosPromise<WeatherDataByName>;
};
