import { coarseCoordinate } from './coordinates';
import { geocodingApi, reverseGeocodingApi } from './http';

export type GeocodingResult = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  country_code?: string;
  admin1?: string;
  timezone?: string;
};

export const searchCities = async (
  query: string,
  language: string,
  signal?: AbortSignal,
) => {
  const { data } = await geocodingApi.get<{ results?: GeocodingResult[] }>(
    'search',
    {
      signal,
      params: { name: query.trim(), count: 12, language, format: 'json' },
    },
  );
  return data.results ?? [];
};

export type ReverseGeocodingResponse = {
  city?: string;
  locality?: string;
  principalSubdivision?: string;
  countryName?: string;
  localityInfo?: {
    administrative?: Array<{ name?: string; adminLevel?: number }>;
  };
};

const DISTRICT = /(район|raion|district)$/i;

// Since Ukraine's 2020 reform the service reports the raion as `city`
// ("Львівський район" for Lviv). In that case take the settlement itself,
// which sits at admin level 9.
export const pickPlaceName = (data: ReverseGeocodingResponse) => {
  if (data.city && !DISTRICT.test(data.city)) {
    return data.city;
  }
  const settlement = data.localityInfo?.administrative?.find(
    area => area.adminLevel === 9 && area.name && !DISTRICT.test(area.name),
  )?.name;
  if (settlement) {
    return settlement;
  }
  if (data.locality && !DISTRICT.test(data.locality)) {
    return data.locality;
  }
  return data.city || data.locality || null;
};

export const reverseGeocode = async (
  latitude: number,
  longitude: number,
  language: string,
) => {
  const { data } = await reverseGeocodingApi.get<ReverseGeocodingResponse>(
    'reverse-geocode-client',
    {
      // A city or locality name needs no more than the ~1 km grid.
      params: {
        latitude: coarseCoordinate(latitude),
        longitude: coarseCoordinate(longitude),
        localityLanguage: language,
      },
    },
  );
  const name = pickPlaceName(data);
  if (!name) {
    return null;
  }
  return {
    name,
    region: data.principalSubdivision || undefined,
    country: data.countryName || undefined,
  };
};
