import { useCallback, useEffect, useState } from 'react';
import { AppState } from 'react-native';

import { notifications } from '@shared/native';

export type NotificationPermission = 'unknown' | 'granted' | 'denied';

export const useNotificationPermission = () => {
  const [permission, setPermission] =
    useState<NotificationPermission>('unknown');

  const check = useCallback(async () => {
    setPermission((await notifications.hasPermission()) ? 'granted' : 'denied');
  }, []);

  useEffect(() => {
    check();
    // The user may come back from system settings with a different answer.
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active') {
        check();
      }
    });
    return () => subscription.remove();
  }, [check]);

  // Resolves to whether notifications can be shown now.
  const ensure = useCallback(async () => {
    if (await notifications.hasPermission()) {
      setPermission('granted');
      return true;
    }
    const granted = await notifications.requestPermission();
    setPermission(granted ? 'granted' : 'denied');
    return granted;
  }, []);

  return { permission, ensure };
};
