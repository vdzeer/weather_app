export const APP_GROUP = 'group.vdzeer.weather';

export const FORECAST_URL = 'https://api.open-meteo.com/v1/';
export const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/';
// Client-side reverse geocoding: free, no key, meant to be called with the
// device's own coordinates — which is the only way we use it.
export const REVERSE_GEOCODING_URL = 'https://api.bigdatacloud.net/data/';

export const FORECAST_DAYS = 10;
export const HOURLY_WINDOW = 24;
export const FORECAST_STALE_TIME = 10 * 60 * 1000;
export const CACHE_MAX_AGE = 24 * 60 * 60 * 1000;

export const SEARCH_MIN_LENGTH = 2;
export const SEARCH_DEBOUNCE_MS = 350;

export const BACKGROUND_TASK_INTERVAL_MIN = 30;
export const MORNING_DAYS_AHEAD = 3;
export const RAIN_LOOKAHEAD_MIN = 120;
export const RAIN_ALERT_COOLDOWN_MS = 3 * 60 * 60 * 1000;
