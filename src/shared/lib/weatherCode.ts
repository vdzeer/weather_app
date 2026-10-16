import type { Strings } from './i18n/uk';

export type ConditionKey = keyof Strings['conditions'];

export type SkyKind =
  | 'clear'
  | 'partly'
  | 'cloudy'
  | 'fog'
  | 'rain'
  | 'snow'
  | 'storm';

export type Illustration =
  | 'sunny'
  | 'night_clear'
  | 'cloudy'
  | 'night_cloudy'
  | 'mist'
  | 'night_mist'
  | 'overcast'
  | 'drizzle'
  | 'night_drizzle'
  | 'rain'
  | 'snowfall'
  | 'thunderstorm';

export type Precipitation = 'rain' | 'snow';

type WeatherInfo = {
  condition: ConditionKey;
  sky: SkyKind;
  day: Illustration;
  night: Illustration;
  precipitation?: Precipitation;
};

const info = (
  condition: ConditionKey,
  sky: SkyKind,
  day: Illustration,
  night: Illustration = day,
  precipitation?: Precipitation,
): WeatherInfo => ({ condition, sky, day, night, precipitation });

// WMO weather interpretation codes, as used by Open-Meteo.
const TABLE: Record<number, WeatherInfo> = {
  0: info('clear', 'clear', 'sunny', 'night_clear'),
  1: info('mainlyClear', 'clear', 'sunny', 'night_clear'),
  2: info('partlyCloudy', 'partly', 'cloudy', 'night_cloudy'),
  3: info('overcast', 'cloudy', 'overcast'),
  45: info('fog', 'fog', 'mist', 'night_mist'),
  48: info('rimeFog', 'fog', 'mist', 'night_mist'),
  51: info('drizzle', 'rain', 'drizzle', 'night_drizzle', 'rain'),
  53: info('drizzle', 'rain', 'drizzle', 'night_drizzle', 'rain'),
  55: info('drizzle', 'rain', 'drizzle', 'night_drizzle', 'rain'),
  56: info('freezingDrizzle', 'rain', 'drizzle', 'night_drizzle', 'rain'),
  57: info('freezingDrizzle', 'rain', 'drizzle', 'night_drizzle', 'rain'),
  61: info('lightRain', 'rain', 'rain', 'rain', 'rain'),
  63: info('rain', 'rain', 'rain', 'rain', 'rain'),
  65: info('heavyRain', 'rain', 'rain', 'rain', 'rain'),
  66: info('freezingRain', 'rain', 'rain', 'rain', 'rain'),
  67: info('freezingRain', 'rain', 'rain', 'rain', 'rain'),
  71: info('lightSnow', 'snow', 'snowfall', 'snowfall', 'snow'),
  73: info('snow', 'snow', 'snowfall', 'snowfall', 'snow'),
  75: info('heavySnow', 'snow', 'snowfall', 'snowfall', 'snow'),
  77: info('snowGrains', 'snow', 'snowfall', 'snowfall', 'snow'),
  80: info('lightShowers', 'rain', 'rain', 'rain', 'rain'),
  81: info('showers', 'rain', 'rain', 'rain', 'rain'),
  82: info('heavyShowers', 'storm', 'rain', 'rain', 'rain'),
  85: info('snowShowers', 'snow', 'snowfall', 'snowfall', 'snow'),
  86: info('heavySnowShowers', 'snow', 'snowfall', 'snowfall', 'snow'),
  95: info('thunderstorm', 'storm', 'thunderstorm', 'thunderstorm', 'rain'),
  96: info('thunderstormHail', 'storm', 'thunderstorm', 'thunderstorm', 'rain'),
  99: info('thunderstormHail', 'storm', 'thunderstorm', 'thunderstorm', 'rain'),
};

export const describeWeather = (code: number): WeatherInfo =>
  TABLE[code] ?? TABLE[3];

export const illustrationFor = (code: number, isDay: boolean) => {
  const { day, night } = describeWeather(code);
  return isDay ? day : night;
};

export const conditionLabel = (code: number, strings: Strings) =>
  strings.conditions[describeWeather(code).condition];
