import { useQuery } from '@tanstack/react-query';

import { coarseCoordinate, getForecast } from '@shared/api';
import { CACHE_MAX_AGE, FORECAST_STALE_TIME } from '@shared/config';

import { toForecast } from './mapper';

type Coordinates = { latitude: number; longitude: number };

// The same ~1 km grid the request uses: small GPS jitter reuses the same
// cache entry, and one entry always matches one request.
export const forecastQueryKey = ({ latitude, longitude }: Coordinates) =>
  [
    'forecast',
    coarseCoordinate(latitude),
    coarseCoordinate(longitude),
  ] as const;

export const fetchForecast = async (
  { latitude, longitude }: Coordinates,
  signal?: AbortSignal,
) => toForecast(await getForecast(latitude, longitude, signal), Date.now());

export const useForecast = (place: Coordinates | null | undefined) =>
  useQuery({
    queryKey: place ? forecastQueryKey(place) : ['forecast', 'none'],
    queryFn: ({ signal }) => fetchForecast(place!, signal),
    enabled: Boolean(place),
    staleTime: FORECAST_STALE_TIME,
    gcTime: CACHE_MAX_AGE,
  });
