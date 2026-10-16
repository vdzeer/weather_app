import type { Strings } from './uk';

export const en: Strings = {
  locale: 'en',

  now: 'Now',
  today: 'Today',
  feelsLike: (t: string) => `Feels like ${t}`,
  highLow: (high: string, low: string) => `High ${high}, low ${low}`,
  next24h: 'Next 24 hours',
  tenDays: '10-day forecast',
  details: 'Right now',
  humidity: 'Humidity',
  wind: 'Wind',
  gusts: (v: string) => `Gusts up to ${v}`,
  uvIndex: 'UV index',
  pressure: 'Pressure',
  sunrise: 'Sunrise',
  sunset: 'Sunset',
  precipitation: 'Precipitation',
  precipitationToday: 'today',
  visibility: 'Visibility',
  updatedAt: (time: string) => `Updated at ${time}`,
  offline: (time: string) => `You're offline. Forecast as of ${time}.`,
  dataSource: 'Weather data by Open-Meteo.com (CC BY 4.0)',
  myLocation: 'My location',

  loadErrorTitle: "Couldn't load the forecast",
  loadErrorBody: 'Check your internet connection and try again.',
  loadingForecast: 'Loading the forecast…',
  retry: 'Try again',

  welcomeTitle: 'Weather where you are',
  welcomeBody:
    'Allow location access to see your local forecast first. Or find a city yourself.',
  allowLocation: 'Allow location access',
  findCity: 'Find a city',
  locationDeniedTitle: 'Location access is off',
  locationDeniedBody:
    'To see the weather where you are, turn on location access in your phone settings. Or add a city yourself.',
  locating: 'Finding your location…',
  locationFailedTitle: "Couldn't find your location",
  locationFailedBody:
    'Check that location services are on and try again. Or find a city yourself.',
  openSettings: 'Open settings',

  back: 'Back',
  cities: 'Cities',
  searchPlaceholder: 'Find a city',
  searchEmpty: (q: string) => `No cities match “${q}”.`,
  searchError: "Search isn't available offline.",
  add: 'Add',
  cancel: 'Cancel',
  edit: 'Edit',
  done: 'Done',
  removeCity: (name: string) => `Remove ${name}`,
  noSavedCities:
    'Cities you follow will appear here. Use the search above to add one.',
  alreadySaved: 'Already added',

  settings: 'Settings',
  units: 'Units',
  temperature: 'Temperature',
  windSpeed: 'Wind',
  pressureUnit: 'Pressure',
  notifications: 'Notifications',
  morningForecast: 'Morning forecast',
  morningForecastHint: "Every day: the day's temperature, rain and wind.",
  morningTime: 'Time',
  rainAlerts: 'Rain and snow alerts',
  rainAlertsHint:
    'When rain or snow is due within two hours. Checks run in the background, so alerts can be late.',
  notificationsDenied:
    'Notifications are off for this app. Turn them on in your phone settings.',
  notificationsFor: (name: string) => `Forecast for: ${name}`,
  about: 'About',
  version: 'Version',
  openMeteo: 'Data source',

  goToCity: (name: string) => `Go to ${name}`,
  page: (index: number, total: number) => `City ${index} of ${total}`,
  hourA11y: (time: string, temp: string, condition: string, rain: string) =>
    `${time}: ${temp}, ${condition}${rain ? `, ${rain} chance of rain` : ''}`,
  dayA11y: (
    day: string,
    low: string,
    high: string,
    condition: string,
    rain: string,
  ) =>
    `${day}: ${low} to ${high}, ${condition}${
      rain ? `, ${rain} chance of rain` : ''
    }`,

  conditions: {
    clear: 'Clear',
    mainlyClear: 'Mostly clear',
    partlyCloudy: 'Partly cloudy',
    overcast: 'Cloudy',
    fog: 'Fog',
    rimeFog: 'Freezing fog',
    drizzle: 'Drizzle',
    freezingDrizzle: 'Freezing drizzle',
    lightRain: 'Light rain',
    rain: 'Rain',
    heavyRain: 'Heavy rain',
    freezingRain: 'Freezing rain',
    lightSnow: 'Light snow',
    snow: 'Snow',
    heavySnow: 'Heavy snow',
    snowGrains: 'Snow grains',
    lightShowers: 'Light showers',
    showers: 'Showers',
    heavyShowers: 'Heavy showers',
    snowShowers: 'Snow showers',
    heavySnowShowers: 'Heavy snow showers',
    thunderstorm: 'Thunderstorm',
    thunderstormHail: 'Thunderstorm with hail',
  },
  uv: {
    low: 'low',
    moderate: 'moderate',
    high: 'high',
    veryHigh: 'very high',
    extreme: 'extreme',
  },
  weekdaysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  compass: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'],
  unitLabels: {
    celsius: '°C',
    fahrenheit: '°F',
    ms: 'm/s',
    kmh: 'km/h',
    mph: 'mph',
    mmHg: 'mmHg',
    hPa: 'hPa',
    mm: 'mm',
    km: 'km',
  },

  notif: {
    morningTitle: (place: string, low: string, high: string) =>
      `${place}: ${low} to ${high}`,
    dry: 'No rain expected.',
    rainFrom: (time: string, chance: number) =>
      `Rain likely from ${time} (${chance}%).`,
    snowFrom: (time: string, chance: number) =>
      `Snow likely from ${time} (${chance}%).`,
    strongWind: (v: string) => `Wind up to ${v}.`,
    rainSoonTitle: 'Rain soon',
    snowSoonTitle: 'Snow soon',
    soonBody: (place: string, time: string) =>
      `${place}: expect it to start around ${time}.`,
  },
};
