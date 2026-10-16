import { toForecast } from '../src/entities/forecast/model/mapper';
import {
  buildMorningMessage,
  buildPrecipitationMessage,
} from '../src/features/notifications/lib/messages';
import { findUpcomingPrecipitation } from '../src/features/notifications/lib/precipitation';
import { en } from '../src/shared/lib/i18n/en';
import { uk } from '../src/shared/lib/i18n/uk';
import type { Units } from '../src/shared/lib/units';
import { makeRaw, NOW } from './fixtures';

const units: Units = { temperature: 'celsius', wind: 'ms', pressure: 'mmHg' };

describe('findUpcomingPrecipitation', () => {
  it('returns nothing when it stays dry', () => {
    const forecast = toForecast(makeRaw(), 0);
    expect(findUpcomingPrecipitation(forecast, NOW, 120)).toBeNull();
  });

  it('uses 15-minute data and the start of the interval', () => {
    const quarters = [0, 0, 0, 0.4, 0.6, 0, 0, 0, 0, 0, 0, 0];
    const forecast = toForecast(makeRaw({}, quarters), 0);
    // 4th slot ends at NOW + 60 min, so rain starts around NOW + 45 min.
    expect(findUpcomingPrecipitation(forecast, NOW, 120)).toEqual({
      startsAt: NOW + 45 * 60,
      kind: 'rain',
    });
  });

  it('ignores drizzle-level amounts', () => {
    const quarters = [0, 0.05, 0.1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const forecast = toForecast(makeRaw({}, quarters), 0);
    expect(findUpcomingPrecipitation(forecast, NOW, 120)).toBeNull();
  });

  it('stays quiet if it is already raining', () => {
    const raw = makeRaw({}, [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0]);
    raw.current.precipitation = 0.8;
    raw.current.weather_code = 63;
    expect(findUpcomingPrecipitation(toForecast(raw, 0), NOW, 120)).toBeNull();
  });

  it('falls back to hourly data and detects snow', () => {
    const raw = makeRaw({ 16: { chance: 80, precipitation: 1.2, code: 73 } });
    delete raw.minutely_15;
    const result = findUpcomingPrecipitation(toForecast(raw, 0), NOW, 120);
    expect(result?.kind).toBe('snow');
  });
});

describe('buildMorningMessage', () => {
  it('summarises a dry day', () => {
    const forecast = toForecast(makeRaw(), 0);
    const message = buildMorningMessage(forecast, forecast.days[0], {
      placeName: 'Київ',
      units,
      strings: uk,
      hour12: false,
    });
    expect(message.title).toBe('Київ: від 6° до 11°');
    expect(message.body).toBe('Хмарно. Без опадів.');
  });

  it('mentions when rain starts and strong wind', () => {
    // Hour 24 + 15 = tomorrow 15:00 local.
    const forecast = toForecast(
      makeRaw({ 39: { chance: 70, precipitation: 1, code: 61 } }),
      0,
    );
    const message = buildMorningMessage(forecast, forecast.days[1], {
      placeName: 'Kyiv',
      units: { ...units, wind: 'kmh' },
      strings: en,
      hour12: false,
    });
    expect(message.title).toBe('Kyiv: 0° to 10°');
    expect(message.body).toBe(
      'Light rain. Rain likely from 15:00 (70%). Wind up to 40 km/h.',
    );
  });
});

describe('buildPrecipitationMessage', () => {
  it('tells when it starts in local time', () => {
    const forecast = toForecast(makeRaw(), 0);
    const message = buildPrecipitationMessage(
      forecast,
      { startsAt: NOW + 45 * 60, kind: 'snow' },
      { placeName: 'Львів', units, strings: uk, hour12: false },
    );
    expect(message).toEqual({
      title: 'Скоро сніг',
      body: 'Львів: опади почнуться близько 15:00.',
    });
  });
});
