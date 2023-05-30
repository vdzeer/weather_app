export type ListObject = {
  dt: number;
  sunrise: number;
  sunset: number;
  temp: number;
  feels_like: number;
  pressure: number;
  humidity: number;
  dew_point: number;
  clouds: number;
  uvi: number;
  visibility: number;
  wind_speed: number;
  wind_gust: number;
  wind_deg: number;
  rain: { '1h': number };
  snow: { '1h': number };
  weather: {
    id: number;
    main:
      | 'Haze'
      | 'Rain'
      | 'Snow'
      | 'Thunderstorm'
      | 'Drizzle'
      | 'Mist'
      | 'Clouds'
      | 'Clear';
    description: string;
    icon: number;
  }[];
};

export type TWeatherData = {
  lat: number;
  lon: number;
  timezone: string;
  timezone_offset: string;
  current: ListObject;
  minutely: {
    dt: number;
    precipitation: number;
  };
  hourly: ListObject;
  daily: ListObject[];
};

export type WeatherStoreData = {
  day: string;
  main:
    | 'Haze'
    | 'Rain'
    | 'Snow'
    | 'Thunderstorm'
    | 'Drizzle'
    | 'Mist'
    | 'Clouds'
    | 'Clear';
  temp: number;
  hours: number;
  humidity: number;
  wind_speed: number;
  pressure: number;
  name?: string;
  daysData: string[];
  tempData: number[];
};

export type WeatherStoreDataSearch = Omit<
  WeatherStoreData,
  'daysData' | 'tempData'
>;

export type WeatherDataByName = {
  name: string;
  main: {
    temp: number;
    pressure: number;
    humidity: number;
  };
  wind: {
    speed: number;
  };
} & Pick<ListObject, 'weather'>;
