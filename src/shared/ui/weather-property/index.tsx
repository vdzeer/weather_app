import * as React from 'react';
import { Image, ImageSourcePropType, Text, View } from 'react-native';
import { styles } from './styles.module';

export type WeatherPropertyProps = {
  title: string;
  value: string | number;
  unit: string;
  icon: ImageSourcePropType;
};

export const WeatherProperty = ({
  title,
  value,
  unit,
  icon,
}: WeatherPropertyProps) => {
  return (
    <View style={styles.container}>
      <Image source={icon} style={styles.icon} />
      <Text style={styles.valueTitle}>
        {value} <Text style={styles.unitTitle}>{unit}</Text>
      </Text>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};
