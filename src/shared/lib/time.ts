// Open-Meteo returns unix seconds plus the location's UTC offset. Shifting the
// timestamp by that offset and reading it with the UTC getters gives the
// location's wall-clock time regardless of the phone's own time zone.

export const toLocalDate = (unix: number, utcOffsetSeconds: number) =>
  new Date((unix + utcOffsetSeconds) * 1000);

const pad = (n: number) => String(n).padStart(2, '0');

export const formatClock = (
  hours: number,
  minutes: number,
  hour12: boolean,
) => {
  if (!hour12) {
    return `${pad(hours)}:${pad(minutes)}`;
  }
  const suffix = hours < 12 ? 'AM' : 'PM';
  const h = hours % 12 || 12;
  return minutes === 0 ? `${h} ${suffix}` : `${h}:${pad(minutes)} ${suffix}`;
};

export const formatTime = (
  unix: number,
  utcOffsetSeconds: number,
  hour12: boolean,
) => {
  const d = toLocalDate(unix, utcOffsetSeconds);
  return formatClock(d.getUTCHours(), d.getUTCMinutes(), hour12);
};

export const weekdayOf = (unix: number, utcOffsetSeconds: number) =>
  toLocalDate(unix, utcOffsetSeconds).getUTCDay();

export const localDayKey = (unix: number, utcOffsetSeconds: number) =>
  toLocalDate(unix, utcOffsetSeconds).toISOString().slice(0, 10);

// Same key for a Date in the phone's own time zone.
export const deviceDayKey = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

// Time on the phone's clock, for "updated at" labels.
export const formatDeviceTime = (ms: number, hour12: boolean) => {
  const d = new Date(ms);
  return formatClock(d.getHours(), d.getMinutes(), hour12);
};
