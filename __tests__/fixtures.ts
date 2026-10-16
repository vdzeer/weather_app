import type { OpenMeteoForecast } from '../src/shared/api/openMeteo';

// Kyiv in October: UTC+3. 2026-10-15 00:00 local = 2026-10-14 21:00 UTC.
export const OFFSET = 3 * 3600;
export const DAY_START = Date.UTC(2026, 9, 14, 21) / 1000;
export const NOW = DAY_START + 14 * 3600 + 15 * 60; // 14:15 local

type HourOverrides = Partial<{
  temperature: number;
  code: number;
  chance: number;
  precipitation: number;
}>;

export const makeRaw = (
  hourOverrides: Record<number, HourOverrides> = {},
  quarterPrecipitation: number[] = new Array(12).fill(0),
): OpenMeteoForecast => {
  const hours = Array.from({ length: 48 }, (_, i) => i);
  const at = (i: number) => hourOverrides[i] ?? {};
  return {
    latitude: 50.45,
    longitude: 30.52,
    timezone: 'Europe/Kyiv',
    utc_offset_seconds: OFFSET,
    current: {
      time: NOW,
      temperature_2m: 10.4,
      relative_humidity_2m: 63,
      apparent_temperature: 7.9,
      is_day: 1,
      precipitation: 0,
      weather_code: 3,
      pressure_msl: 1021.5,
      wind_speed_10m: 2.3,
      wind_direction_10m: 2,
      wind_gusts_10m: 6.6,
    },
    hourly: {
      time: hours.map(i => DAY_START + i * 3600),
      temperature_2m: hours.map(i => at(i).temperature ?? 5 + (i % 24) / 3),
      weather_code: hours.map(i => at(i).code ?? 3),
      precipitation_probability: hours.map(i => at(i).chance ?? 5),
      precipitation: hours.map(i => at(i).precipitation ?? 0),
      is_day: hours.map(i => (i % 24 >= 7 && i % 24 < 18 ? 1 : 0)),
      uv_index: hours.map(i => (i % 24 === 14 ? 2.6 : 0)),
      visibility: hours.map(() => 24000),
    },
    daily: {
      time: [DAY_START, DAY_START + 86400],
      weather_code: [3, 61],
      temperature_2m_max: [10.6, 10.3],
      temperature_2m_min: [5.8, -0.4],
      sunrise: [DAY_START + 7 * 3600, DAY_START + 86400 + 7 * 3600],
      sunset: [DAY_START + 18 * 3600, DAY_START + 86400 + 18 * 3600],
      uv_index_max: [2.5, 0.2],
      precipitation_sum: [0, 2.1],
      precipitation_probability_max: [3, 63],
      wind_speed_10m_max: [2.5, 11.2],
    },
    minutely_15: {
      time: quarterPrecipitation.map((_, i) => NOW + (i + 1) * 900),
      precipitation: quarterPrecipitation,
      weather_code: quarterPrecipitation.map(p => (p > 0 ? 61 : 3)),
    },
  };
};
