import React from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DayWeather } from 'features/day-weather';

import { styles } from './styles.module';

const HomePage = () => {
  return (
    <SafeAreaView style={styles.container}>
      <DayWeather />
    </SafeAreaView>
  );
};

export default HomePage;
