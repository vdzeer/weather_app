import { AxiosError, AxiosPromise } from 'axios';
import { UseQueryOptions, useQuery } from 'react-query';

import { WeatherData, typicodeApi } from 'shared/api';

export const cityKeyFactory = {
  cities: ['all-cities'],
  citiesById: (name: string) => [...cityKeyFactory.cities, name],
} as const;

export const useGetCityWeather = (
  city: string,
  options?: UseQueryOptions<
    AxiosPromise<WeatherData>,
    AxiosError,
    WeatherData,
    readonly (string | number)[]
  >,
) => {
  return useQuery({
    queryFn: () => typicodeApi.weather.getCityWeather({ city }),
    queryKey: [...cityKeyFactory.citiesById(city)],
    ...options,
  });
};
