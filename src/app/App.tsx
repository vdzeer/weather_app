import React, { useEffect, useState } from 'react';
import { AppState, StatusBar } from 'react-native';
import BootSplash from 'react-native-bootsplash';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { focusManager, QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';

import { usePlacesStore } from '@entities/place';
import { useSettingsStore } from '@entities/settings';
import { CACHE_MAX_AGE, FORECAST_STALE_TIME } from '@shared/config';
import { useHydrated } from '@shared/lib/hydration';
import { setupOnlineManager } from '@shared/lib/network';
import { storage, STORAGE_KEYS } from '@shared/lib/storage';

import { configureBackgroundFetch } from './background';
import { Navigation } from './Navigation';
import { PrimaryPlaceSync } from './PrimaryPlaceSync';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: CACHE_MAX_AGE,
      staleTime: FORECAST_STALE_TIME,
      retry: 2,
    },
  },
});

// Forecasts survive restarts, so the app opens instantly and works offline.
const persister = createAsyncStoragePersister({
  storage,
  key: STORAGE_KEYS.queryCache,
  throttleTime: 1000,
});

setupOnlineManager();

export const App = () => {
  const storesReady = useHydrated(usePlacesStore, useSettingsStore);
  const [cacheReady, setCacheReady] = useState(false);
  const [navigationReady, setNavigationReady] = useState(false);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', state =>
      focusManager.setFocused(state === 'active'),
    );
    configureBackgroundFetch().catch(() => {});
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (storesReady && cacheReady && navigationReady) {
      BootSplash.hide({ fade: true });
    }
  }, [storesReady, cacheReady, navigationReady]);

  // Never leave people staring at the splash if something above stalls.
  useEffect(() => {
    const timer = setTimeout(() => BootSplash.hide({ fade: true }), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{
          persister,
          maxAge: CACHE_MAX_AGE,
          buster: 'v2',
          dehydrateOptions: {
            shouldDehydrateQuery: query =>
              query.queryKey[0] === 'forecast' &&
              query.state.status === 'success',
          },
        }}
        onSuccess={() => setCacheReady(true)}
        onError={() => setCacheReady(true)}>
        {storesReady ? (
          <>
            <Navigation onReady={() => setNavigationReady(true)} />
            <PrimaryPlaceSync />
          </>
        ) : null}
      </PersistQueryClientProvider>
    </SafeAreaProvider>
  );
};
