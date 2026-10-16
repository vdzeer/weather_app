import { useCallback, useEffect, useState } from 'react';
import { AppState, PermissionsAndroid, Platform } from 'react-native';
import Geolocation, {
  type GeolocationError,
} from '@react-native-community/geolocation';

import { CURRENT_PLACE_ID, usePlacesStore, type Place } from '@entities/place';
import { reverseGeocode } from '@shared/api';
import { language, strings } from '@shared/lib/i18n';

Geolocation.setRNConfiguration({
  // We ask explicitly, after explaining why, never as a side effect.
  skipPermissionRequests: true,
  authorizationLevel: 'whenInUse',
  // Fused location returns an approximate fix from any source (GPS included)
  // with only the coarse permission. Without Play Services the library falls
  // back to Android's LocationManager.
  locationProvider: 'playServices',
});

const COARSE = PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION;
const PERMISSION_DENIED = 1;
const TIMEOUT = 3;
// Re-run reverse geocoding only after moving this far.
const RENAME_DISTANCE_KM = 2;

const requestPosition = (enableHighAccuracy: boolean, timeout: number) =>
  new Promise<{ latitude: number; longitude: number }>((resolve, reject) =>
    Geolocation.getCurrentPosition(
      ({ coords }) =>
        resolve({ latitude: coords.latitude, longitude: coords.longitude }),
      reject,
      { enableHighAccuracy, timeout, maximumAge: 10 * 60_000 },
    ),
  );

const requestPermission = (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    return PermissionsAndroid.request(COARSE).then(
      result => result === PermissionsAndroid.RESULTS.GRANTED,
    );
  }
  // On iOS requestAuthorization only answers when the status *changes*. If the
  // user already decided (or turned Location Services off) it never calls
  // back, so a position request settles it too: it fails at once when access
  // is denied and succeeds once access is granted.
  return new Promise(resolve => {
    let settled = false;
    const settle = (granted: boolean) => {
      if (!settled) {
        settled = true;
        resolve(granted);
      }
    };
    Geolocation.requestAuthorization(
      () => settle(true),
      () => settle(false),
    );
    requestPosition(false, 60_000).then(
      () => settle(true),
      (error: GeolocationError) => {
        if (error.code !== TIMEOUT) {
          settle(false);
        }
      },
    );
    // Don't leave the button hanging; the next foreground refresh corrects it.
    setTimeout(() => settle(false), 65_000);
  });
};

// Network location is fast and enough for a forecast, but it isn't always
// available (no Wi-Fi/cell location, some ROMs). Fall back to GPS then.
const getPosition = async () => {
  try {
    return await requestPosition(false, 10_000);
  } catch (error) {
    if ((error as GeolocationError).code === PERMISSION_DENIED) {
      throw error;
    }
    return requestPosition(true, 20_000);
  }
};

const distanceKm = (
  a: { latitude: number; longitude: number },
  b: { latitude: number; longitude: number },
) => {
  const rad = Math.PI / 180;
  const dLat = (b.latitude - a.latitude) * rad;
  const dLon = (b.longitude - a.longitude) * rad;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(a.latitude * rad) *
      Math.cos(b.latitude * rad) *
      Math.sin(dLon / 2) ** 2;
  return 12_742 * Math.asin(Math.sqrt(h));
};

const resolvePlace = async (
  coords: { latitude: number; longitude: number },
  previous: Place | null,
): Promise<Place> => {
  const base = { id: CURRENT_PLACE_ID, ...coords };
  if (
    previous &&
    previous.name !== strings.myLocation &&
    distanceKm(previous, coords) < RENAME_DISTANCE_KM
  ) {
    return { ...previous, ...base };
  }
  try {
    const found = await reverseGeocode(
      coords.latitude,
      coords.longitude,
      language,
    );
    if (found) {
      return { ...base, ...found };
    }
  } catch {
    // Offline or the service is down: the forecast still works without a name.
  }
  return { ...base, name: strings.myLocation };
};

export const useCurrentLocation = () => {
  const permission = usePlacesStore(s => s.locationPermission);
  const setPermission = usePlacesStore(s => s.setLocationPermission);
  const setCurrent = usePlacesStore(s => s.setCurrent);
  // Starts true when we already have access: the first lookup runs on mount.
  const [locating, setLocating] = useState(
    () => usePlacesStore.getState().locationPermission === 'granted',
  );

  const refresh = useCallback(async () => {
    // Before onboarding we don't touch location at all.
    if (usePlacesStore.getState().locationPermission === 'undetermined') {
      setLocating(false);
      return;
    }
    if (
      Platform.OS === 'android' &&
      !(await PermissionsAndroid.check(COARSE))
    ) {
      setPermission('denied');
      setLocating(false);
      return;
    }
    setLocating(true);
    try {
      const coords = await getPosition();
      // Covers the user turning access back on in system settings.
      setPermission('granted');
      setCurrent(await resolvePlace(coords, usePlacesStore.getState().current));
    } catch (error) {
      if ((error as GeolocationError).code === PERMISSION_DENIED) {
        setPermission('denied');
      }
    } finally {
      setLocating(false);
    }
  }, [setCurrent, setPermission]);

  const request = useCallback(async () => {
    const granted = await requestPermission();
    setPermission(granted ? 'granted' : 'denied');
    if (granted) {
      await refresh();
    }
  }, [refresh, setPermission]);

  useEffect(() => {
    refresh();
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active') {
        refresh();
      }
    });
    return () => subscription.remove();
  }, [refresh]);

  return { permission, locating, request, retry: refresh };
};
