import type { DayPoint, Forecast } from '@entities/forecast';
import type { Strings } from '@shared/lib/i18n/uk';
import { formatTime, localDayKey, toLocalDate } from '@shared/lib/time';
import { formatTemperature, formatWind, type Units } from '@shared/lib/units';
import { conditionLabel, describeWeather } from '@shared/lib/weatherCode';

import type { UpcomingPrecipitation } from './precipitation';

type MessageContext = {
  placeName: string;
  units: Units;
  strings: Strings;
  hour12: boolean;
};

export type Message = { title: string; body: string };

const RAIN_CHANCE = 50;
const DRY_CHANCE = 30;
const STRONG_WIND_MS = 10;
// Rain at night doesn't change anyone's plans for the day.
const DAY_FROM_HOUR = 6;

export const buildMorningMessage = (
  forecast: Forecast,
  day: DayPoint,
  { placeName, units, strings, hour12 }: MessageContext,
): Message => {
  const offset = forecast.utcOffsetSeconds;
  const temp = (c: number) => formatTemperature(c, units.temperature);
  const dayKey = localDayKey(day.time, offset);

  const parts = [`${conditionLabel(day.weatherCode, strings)}.`];

  const wetHour = forecast.hours.find(
    h =>
      localDayKey(h.time, offset) === dayKey &&
      toLocalDate(h.time, offset).getUTCHours() >= DAY_FROM_HOUR &&
      h.precipitationProbability >= RAIN_CHANCE,
  );
  if (wetHour) {
    const time = formatTime(wetHour.time, offset, hour12);
    const chance = Math.round(wetHour.precipitationProbability);
    parts.push(
      describeWeather(wetHour.weatherCode).precipitation === 'snow'
        ? strings.notif.snowFrom(time, chance)
        : strings.notif.rainFrom(time, chance),
    );
  } else if (day.precipitationProbability < DRY_CHANCE) {
    parts.push(strings.notif.dry);
  }

  if (day.windSpeedMax >= STRONG_WIND_MS) {
    parts.push(
      strings.notif.strongWind(
        formatWind(day.windSpeedMax, units.wind, strings),
      ),
    );
  }

  return {
    title: strings.notif.morningTitle(placeName, temp(day.min), temp(day.max)),
    body: parts.join(' '),
  };
};

export const buildPrecipitationMessage = (
  forecast: Forecast,
  upcoming: UpcomingPrecipitation,
  { placeName, strings, hour12 }: MessageContext,
): Message => ({
  title:
    upcoming.kind === 'snow'
      ? strings.notif.snowSoonTitle
      : strings.notif.rainSoonTitle,
  body: strings.notif.soonBody(
    placeName,
    formatTime(upcoming.startsAt, forecast.utcOffsetSeconds, hour12),
  ),
});
