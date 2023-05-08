import type { AxiosPromise } from 'axios';

import { apiInstance } from './base';
import type { WeatherData } from './models';

export type GetCityWeatherParams = {
  city: string;
};

const BASE_URL = '/daily';

export const getCityWeather = (
  params?: GetCityWeatherParams,
): AxiosPromise<WeatherData> => {
  return apiInstance.get(BASE_URL, {
    params,
  });
};
