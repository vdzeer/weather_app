import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { GeocodingResult } from '@shared/api';
import { storage, STORAGE_KEYS } from '@shared/lib/storage';

export type Place = {
  id: string;
  name: string;
  region?: string;
  country?: string;
  latitude: number;
  longitude: number;
};

export const CURRENT_PLACE_ID = 'current';

export type LocationPermission = 'undetermined' | 'granted' | 'denied';

type PlacesState = {
  saved: Place[];
  // Last known device position, with a human-readable name when we have one.
  current: Place | null;
  locationPermission: LocationPermission;
  add: (place: Place) => void;
  remove: (id: string) => void;
  setCurrent: (place: Place | null) => void;
  setLocationPermission: (permission: LocationPermission) => void;
};

export const usePlacesStore = create<PlacesState>()(
  persist(
    set => ({
      saved: [],
      current: null,
      locationPermission: 'undetermined',
      add: place =>
        set(state =>
          state.saved.some(p => p.id === place.id)
            ? state
            : { saved: [...state.saved, place] },
        ),
      remove: id =>
        set(state => ({ saved: state.saved.filter(p => p.id !== id) })),
      setCurrent: current => set({ current }),
      setLocationPermission: locationPermission => set({ locationPermission }),
    }),
    {
      name: STORAGE_KEYS.places,
      storage: createJSONStorage(() => storage),
      version: 1,
    },
  ),
);

// Pages shown on the home screen, in order. Use with `useShallow`.
export const selectPlaces = (state: PlacesState): Place[] =>
  state.locationPermission === 'granted' && state.current
    ? [state.current, ...state.saved]
    : state.saved;

// The place notifications and the iOS widget follow.
export const selectPrimaryPlace = (state: PlacesState): Place | null =>
  selectPlaces(state)[0] ?? null;

export const isCurrentPlace = (place: Place) => place.id === CURRENT_PLACE_ID;

export const placeSubtitle = (place: Pick<Place, 'region' | 'country'>) =>
  [place.region, place.country]
    .filter((part, i, parts) => part && parts.indexOf(part) === i)
    .join(', ');

export const placeFromGeocoding = (result: GeocodingResult): Place => ({
  id: String(result.id),
  name: result.name,
  region: result.admin1,
  country: result.country,
  latitude: result.latitude,
  longitude: result.longitude,
});
