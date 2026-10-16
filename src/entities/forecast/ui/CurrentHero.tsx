import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Navigation } from 'lucide-react-native';

import { useStrings } from '@shared/lib/i18n';
import { formatTemperature, type Units } from '@shared/lib/units';
import { conditionLabel } from '@shared/lib/weatherCode';
import { colors } from '@shared/theme/colors';
import { AppText, WeatherIllustration } from '@shared/ui';

import type { Forecast } from '../model/types';

type Props = {
  name: string;
  isCurrent: boolean;
  forecast: Forecast;
  units: Units;
  topInset: number;
};

export const CurrentHero = ({
  name,
  isCurrent,
  forecast,
  units,
  topInset,
}: Props) => {
  const strings = useStrings();
  const { current } = forecast;
  const today = forecast.days[0];
  const temp = (c: number) => formatTemperature(c, units.temperature);

  const condition = conditionLabel(current.weatherCode, strings);
  const feelsLike = strings.feelsLike(temp(current.apparentTemperature));
  const highLow = today
    ? strings.highLow(temp(today.max), temp(today.min))
    : '';

  return (
    <View
      style={[styles.container, { paddingTop: topInset + 8 }]}
      accessible
      accessibilityRole="summary"
      accessibilityLabel={`${name}. ${temp(
        current.temperature,
      )}, ${condition}. ${feelsLike}. ${highLow}.`}>
      <WeatherIllustration
        code={current.weatherCode}
        isDay={current.isDay}
        size={190}
        style={[styles.art, { top: topInset - 18 }]}
      />
      <View style={styles.nameRow}>
        {isCurrent ? (
          <Navigation
            size={15}
            color={colors.text}
            fill={colors.text}
            style={styles.arrow}
          />
        ) : null}
        <AppText variant="title" numberOfLines={1} style={styles.name}>
          {name}
        </AppText>
      </View>
      <AppText variant="hero" maxFontSizeMultiplier={1.15}>
        {temp(current.temperature)}
      </AppText>
      <AppText variant="headline" style={styles.condition}>
        {condition}
      </AppText>
      <AppText tone="secondary">{feelsLike}</AppText>
      {today ? <AppText tone="secondary">{highLow}</AppText> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingBottom: 28 },
  art: { position: 'absolute', right: -6 },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    // Leave room for the illustration on the right.
    marginRight: 150,
  },
  arrow: { marginRight: 8 },
  name: { flexShrink: 1 },
  condition: { marginTop: -4, marginBottom: 4 },
});
