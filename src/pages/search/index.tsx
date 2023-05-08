import React from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DayWeatherSearch } from 'features/day-weather-search';

import { styles } from './styles.module';

const SearchPage = () => {
  return (
    <SafeAreaView style={styles.container}>
      <DayWeatherSearch />
    </SafeAreaView>
  );
};

export default SearchPage;
