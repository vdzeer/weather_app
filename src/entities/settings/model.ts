import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { deviceRegion } from '@shared/lib/i18n';
import { storage, STORAGE_KEYS } from '@shared/lib/storage';
import { defaultUnits, type Units } from '@shared/lib/units';

export type NotificationSettings = {
  morning: boolean;
  // Local phone time, "HH:MM".
  morningTime: string;
  rain: boolean;
};

type SettingsState = {
  units: Units;
  notifications: NotificationSettings;
  setUnits: (units: Partial<Units>) => void;
  setNotifications: (notifications: Partial<NotificationSettings>) => void;
};

export const MORNING_TIMES = [
  '06:00',
  '06:30',
  '07:00',
  '07:30',
  '08:00',
  '08:30',
  '09:00',
];

export const useSettingsStore = create<SettingsState>()(
  persist(
    set => ({
      units: defaultUnits(deviceRegion.country, deviceRegion.temperatureUnit),
      notifications: { morning: false, morningTime: '07:30', rain: false },
      setUnits: units =>
        set(state => ({ units: { ...state.units, ...units } })),
      setNotifications: notifications =>
        set(state => ({
          notifications: { ...state.notifications, ...notifications },
        })),
    }),
    {
      name: STORAGE_KEYS.settings,
      storage: createJSONStorage(() => storage),
      version: 1,
      partialize: ({ units, notifications }) => ({ units, notifications }),
    },
  ),
);

export const useUnits = () => useSettingsStore(state => state.units);
