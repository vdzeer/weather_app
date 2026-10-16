import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { colors } from '@shared/theme/colors';

import { AppText } from './AppText';

type Props = {
  title: string;
  onPress: () => void;
  emphasized?: boolean;
};

export const TextButton = ({ title, onPress, emphasized }: Props) => (
  <Pressable
    onPress={onPress}
    accessibilityRole="button"
    hitSlop={10}
    style={({ pressed }) => [
      styles.base,
      emphasized && styles.emphasized,
      pressed && styles.pressed,
    ]}>
    <AppText
      variant={emphasized ? 'headline' : 'callout'}
      style={emphasized ? styles.emphasizedText : undefined}>
      {title}
    </AppText>
  </Pressable>
);

const styles = StyleSheet.create({
  base: { paddingVertical: 8, paddingHorizontal: 4 },
  emphasized: {
    backgroundColor: colors.text,
    borderRadius: 18,
    paddingHorizontal: 16,
  },
  emphasizedText: { color: colors.buttonText },
  pressed: { opacity: 0.7 },
});
