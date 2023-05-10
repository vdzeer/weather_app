import React from 'react';
import { Text, View } from 'react-native';
import { WeatherStoreData, WeatherStoreDataSearch } from 'shared/api';
import { WeatherIcon, WeatherProperty } from 'shared/ui';

import { styles } from './styles.module';

import water from '../../../../../assets/water.png';
import windy from '../../../../../assets/windy.png';
import rainy from '../../../../../assets/rainy.png';

type WeatherDataProps = {
  weatherData: WeatherStoreData | WeatherStoreDataSearch;
};

export const WeatherData = ({ weatherData }: WeatherDataProps) => {
  if (!weatherData) return null;

  return (
    <View style={styles.container}>
      <View style={styles.date}>
        <Text style={styles.dateText}>{weatherData.day}</Text>
      </View>

      <View style={styles.location}>
        <Text style={styles.locationText}>{weatherData?.name ?? 'Today'}</Text>
      </View>

      <WeatherIcon main={weatherData.main} hours={weatherData?.hours ?? 0} />

      <View>
        <Text style={styles.tempText}>
          {weatherData.temp.toFixed(0)}
          <Text style={styles.tempModeText}>°C</Text>
        </Text>
      </View>

      <View>
        <Text style={styles.weatherState}>{weatherData.main}</Text>
      </View>

      <View style={styles.otherData}>
        <WeatherProperty
          icon={water}
          title="Humidity"
          unit="%"
          value={weatherData.humidity}
        />
        <WeatherProperty
          icon={windy}
          title="Wind"
          unit="km/h"
          value={weatherData.wind_speed}
        />
        <WeatherProperty
          icon={rainy}
          title="Pressure"
          unit="hPa"
          value={weatherData.pressure}
        />
      </View>
    </View>
  );
};
