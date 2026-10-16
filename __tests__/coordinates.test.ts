import { forecastQueryKey } from '../src/entities/forecast/model/queries';
import { coarseCoordinate } from '../src/shared/api/coordinates';
import { reverseGeocode } from '../src/shared/api/geocoding';
import { forecastApi, reverseGeocodingApi } from '../src/shared/api/http';
import { getForecast } from '../src/shared/api/openMeteo';

jest.mock('../src/shared/api/http', () => ({
  forecastApi: { get: jest.fn() },
  geocodingApi: { get: jest.fn() },
  reverseGeocodingApi: { get: jest.fn() },
}));

const forecastGet = forecastApi.get as jest.Mock;
const reverseGet = reverseGeocodingApi.get as jest.Mock;

const lviv = { latitude: 49.841952, longitude: 24.031592 };
// About 300 m away, in the same 0.01° cell.
const lvivNearby = { latitude: 49.8441, longitude: 24.0341 };

const sentParams = (mock: jest.Mock) => mock.mock.calls.at(-1)[1].params;

beforeEach(() => {
  forecastGet.mockReset().mockResolvedValue({ data: {} });
  reverseGet.mockReset().mockResolvedValue({ data: { city: 'Львів' } });
});

describe('coarseCoordinate', () => {
  it('keeps 2 decimal places', () => {
    expect(coarseCoordinate(49.841952)).toBe('49.84');
    expect(coarseCoordinate(24.036)).toBe('24.04');
    expect(coarseCoordinate(-73.98)).toBe('-73.98');
    expect(coarseCoordinate(30)).toBe('30.00');
  });
});

describe('coordinates sent to the services', () => {
  it('sends the forecast request with 2 decimal places', async () => {
    await getForecast(lviv.latitude, lviv.longitude);
    expect(sentParams(forecastGet)).toMatchObject({
      latitude: '49.84',
      longitude: '24.03',
    });
  });

  it('sends 2 decimal places to reverse geocoding', async () => {
    await expect(
      reverseGeocode(lviv.latitude, lviv.longitude, 'uk'),
    ).resolves.toMatchObject({ name: 'Львів' });
    expect(sentParams(reverseGet)).toEqual({
      latitude: '49.84',
      longitude: '24.03',
      localityLanguage: 'uk',
    });
  });

  it('caches under the coordinates it requests', async () => {
    await getForecast(lviv.latitude, lviv.longitude);
    const { latitude, longitude } = sentParams(forecastGet);
    expect(forecastQueryKey(lviv)).toEqual(['forecast', latitude, longitude]);
  });

  it('shares one cache entry and one request within a cell', async () => {
    expect(forecastQueryKey(lvivNearby)).toEqual(forecastQueryKey(lviv));
    await getForecast(lviv.latitude, lviv.longitude);
    const first = sentParams(forecastGet);
    await getForecast(lvivNearby.latitude, lvivNearby.longitude);
    expect(sentParams(forecastGet)).toEqual(first);
  });
});
