import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { colors } from '@shared/theme/colors';

import { AppText } from './AppText';

type ButtonProps = {
  title: string;
  onPress: () => void;
  kind?: 'primary' | 'secondary';
  disabled?: boolean;
};

export const Button = ({
  title,
  onPress,
  kind = 'primary',
  disabled,
}: ButtonProps) => (
  <Pressable
    onPress={onPress}
    disabled={disabled}
    accessibilityRole="button"
    accessibilityState={{ disabled }}
    style={({ pressed }) => [
      styles.base,
      kind === 'primary' ? styles.primary : styles.secondary,
      pressed && styles.pressed,
      disabled && styles.disabled,
    ]}>
    <AppText
      variant="headline"
      style={kind === 'primary' ? styles.primaryText : undefined}>
      {title}
    </AppText>
  </Pressable>
);

const styles = StyleSheet.create({
  base: {
    minHeight: 50,
    paddingHorizontal: 22,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: { backgroundColor: colors.text },
  primaryText: { color: colors.buttonText },
  secondary: { backgroundColor: colors.control },
  pressed: { opacity: 0.8 },
  disabled: { opacity: 0.5 },
});
