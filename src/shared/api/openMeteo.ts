import { FORECAST_DAYS } from '@shared/config';

import { coarseCoordinate } from './coordinates';
import { forecastApi } from './http';

const CURRENT = [
  'temperature_2m',
  'relative_humidity_2m',
  'apparent_temperature',
  'is_day',
  'precipitation',
  'weather_code',
  'pressure_msl',
  'wind_speed_10m',
  'wind_direction_10m',
  'wind_gusts_10m',
] as const;

const HOURLY = [
  'temperature_2m',
  'weather_code',
  'precipitation_probability',
  'precipitation',
  'is_day',
  'uv_index',
  'visibility',
] as const;

const DAILY = [
  'weather_code',
  'temperature_2m_max',
  'temperature_2m_min',
  'sunrise',
  'sunset',
  'uv_index_max',
  'precipitation_sum',
  'precipitation_probability_max',
  'wind_speed_10m_max',
] as const;

const MINUTELY_15 = ['precipitation', 'weather_code'] as const;

type Series<K extends string> = { time: number[] } & Record<
  K,
  Array<number | null>
>;

export type OpenMeteoForecast = {
  latitude: number;
  longitude: number;
  timezone: string;
  utc_offset_seconds: number;
  current: { time: number } & Record<(typeof CURRENT)[number], number>;
  hourly: Series<(typeof HOURLY)[number]>;
  daily: Series<(typeof DAILY)[number]>;
  minutely_15?: Series<(typeof MINUTELY_15)[number]>;
};

// Always requested in °C and m/s: the cache stays valid when the user switches
// units, and conversion happens at display time.
export const getForecast = async (
  latitude: number,
  longitude: number,
  signal?: AbortSignal,
) => {
  const { data } = await forecastApi.get<OpenMeteoForecast>('forecast', {
    signal,
    params: {
      latitude: coarseCoordinate(latitude),
      longitude: coarseCoordinate(longitude),
      current: CURRENT.join(','),
      hourly: HOURLY.join(','),
      daily: DAILY.join(','),
      minutely_15: MINUTELY_15.join(','),
      forecast_minutely_15: 12,
      forecast_days: FORECAST_DAYS,
      timezone: 'auto',
      timeformat: 'unixtime',
      wind_speed_unit: 'ms',
    },
  });
  return data;
};
