import React from 'react';
import { Image, type ImageStyle, type StyleProp } from 'react-native';

import { illustrationFor, type Illustration } from '@shared/lib/weatherCode';

const SOURCES: Record<Illustration, number> = {
  sunny: require('@assets/weather/sunny.png'),
  night_clear: require('@assets/weather/night_clear.png'),
  cloudy: require('@assets/weather/cloudy.png'),
  night_cloudy: require('@assets/weather/night_cloudy.png'),
  mist: require('@assets/weather/mist.png'),
  night_mist: require('@assets/weather/night_mist.png'),
  overcast: require('@assets/weather/overcast.png'),
  drizzle: require('@assets/weather/drizzle.png'),
  night_drizzle: require('@assets/weather/night_drizzle.png'),
  rain: require('@assets/weather/rain.png'),
  snowfall: require('@assets/weather/snowfall.png'),
  thunderstorm: require('@assets/weather/thunderstorm.png'),
};

type Props = {
  code: number;
  isDay: boolean;
  size: number;
  style?: StyleProp<ImageStyle>;
};

// Decorative: the condition is always also given as text next to it.
export const WeatherIllustration = ({ code, isDay, size, style }: Props) => (
  <Image
    source={SOURCES[illustrationFor(code, isDay)]}
    style={[{ width: size, height: size }, style]}
    resizeMode="contain"
    accessible={false}
    importantForAccessibility="no"
  />
);
