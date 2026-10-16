import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { colors } from '@shared/theme/colors';

import { AppText } from './AppText';

type Option<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  label: string;
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
};

export const Segmented = <T extends string>({
  label,
  options,
  value,
  onChange,
}: Props<T>) => (
  <View
    style={styles.track}
    accessibilityRole="radiogroup"
    accessibilityLabel={label}>
    {options.map(option => {
      const selected = option.value === value;
      return (
        <Pressable
          key={option.value}
          onPress={() => onChange(option.value)}
          accessibilityRole="radio"
          accessibilityState={{ selected }}
          style={[styles.option, selected && styles.selected]}>
          <AppText
            variant="callout"
            numberOfLines={1}
            style={selected ? styles.selectedText : undefined}>
            {option.label}
          </AppText>
        </Pressable>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    backgroundColor: colors.control,
    borderRadius: 14,
    padding: 3,
  },
  option: {
    flex: 1,
    minHeight: 38,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  selected: { backgroundColor: colors.text },
  selectedText: { color: colors.buttonText },
});
