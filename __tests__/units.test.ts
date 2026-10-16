import { en } from '../src/shared/lib/i18n/en';
import { uk } from '../src/shared/lib/i18n/uk';
import {
  compassPoint,
  defaultUnits,
  formatPressure,
  formatTemperature,
  formatWind,
  uvLevel,
} from '../src/shared/lib/units';

describe('formatTemperature', () => {
  it('rounds and uses a real minus sign', () => {
    expect(formatTemperature(-3.6, 'celsius')).toBe('−4°');
    expect(formatTemperature(14.5, 'celsius')).toBe('15°');
  });

  it('never prints a negative zero', () => {
    expect(formatTemperature(-0.4, 'celsius')).toBe('0°');
  });

  it('converts to Fahrenheit', () => {
    expect(formatTemperature(0, 'fahrenheit')).toBe('32°');
    expect(formatTemperature(-40, 'fahrenheit')).toBe('−40°');
  });
});

describe('formatWind', () => {
  it('keeps m/s as delivered by the API', () => {
    expect(formatWind(4.4, 'ms', uk)).toBe('4 м/с');
  });

  it('converts to km/h and mph', () => {
    expect(formatWind(10, 'kmh', en)).toBe('36 km/h');
    expect(formatWind(10, 'mph', en)).toBe('22 mph');
  });
});

describe('formatPressure', () => {
  it('converts hPa to mmHg', () => {
    expect(formatPressure(1013.25, 'mmHg', uk)).toBe('760 мм рт. ст.');
    expect(formatPressure(1013.25, 'hPa', en)).toBe('1013 hPa');
  });
});

describe('compassPoint', () => {
  it('maps degrees to 8 points, wrapping around north', () => {
    expect(compassPoint(2, uk)).toBe('північний');
    expect(compassPoint(350, en)).toBe('N');
    expect(compassPoint(225, en)).toBe('SW');
    expect(compassPoint(-90, en)).toBe('W');
  });
});

describe('uvLevel', () => {
  it('follows the WHO bands', () => {
    expect(uvLevel(2.9)).toBe('low');
    expect(uvLevel(3)).toBe('moderate');
    expect(uvLevel(7)).toBe('high');
    expect(uvLevel(10)).toBe('veryHigh');
    expect(uvLevel(11)).toBe('extreme');
  });
});

describe('defaultUnits', () => {
  it('uses m/s and mmHg in Ukraine', () => {
    expect(defaultUnits('UA', 'celsius')).toEqual({
      temperature: 'celsius',
      wind: 'ms',
      pressure: 'mmHg',
    });
  });

  it('uses mph in the US and km/h + hPa elsewhere', () => {
    expect(defaultUnits('US', 'fahrenheit').wind).toBe('mph');
    expect(defaultUnits('DE', 'celsius')).toEqual({
      temperature: 'celsius',
      wind: 'kmh',
      pressure: 'hPa',
    });
  });
});
