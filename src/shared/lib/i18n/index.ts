import {
  findBestLanguageTag,
  getCountry,
  getTemperatureUnit,
  uses24HourClock,
} from 'react-native-localize';

import { en } from './en';
import { uk, type Strings } from './uk';

export type { Strings };
export type Language = 'uk' | 'en';

const dictionaries: Record<Language, Strings> = { uk, en };

export const language: Language =
  (findBestLanguageTag(['uk', 'en'])?.languageTag as Language | undefined) ??
  'en';

export const strings: Strings = dictionaries[language];

export const hour12 = !uses24HourClock();

export const deviceRegion = {
  country: getCountry(),
  temperatureUnit: getTemperatureUnit(),
};

export const useStrings = () => strings;
