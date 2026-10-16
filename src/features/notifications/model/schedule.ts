import type { Forecast } from '@entities/forecast';
import type { Place } from '@entities/place';
import type { NotificationSettings } from '@entities/settings';
import {
  MORNING_DAYS_AHEAD,
  RAIN_ALERT_COOLDOWN_MS,
  RAIN_LOOKAHEAD_MIN,
} from '@shared/config';
import { hour12, strings } from '@shared/lib/i18n';
import { storage, STORAGE_KEYS } from '@shared/lib/storage';
import { deviceDayKey, localDayKey } from '@shared/lib/time';
import type { Units } from '@shared/lib/units';
import { notifications } from '@shared/native';

import {
  buildMorningMessage,
  buildPrecipitationMessage,
} from '../lib/messages';
import { findUpcomingPrecipitation } from '../lib/precipitation';

type Input = {
  forecast: Forecast;
  place: Place;
  units: Units;
  settings: NotificationSettings;
  now?: Date;
};

const MORNING_IDS = Array.from(
  { length: MORNING_DAYS_AHEAD },
  (_, i) => `morning-${i}`,
);

// Local notifications carry fixed text, so we schedule the next few mornings
// with each day's own forecast and replace them whenever fresh data arrives.
export const scheduleMorningForecasts = async ({
  forecast,
  place,
  units,
  settings,
  now = new Date(),
}: Input) => {
  MORNING_IDS.forEach(notifications.cancel);
  if (!settings.morning || !(await notifications.hasPermission())) {
    return;
  }

  const [hours, minutes] = settings.morningTime.split(':').map(Number);
  const context = { placeName: place.name, units, strings, hour12 };
  let slot = 0;

  for (
    let i = 0;
    i <= MORNING_DAYS_AHEAD && slot < MORNING_DAYS_AHEAD;
    i += 1
  ) {
    const at = new Date(now);
    at.setDate(now.getDate() + i);
    at.setHours(hours, minutes, 0, 0);
    if (at <= now) {
      continue;
    }
    const key = deviceDayKey(at);
    const day = forecast.days.find(
      d => localDayKey(d.time, forecast.utcOffsetSeconds) === key,
    );
    if (!day) {
      continue;
    }
    const { title, body } = buildMorningMessage(forecast, day, context);
    notifications.schedule(MORNING_IDS[slot], title, body, at);
    slot += 1;
  }
};

export const checkPrecipitationAlert = async ({
  forecast,
  place,
  units,
  settings,
  now = new Date(),
}: Input) => {
  if (!settings.rain) {
    return;
  }
  const upcoming = findUpcomingPrecipitation(
    forecast,
    Math.floor(now.getTime() / 1000),
    RAIN_LOOKAHEAD_MIN,
  );
  if (!upcoming) {
    return;
  }
  const last = Number(await storage.getItem(STORAGE_KEYS.lastRainAlert)) || 0;
  if (now.getTime() - last < RAIN_ALERT_COOLDOWN_MS) {
    return;
  }
  if (!(await notifications.hasPermission())) {
    return;
  }
  const { title, body } = buildPrecipitationMessage(forecast, upcoming, {
    placeName: place.name,
    units,
    strings,
    hour12,
  });
  notifications.show('precipitation', title, body);
  await storage.setItem(STORAGE_KEYS.lastRainAlert, String(now.getTime()));
};
