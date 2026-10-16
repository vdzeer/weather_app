import { Platform } from 'react-native';

import { upcomingHours, type Forecast } from '@entities/forecast';
import { isCurrentPlace, type Place } from '@entities/place';
import { language } from '@shared/lib/i18n';
import type { Units } from '@shared/lib/units';
import { widget } from '@shared/native';

// Read by ios/WeatherWidget/WidgetData.swift — keep the two in sync.
export type WidgetPayload = {
  version: 1;
  language: string;
  place: {
    name: string;
    latitude: number;
    longitude: number;
    isCurrent: boolean;
  };
  units: { temperature: Units['temperature']; wind: Units['wind'] };
  snapshot: {
    fetchedAt: number;
    utcOffsetSeconds: number;
    temperature: number;
    weatherCode: number;
    isDay: boolean;
    min: number;
    max: number;
    hours: Array<{
      time: number;
      temperature: number;
      weatherCode: number;
      isDay: boolean;
    }>;
  };
};

export const syncWidget = (place: Place, forecast: Forecast, units: Units) => {
  if (Platform.OS !== 'ios') {
    return;
  }
  const today = forecast.days[0];
  const payload: WidgetPayload = {
    version: 1,
    language,
    place: {
      name: place.name,
      latitude: place.latitude,
      longitude: place.longitude,
      isCurrent: isCurrentPlace(place),
    },
    units: { temperature: units.temperature, wind: units.wind },
    snapshot: {
      fetchedAt: forecast.fetchedAt,
      utcOffsetSeconds: forecast.utcOffsetSeconds,
      temperature: forecast.current.temperature,
      weatherCode: forecast.current.weatherCode,
      isDay: forecast.current.isDay,
      min: today?.min ?? forecast.current.temperature,
      max: today?.max ?? forecast.current.temperature,
      hours: upcomingHours(forecast, 24, forecast.current.time).map(h => ({
        time: h.time,
        temperature: h.temperature,
        weatherCode: h.weatherCode,
        isDay: h.isDay,
      })),
    },
  };
  widget.setData(payload);
};
