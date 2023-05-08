import React from 'react';
import { View } from 'react-native';

import { styles } from './styles.module';
import { DailyData, WeatherData } from 'entities';

export const DayWeather = () => {
  return (
    <View style={styles.container}>
      <WeatherData />

      <View style={styles.dailyWrapper}>
        <DailyData dayData={['']} tempData={[]} />
      </View>
    </View>
  );
};
