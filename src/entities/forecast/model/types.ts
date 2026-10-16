// All temperatures in °C, wind in m/s, pressure in hPa, times in unix seconds.

export type CurrentConditions = {
  time: number;
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  weatherCode: number;
  isDay: boolean;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
  pressure: number;
  precipitation: number;
  uvIndex: number;
  visibility: number;
};

export type HourPoint = {
  time: number;
  temperature: number;
  weatherCode: number;
  isDay: boolean;
  precipitationProbability: number;
  precipitation: number;
};

export type DayPoint = {
  time: number;
  weatherCode: number;
  min: number;
  max: number;
  precipitationProbability: number;
  precipitationSum: number;
  sunrise: number;
  sunset: number;
  uvIndexMax: number;
  windSpeedMax: number;
};

export type QuarterHourPoint = {
  time: number;
  precipitation: number;
  weatherCode: number;
};

export type Forecast = {
  fetchedAt: number;
  timezone: string;
  utcOffsetSeconds: number;
  current: CurrentConditions;
  hours: HourPoint[];
  days: DayPoint[];
  quarterHours: QuarterHourPoint[];
};
