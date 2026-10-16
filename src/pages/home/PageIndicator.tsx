import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Navigation } from 'lucide-react-native';

import { useStrings } from '@shared/lib/i18n';
import { colors } from '@shared/theme/colors';

type Props = { count: number; index: number; firstIsCurrent: boolean };

export const PageIndicator = ({ count, index, firstIsCurrent }: Props) => {
  const strings = useStrings();
  if (count < 2) {
    return null;
  }
  return (
    <View
      style={styles.row}
      accessible
      accessibilityLabel={strings.page(index + 1, count)}>
      {Array.from({ length: count }, (_, i) => {
        const color = i === index ? colors.text : colors.textTertiary;
        return i === 0 && firstIsCurrent ? (
          <Navigation key={i} size={10} color={color} fill={color} />
        ) : (
          <View key={i} style={[styles.dot, { backgroundColor: color }]} />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  dot: { width: 7, height: 7, borderRadius: 3.5 },
});
