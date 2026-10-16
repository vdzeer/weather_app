import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { CircleMinus, Navigation } from 'lucide-react-native';

import { useForecast } from '@entities/forecast';
import { isCurrentPlace, placeSubtitle, type Place } from '@entities/place';
import { useUnits } from '@entities/settings';
import { useStrings } from '@shared/lib/i18n';
import { formatTemperature } from '@shared/lib/units';
import { conditionLabel } from '@shared/lib/weatherCode';
import { colors } from '@shared/theme/colors';
import { AppText, WeatherIllustration } from '@shared/ui';

type Props = {
  place: Place;
  editing: boolean;
  onPress: () => void;
  onRemove: () => void;
};

export const CityRow = ({ place, editing, onPress, onRemove }: Props) => {
  const strings = useStrings();
  const units = useUnits();
  const { data } = useForecast(place);
  const current = isCurrentPlace(place);
  const subtitle = current ? strings.myLocation : placeSubtitle(place);
  const temp = data
    ? formatTemperature(data.current.temperature, units.temperature)
    : '';
  const condition = data
    ? conditionLabel(data.current.weatherCode, strings)
    : '';

  return (
    <View style={styles.row}>
      {editing && !current ? (
        <Pressable
          onPress={onRemove}
          accessibilityRole="button"
          accessibilityLabel={strings.removeCity(place.name)}
          hitSlop={10}
          style={styles.remove}>
          <CircleMinus size={24} color={colors.danger} strokeWidth={1.8} />
        </Pressable>
      ) : null}
      <Pressable
        onPress={onPress}
        disabled={editing}
        accessibilityRole="button"
        accessibilityLabel={`${place.name}, ${subtitle}${
          temp ? `, ${temp}, ${condition}` : ''
        }`}
        accessibilityHint={strings.goToCity(place.name)}
        style={({ pressed }) => [styles.main, pressed && styles.pressed]}>
        <View style={styles.text}>
          <View style={styles.titleRow}>
            {current ? (
              <Navigation size={13} color={colors.text} fill={colors.text} />
            ) : null}
            <AppText variant="headline" numberOfLines={1} style={styles.title}>
              {place.name}
            </AppText>
          </View>
          {subtitle ? (
            <AppText variant="caption" tone="secondary" numberOfLines={1}>
              {subtitle}
            </AppText>
          ) : null}
        </View>
        {data ? (
          <>
            <WeatherIllustration
              code={data.current.weatherCode}
              isDay={data.current.isDay}
              size={34}
            />
            <AppText variant="value" style={styles.temp}>
              {temp}
            </AppText>
          </>
        ) : null}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.hairline,
  },
  remove: { paddingRight: 14 },
  main: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 68,
    gap: 10,
  },
  pressed: { opacity: 0.7 },
  text: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  title: { flexShrink: 1 },
  temp: { minWidth: 52, textAlign: 'right' },
});
