import React, { useEffect, useMemo, useState } from 'react';
import { TextInput, View } from 'react-native';

import { DailyData, WeatherData } from 'entities';
import { LIGHT05 } from 'shared/constants/colors';
import { styles } from './styles.module';
import { useDebounce } from './config';
import { useGetCityWeatherByName } from 'entities/weather/model';
import { Loading } from 'shared/ui';
import { WeatherStoreDataSearch } from 'shared/api';

export const DayWeatherSearch = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const debouncedSearchTerm = useDebounce(searchTerm, 1000);

  const handleSearch = (value: string) => setSearchTerm(value);

  const { data, isLoading, isError } = useGetCityWeatherByName(
    debouncedSearchTerm,
    {
      enabled: Boolean(debouncedSearchTerm),
    },
  );

  const weatherData = useMemo(() => {
    if (!data) return null;

    const { main } = data.weather[0];
    const { temp, pressure, humidity } = data.main;
    const { speed } = data.wind;
    const { name } = data;

    const weatherData: WeatherStoreDataSearch = {
      day: new Date().toDateString(),
      hours: new Date().getHours(),
      main: main,
      temp,
      humidity,
      wind_speed: speed,
      pressure,
      name,
    };

    return weatherData;
  }, [data]);

  return (
    <View style={styles.container}>
      <View style={styles.searchWrapper}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Cities"
          placeholderTextColor={LIGHT05}
          keyboardType="web-search"
          value={searchTerm}
          onChangeText={handleSearch}
        />
      </View>

      {isLoading || isError || !weatherData ? (
        <Loading />
      ) : (
        <>
          <WeatherData weatherData={weatherData} />
        </>
      )}
    </View>
  );
};
