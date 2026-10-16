import { createAsyncStorage } from '@react-native-async-storage/async-storage';

export const storage = createAsyncStorage('weather');

export const STORAGE_KEYS = {
  places: 'places',
  settings: 'settings',
  queryCache: 'query-cache',
  lastRainAlert: 'last-rain-alert',
} as const;
