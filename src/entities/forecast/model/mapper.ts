import type { OpenMeteoForecast } from '@shared/api/openMeteo';

import type { Forecast, HourPoint } from './types';

const num = (value: number | null | undefined, fallback = 0) =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback;

// Index of the hour that contains `unix` (hourly values are on the hour).
export const hourIndexAt = (hours: { time: number }[], unix: number) => {
  for (let i = hours.length - 1; i >= 0; i -= 1) {
    if (hours[i].time <= unix) {
      return i;
    }
  }
  return 0;
};

export const toForecast = (
  raw: OpenMeteoForecast,
  fetchedAt: number,
): Forecast => {
  const { hourly, daily, current } = raw;

  const hours: HourPoint[] = hourly.time.map((time, i) => ({
    time,
    temperature: num(hourly.temperature_2m[i]),
    weatherCode: num(hourly.weather_code[i], 3),
    isDay: num(hourly.is_day[i], 1) === 1,
    precipitationProbability: num(hourly.precipitation_probability[i]),
    precipitation: num(hourly.precipitation[i]),
  }));

  const nowIndex = hourIndexAt(hours, current.time);

  return {
    fetchedAt,
    timezone: raw.timezone,
    utcOffsetSeconds: raw.utc_offset_seconds,
    current: {
      time: current.time,
      temperature: num(current.temperature_2m),
      apparentTemperature: num(current.apparent_temperature),
      humidity: num(current.relative_humidity_2m),
      weatherCode: num(current.weather_code, 3),
      isDay: num(current.is_day, 1) === 1,
      windSpeed: num(current.wind_speed_10m),
      windDirection: num(current.wind_direction_10m),
      windGusts: num(current.wind_gusts_10m),
      pressure: num(current.pressure_msl),
      precipitation: num(current.precipitation),
      // Not available as "current" variables; take them from this hour.
      uvIndex: num(hourly.uv_index[nowIndex]),
      visibility: num(hourly.visibility[nowIndex], 10_000),
    },
    hours,
    days: daily.time.map((time, i) => ({
      time,
      weatherCode: num(daily.weather_code[i], 3),
      min: num(daily.temperature_2m_min[i]),
      max: num(daily.temperature_2m_max[i]),
      precipitationProbability: num(daily.precipitation_probability_max[i]),
      precipitationSum: num(daily.precipitation_sum[i]),
      sunrise: num(daily.sunrise[i]),
      sunset: num(daily.sunset[i]),
      uvIndexMax: num(daily.uv_index_max[i]),
      windSpeedMax: num(daily.wind_speed_10m_max[i]),
    })),
    quarterHours: (raw.minutely_15?.time ?? []).map((time, i) => ({
      time,
      precipitation: num(raw.minutely_15?.precipitation[i]),
      weatherCode: num(raw.minutely_15?.weather_code[i], 3),
    })),
  };
};

// The next `count` hours starting with the current one. While the data is
// fresh, the first entry uses the live "current" values so the strip agrees
// with the big number.
export const upcomingHours = (
  forecast: Forecast,
  count: number,
  nowUnix: number,
): HourPoint[] => {
  const start = hourIndexAt(forecast.hours, nowUnix);
  const currentIsThisHour =
    hourIndexAt(forecast.hours, forecast.current.time) === start;
  return forecast.hours.slice(start, start + count).map((hour, i) =>
    i === 0 && currentIsThisHour
      ? {
          ...hour,
          temperature: forecast.current.temperature,
          weatherCode: forecast.current.weatherCode,
          isDay: forecast.current.isDay,
        }
      : hour,
  );
};
