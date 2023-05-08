import * as React from 'react';
import { Image, View } from 'react-native';
import { styles } from './styles.module';

export type WeatherIconProps = {
  main:
    | 'Haze'
    | 'Rain'
    | 'Snow'
    | 'Thunderstorm'
    | 'Drizzle'
    | 'Mist'
    | 'Clouds'
    | 'Clear';
  hours?: number;
};

export const WeatherIcon = ({ main, hours = 0 }: WeatherIconProps) => {
  const getIcon = () => {
    switch (main) {
      case 'Haze':
        return (
          <Image
            style={{ height: 120, width: 160 }}
            source={require('../../../../assets/weatherIcons/Haze.png')}
          />
        );

      case 'Rain':
        return (
          <Image
            style={{ height: 160, width: 160 }}
            source={require('../../../../assets/weatherIcons/Rain.png')}
          />
        );

      case 'Snow':
        return (
          <Image
            style={{ height: 130, width: 160 }}
            source={require('../../../../assets/weatherIcons/SnowFall.png')}
          />
        );

      case 'Thunderstorm':
        return (
          <Image
            style={{ height: 160, width: 160 }}
            source={require('../../../../assets/weatherIcons/ThunderStorm.png')}
          />
        );
      case 'Drizzle':
        return hours < 19 ? (
          <Image
            style={{ height: 160, width: 160 }}
            source={require('../../../../assets/weatherIcons/Drizzle.png')}
          />
        ) : (
          <Image
            style={{ height: 160, width: 160 }}
            source={require('../../../../assets/weatherIcons/Night_Drizzle.png')}
          />
        );
      case 'Mist':
        return hours < 19 ? (
          <Image
            style={{ height: 130, width: 170 }}
            source={require('../../../../assets/weatherIcons/Mist.png')}
          />
        ) : (
          <Image
            style={{ height: 150, width: 150 }}
            source={require('../../../../assets/weatherIcons/Night_Mist.png')}
          />
        );

      case 'Clouds':
        return hours < 19 ? (
          <Image
            style={{ height: 130, width: 170 }}
            source={require('../../../../assets/weatherIcons/Cloudy.png')}
          />
        ) : (
          <Image
            style={{ height: 160, width: 160 }}
            source={require('../../../../assets/weatherIcons/Night_Cloudy.png')}
          />
        );

      case 'Clear':
        return hours < 19 ? (
          <Image
            style={{ height: 160, width: 160 }}
            source={require('../../../../assets/weatherIcons/Sunny.png')}
          />
        ) : (
          <Image
            style={{ height: 150, width: 160 }}
            source={require('../../../../assets/weatherIcons/Night_Clear.png')}
          />
        );

      default:
        return false;
    }
  };

  return <View style={styles.container}>{getIcon()}</View>;
};
