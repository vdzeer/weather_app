import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type PlaceParam = {
  id: string;
  name: string;
  region?: string;
  country?: string;
  latitude: number;
  longitude: number;
};

export type RootStackParamList = {
  Home: { placeId?: string } | undefined;
  Cities: undefined;
  CityPreview: { place: PlaceParam };
  Settings: undefined;
};

export type ScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;
