import React, { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { ArrowUp } from 'lucide-react-native';

import { hour12, useStrings } from '@shared/lib/i18n';
import { formatTime } from '@shared/lib/time';
import {
  compassPoint,
  formatPercent,
  formatPrecipitation,
  formatPressure,
  formatVisibility,
  formatWind,
  uvLevel,
  type Units,
} from '@shared/lib/units';
import { colors } from '@shared/theme/colors';
import { AppText } from '@shared/ui';

import type { Forecast } from '../model/types';

type Cell = {
  label: string;
  value: string;
  note?: string;
  adornment?: ReactNode;
};

type Props = { forecast: Forecast; units: Units };

export const DetailsGrid = ({ forecast, units }: Props) => {
  const strings = useStrings();
  const { current, utcOffsetSeconds } = forecast;
  const today = forecast.days[0];
  const time = (unix: number | undefined) =>
    unix ? formatTime(unix, utcOffsetSeconds, hour12) : '—';

  const cells: Cell[] = [
    { label: strings.humidity, value: formatPercent(current.humidity) },
    {
      label: strings.wind,
      value: formatWind(current.windSpeed, units.wind, strings),
      note: `${compassPoint(current.windDirection, strings)}, ${strings
        .gusts(formatWind(current.windGusts, units.wind, strings))
        .toLowerCase()}`,
      // The arrow shows where the wind blows to.
      adornment: (
        <ArrowUp
          size={18}
          color={colors.text}
          strokeWidth={2.2}
          style={{
            transform: [{ rotate: `${current.windDirection + 180}deg` }],
          }}
        />
      ),
    },
    {
      label: strings.uvIndex,
      value: String(Math.round(current.uvIndex)),
      note: strings.uv[uvLevel(current.uvIndex)],
    },
    {
      label: strings.pressure,
      value: formatPressure(current.pressure, units.pressure, strings),
    },
    { label: strings.sunrise, value: time(today?.sunrise) },
    { label: strings.sunset, value: time(today?.sunset) },
    {
      label: strings.precipitation,
      value: formatPrecipitation(today?.precipitationSum ?? 0, strings),
      note: strings.precipitationToday,
    },
    {
      label: strings.visibility,
      value: formatVisibility(current.visibility, strings),
    },
  ];

  const rows: Cell[][] = [];
  for (let i = 0; i < cells.length; i += 2) {
    rows.push(cells.slice(i, i + 2));
  }

  return (
    <View>
      {rows.map((row, r) => (
        <View key={r} style={[styles.row, r > 0 && styles.rowDivider]}>
          {row.map((cell, c) => (
            <View
              key={cell.label}
              style={[styles.cell, c > 0 && styles.cellDivider]}
              accessible
              accessibilityLabel={`${cell.label}: ${cell.value}${
                cell.note ? `, ${cell.note}` : ''
              }`}>
              <AppText variant="label" tone="secondary">
                {cell.label}
              </AppText>
              <View style={styles.valueRow}>
                <AppText variant="value">{cell.value}</AppText>
                {cell.adornment}
              </View>
              {cell.note ? (
                <AppText variant="caption" tone="tertiary">
                  {cell.note}
                </AppText>
              ) : null}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row' },
  rowDivider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.hairline,
  },
  cell: { flex: 1, paddingVertical: 14, paddingRight: 12, gap: 2 },
  cellDivider: {
    paddingLeft: 16,
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: colors.hairline,
  },
  valueRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});
