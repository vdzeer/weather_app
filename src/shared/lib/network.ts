import { useSyncExternalStore } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { onlineManager } from '@tanstack/react-query';

// On iOS NetInfo checks internet reachability itself, by requesting
// clients3.google.com/generate_204 about once a minute. We only need to know
// whether the device has a network (`isConnected`, which comes from the OS),
// so that check stays off. Without it `isInternetReachable` stays false on
// iOS: don't use it. Must run before any listener is added.
NetInfo.configure({ reachabilityShouldRun: () => false });

export const setupOnlineManager = () =>
  onlineManager.setEventListener(setOnline =>
    NetInfo.addEventListener(state => setOnline(Boolean(state.isConnected))),
  );

export const useIsOnline = () =>
  useSyncExternalStore(
    callback => onlineManager.subscribe(callback),
    () => onlineManager.isOnline(),
  );
