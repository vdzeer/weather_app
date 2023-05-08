import React, { useEffect, useState } from 'react';
import { TextInput, View } from 'react-native';

import { DailyData, WeatherData } from 'entities';
import { LIGHT05 } from 'shared/constants/colors';
import { styles } from './styles.module';
import { useDebounce } from './config';

export const DayWeatherSearch = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const handleSearch = (value: string) => setSearchTerm(value);

  useEffect(() => {
    if (debouncedSearchTerm) {
      ///
    } else {
      ///
    }
  }, [debouncedSearchTerm]);

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

      <WeatherData />

      <View style={styles.dailyWrapper}>
        <DailyData dayData={['']} tempData={[]} />
      </View>
    </View>
  );
};
