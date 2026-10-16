import { useEffect } from 'react';

import { useForecast } from '@entities/forecast';
import { selectPrimaryPlace, usePlacesStore } from '@entities/place';
import { useSettingsStore } from '@entities/settings';
import { scheduleMorningForecasts } from '@features/notifications';
import { syncWidget } from '@features/widget-sync';

// Whenever the primary place gets fresh data (or settings change), push it to
// the iOS widget and re-plan the morning notifications.
export const PrimaryPlaceSync = () => {
  const place = usePlacesStore(selectPrimaryPlace);
  const { data: forecast } = useForecast(place);
  const units = useSettingsStore(s => s.units);
  const settings = useSettingsStore(s => s.notifications);

  useEffect(() => {
    if (!place || !forecast) {
      return;
    }
    syncWidget(place, forecast, units);
    scheduleMorningForecasts({ forecast, place, units, settings }).catch(
      () => {},
    );
  }, [place, forecast, units, settings]);

  return null;
};
