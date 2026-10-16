import { pickPlaceName } from '../src/shared/api/geocoding';

const ukraine = (city: string, locality: string, settlement?: string) => ({
  city,
  locality,
  localityInfo: {
    administrative: [
      { name: 'Україна', adminLevel: 2 },
      { name: city, adminLevel: 6 },
      ...(settlement ? [{ name: settlement, adminLevel: 9 }] : []),
    ],
  },
});

describe('pickPlaceName', () => {
  it('uses the city when it is a real city', () => {
    expect(pickPlaceName({ city: 'Київ', locality: 'Печерський район' })).toBe(
      'Київ',
    );
    expect(pickPlaceName({ city: 'Нью-Йорк', locality: 'Мангеттен' })).toBe(
      'Нью-Йорк',
    );
  });

  it('replaces a raion with the settlement inside it', () => {
    expect(
      pickPlaceName(
        ukraine('Львівський район', 'Галицький район (Львів)', 'Львів'),
      ),
    ).toBe('Львів');
    expect(
      pickPlaceName(
        ukraine(
          'Бучанський район',
          'Петропавлівська Борщагівка',
          'Петропавлівська Борщагівка',
        ),
      ),
    ).toBe('Петропавлівська Борщагівка');
  });

  it('falls back to locality, then to whatever there is', () => {
    expect(pickPlaceName(ukraine('Вінницький район', 'Вінниця'))).toBe(
      'Вінниця',
    );
    expect(pickPlaceName({ city: 'Lviv Raion' })).toBe('Lviv Raion');
    expect(pickPlaceName({})).toBeNull();
  });
});
