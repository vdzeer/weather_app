import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { hour12, useStrings } from '@shared/lib/i18n';
import { formatTime } from '@shared/lib/time';
import { formatTemperature, type Units } from '@shared/lib/units';
import { conditionLabel } from '@shared/lib/weatherCode';
import { colors } from '@shared/theme/colors';
import { AppText, WeatherIllustration } from '@shared/ui';

import type { HourPoint } from '../model/types';

type Props = {
  hours: HourPoint[];
  utcOffsetSeconds: number;
  units: Units;
};

// Below this the chance of rain is noise; showing it would only add clutter.
const MIN_SHOWN_CHANCE = 20;

const roundChance = (p: number) => `${Math.round(p / 10) * 10}%`;

export const HourlyStrip = ({ hours, utcOffsetSeconds, units }: Props) => {
  const strings = useStrings();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}>
      {hours.map((hour, i) => {
        const time =
          i === 0
            ? strings.now
            : formatTime(hour.time, utcOffsetSeconds, hour12);
        const temp = formatTemperature(hour.temperature, units.temperature);
        const chance =
          hour.precipitationProbability >= MIN_SHOWN_CHANCE
            ? roundChance(hour.precipitationProbability)
            : '';
        return (
          <View
            key={hour.time}
            style={styles.hour}
            accessible
            accessibilityLabel={strings.hourA11y(
              time,
              temp,
              conditionLabel(hour.weatherCode, strings),
              chance,
            )}>
            <AppText variant="label" tone={i === 0 ? 'primary' : 'secondary'}>
              {time}
            </AppText>
            <WeatherIllustration
              code={hour.weatherCode}
              isDay={hour.isDay}
              size={36}
              style={styles.icon}
            />
            <AppText variant="caption" style={styles.chance}>
              {chance || ' '}
            </AppText>
            <AppText variant="headline">{temp}</AppText>
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: { paddingHorizontal: 12 },
  hour: { width: 60, alignItems: 'center' },
  icon: { marginTop: 8 },
  chance: { color: colors.rain, minHeight: 18 },
});
