import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';

import { colors } from '@shared/theme/colors';

type IconButtonProps = {
  icon: LucideIcon;
  label: string;
  onPress: () => void;
  size?: number;
};

export const IconButton = ({
  icon: Icon,
  label,
  onPress,
  size = 22,
}: IconButtonProps) => (
  <Pressable
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={label}
    hitSlop={8}
    style={({ pressed }) => [styles.base, pressed && styles.pressed]}>
    <Icon size={size} color={colors.text} strokeWidth={1.8} />
  </Pressable>
);

const styles = StyleSheet.create({
  base: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.control,
  },
  pressed: { backgroundColor: colors.controlPressed },
});
