import {
  hourIndexAt,
  toForecast,
  upcomingHours,
} from '../src/entities/forecast/model/mapper';
import {
  describeWeather,
  illustrationFor,
} from '../src/shared/lib/weatherCode';
import { temperatureColor } from '../src/shared/theme/temperatureColor';
import { DAY_START, makeRaw, NOW } from './fixtures';

describe('toForecast', () => {
  const forecast = toForecast(makeRaw(), 123);

  it('maps current conditions and takes UV/visibility from this hour', () => {
    expect(forecast.fetchedAt).toBe(123);
    expect(forecast.current.temperature).toBe(10.4);
    expect(forecast.current.isDay).toBe(true);
    expect(forecast.current.uvIndex).toBe(2.6);
    expect(forecast.current.visibility).toBe(24000);
  });

  it('replaces missing values with safe defaults', () => {
    const raw = makeRaw();
    raw.hourly.precipitation_probability[3] = null;
    expect(toForecast(raw, 0).hours[3].precipitationProbability).toBe(0);
  });
});

describe('upcomingHours', () => {
  const forecast = toForecast(makeRaw(), 0);

  it('starts at the current hour and uses live values for it', () => {
    const hours = upcomingHours(forecast, 24, NOW);
    expect(hours).toHaveLength(24);
    expect(hours[0].time).toBe(DAY_START + 14 * 3600);
    expect(hours[0].temperature).toBe(10.4);
    expect(hours[1].time).toBe(DAY_START + 15 * 3600);
  });

  it('does not reuse stale "current" values for a later hour', () => {
    const later = NOW + 3 * 3600;
    const hours = upcomingHours(forecast, 3, later);
    expect(hours[0].time).toBe(DAY_START + 17 * 3600);
    expect(hours[0].temperature).toBe(forecast.hours[17].temperature);
  });

  it('finds the hour containing a timestamp', () => {
    expect(hourIndexAt(forecast.hours, DAY_START + 3599)).toBe(0);
    expect(hourIndexAt(forecast.hours, DAY_START + 3600)).toBe(1);
  });
});

describe('weather codes', () => {
  it('uses night art after dark', () => {
    expect(illustrationFor(0, true)).toBe('sunny');
    expect(illustrationFor(0, false)).toBe('night_clear');
  });

  it('falls back to overcast for unknown codes', () => {
    expect(describeWeather(1234).condition).toBe('overcast');
  });

  it('marks snow codes as snow', () => {
    expect(describeWeather(73).precipitation).toBe('snow');
    expect(describeWeather(61).precipitation).toBe('rain');
    expect(describeWeather(2).precipitation).toBeUndefined();
  });
});

describe('temperatureColor', () => {
  it('is cool for frost and warm for heat', () => {
    expect(temperatureColor(-30)).toBe('#a8b6ff');
    expect(temperatureColor(40)).toBe('#ff7048');
    expect(temperatureColor(10)).toMatch(/^#[0-9a-f]{6}$/);
  });
});
