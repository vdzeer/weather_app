import type { Strings } from './i18n/uk';

export type TemperatureUnit = 'celsius' | 'fahrenheit';
export type WindUnit = 'ms' | 'kmh' | 'mph';
export type PressureUnit = 'mmHg' | 'hPa';

export type Units = {
  temperature: TemperatureUnit;
  wind: WindUnit;
  pressure: PressureUnit;
};

// Math.round(-0.4) is -0; `|| 0` turns it into a plain 0 so we never print "−0°".
const round = (value: number) => Math.round(value) || 0;

export const convertTemperature = (celsius: number, unit: TemperatureUnit) =>
  unit === 'fahrenheit' ? (celsius * 9) / 5 + 32 : celsius;

// Uses a real minus sign (U+2212): it is as wide as the digits, so numbers don't jump.
export const formatTemperature = (celsius: number, unit: TemperatureUnit) => {
  const value = round(convertTemperature(celsius, unit));
  return `${value < 0 ? '−' : ''}${Math.abs(value)}°`;
};

export const convertWind = (metersPerSecond: number, unit: WindUnit) => {
  switch (unit) {
    case 'kmh':
      return metersPerSecond * 3.6;
    case 'mph':
      return metersPerSecond * 2.236936;
    default:
      return metersPerSecond;
  }
};

export const formatWind = (
  metersPerSecond: number,
  unit: WindUnit,
  strings: Strings,
) => `${round(convertWind(metersPerSecond, unit))} ${strings.unitLabels[unit]}`;

export const formatPressure = (
  hectopascals: number,
  unit: PressureUnit,
  strings: Strings,
) => {
  const value = unit === 'mmHg' ? hectopascals * 0.750062 : hectopascals;
  return `${round(value)} ${strings.unitLabels[unit]}`;
};

// Wind direction is where the wind blows FROM, in degrees clockwise from north.
export const compassPoint = (degrees: number, strings: Strings) =>
  strings.compass[Math.round((((degrees % 360) + 360) % 360) / 45) % 8];

export type UvLevel = keyof Strings['uv'];

export const uvLevel = (uv: number): UvLevel => {
  if (uv < 3) {
    return 'low';
  }
  if (uv < 6) {
    return 'moderate';
  }
  if (uv < 8) {
    return 'high';
  }
  if (uv < 11) {
    return 'veryHigh';
  }
  return 'extreme';
};

export const formatPercent = (value: number) => `${round(value)}%`;

export const formatPrecipitation = (mm: number, strings: Strings) =>
  `${mm >= 10 || mm === 0 ? round(mm) : mm.toFixed(1)} ${
    strings.unitLabels.mm
  }`;

export const formatVisibility = (meters: number, strings: Strings) => {
  const km = meters / 1000;
  return `${km >= 10 ? round(km) : km.toFixed(1)} ${strings.unitLabels.km}`;
};

export const defaultUnits = (
  country: string,
  temperature: TemperatureUnit,
): Units => {
  const imperial = ['US', 'LR', 'MM'].includes(country);
  // Local forecasts in these countries quote wind in m/s and pressure in mmHg.
  const msAndMmHg = ['UA', 'MD', 'KZ', 'GE', 'AM', 'AZ'].includes(country);
  return {
    temperature,
    wind: imperial ? 'mph' : msAndMmHg ? 'ms' : 'kmh',
    pressure: msAndMmHg ? 'mmHg' : 'hPa',
  };
};
