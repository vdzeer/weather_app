import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useStrings } from '@shared/lib/i18n';
import { weekdayOf } from '@shared/lib/time';
import { formatTemperature, type Units } from '@shared/lib/units';
import { conditionLabel } from '@shared/lib/weatherCode';
import { colors } from '@shared/theme/colors';
import { AppText, WeatherIllustration } from '@shared/ui';

import type { DayPoint } from '../model/types';
import { TemperatureBar } from './TemperatureBar';

type Props = {
  days: DayPoint[];
  utcOffsetSeconds: number;
  units: Units;
  currentTemperature: number;
};

const MIN_SHOWN_CHANCE = 20;

export const DailyList = ({
  days,
  utcOffsetSeconds,
  units,
  currentTemperature,
}: Props) => {
  const strings = useStrings();
  const rangeMin = Math.min(...days.map(d => d.min));
  const rangeMax = Math.max(...days.map(d => d.max));

  return (
    <View>
      {days.map((day, i) => {
        const label =
          i === 0
            ? strings.today
            : strings.weekdaysShort[weekdayOf(day.time, utcOffsetSeconds)];
        const low = formatTemperature(day.min, units.temperature);
        const high = formatTemperature(day.max, units.temperature);
        const chance =
          day.precipitationProbability >= MIN_SHOWN_CHANCE
            ? `${Math.round(day.precipitationProbability / 10) * 10}%`
            : '';
        return (
          <View
            key={day.time}
            style={[styles.row, i > 0 && styles.divider]}
            accessible
            accessibilityLabel={strings.dayA11y(
              label,
              low,
              high,
              conditionLabel(day.weatherCode, strings),
              chance,
            )}>
            <AppText variant="callout" style={styles.day} numberOfLines={1}>
              {label}
            </AppText>
            <View style={styles.iconCell}>
              <WeatherIllustration code={day.weatherCode} isDay size={30} />
              <AppText variant="caption" style={styles.chance}>
                {chance}
              </AppText>
            </View>
            <AppText variant="callout" tone="secondary" style={styles.temp}>
              {low}
            </AppText>
            <TemperatureBar
              min={day.min}
              max={day.max}
              rangeMin={rangeMin}
              rangeMax={rangeMax}
              current={i === 0 ? currentTemperature : undefined}
            />
            <AppText variant="callout" style={styles.temp}>
              {high}
            </AppText>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
  },
  divider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.hairline,
  },
  day: { width: 78 },
  iconCell: { width: 72, flexDirection: 'row', alignItems: 'center' },
  chance: { color: colors.rain, marginLeft: 4 },
  temp: { width: 40, textAlign: 'right' },
});
