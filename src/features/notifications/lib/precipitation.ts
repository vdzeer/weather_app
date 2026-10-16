import type { Forecast } from '@entities/forecast';
import { describeWeather, type Precipitation } from '@shared/lib/weatherCode';

// 0.2 mm in 15 minutes is light but noticeable rain (~0.8 mm/h).
const QUARTER_HOUR_MM = 0.2;
const HOURLY_MM = 0.5;
const HOURLY_CHANCE = 60;

export type UpcomingPrecipitation = {
  // Unix seconds, never earlier than `nowUnix`.
  startsAt: number;
  kind: Precipitation;
};

const kindOf = (code: number): Precipitation =>
  describeWeather(code).precipitation ?? 'rain';

export const isPrecipitatingNow = (forecast: Forecast) =>
  forecast.current.precipitation >= 0.1 ||
  describeWeather(forecast.current.weatherCode).precipitation !== undefined;

// Finds the start of rain or snow within the next `lookaheadMinutes`, if it is
// dry right now. Uses 15-minute data where available, hourly otherwise. Both
// are sums over the *preceding* interval, so the start is interval-adjusted.
export const findUpcomingPrecipitation = (
  forecast: Forecast,
  nowUnix: number,
  lookaheadMinutes: number,
): UpcomingPrecipitation | null => {
  if (isPrecipitatingNow(forecast)) {
    return null;
  }
  const end = nowUnix + lookaheadMinutes * 60;

  const quarters = forecast.quarterHours.filter(
    q => q.time > nowUnix && q.time <= end,
  );
  if (quarters.length > 0) {
    const wet = quarters.find(q => q.precipitation >= QUARTER_HOUR_MM);
    return wet
      ? {
          startsAt: Math.max(nowUnix, wet.time - 15 * 60),
          kind: kindOf(wet.weatherCode),
        }
      : null;
  }

  const wetHour = forecast.hours.find(
    h =>
      h.time > nowUnix &&
      h.time <= end + 3600 &&
      h.precipitationProbability >= HOURLY_CHANCE &&
      h.precipitation >= HOURLY_MM,
  );
  return wetHour
    ? {
        startsAt: Math.max(nowUnix, wetHour.time - 3600),
        kind: kindOf(wetHour.weatherCode),
      }
    : null;
};
