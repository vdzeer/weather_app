import axios from 'axios';

import {
  FORECAST_URL,
  GEOCODING_URL,
  REVERSE_GEOCODING_URL,
} from '@shared/config';

const TIMEOUT_MS = 15_000;

export const forecastApi = axios.create({
  baseURL: FORECAST_URL,
  timeout: TIMEOUT_MS,
});

export const geocodingApi = axios.create({
  baseURL: GEOCODING_URL,
  timeout: TIMEOUT_MS,
});

export const reverseGeocodingApi = axios.create({
  baseURL: REVERSE_GEOCODING_URL,
  timeout: TIMEOUT_MS,
});
