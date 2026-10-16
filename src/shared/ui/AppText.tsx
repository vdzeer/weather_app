import React from 'react';
import { Text, type TextProps } from 'react-native';

import { colors } from '@shared/theme/colors';
import { type, type TypeVariant } from '@shared/theme/typography';

type Tone = 'primary' | 'secondary' | 'tertiary';

const toneColor: Record<Tone, string> = {
  primary: colors.text,
  secondary: colors.textSecondary,
  tertiary: colors.textTertiary,
};

export type AppTextProps = TextProps & {
  variant?: TypeVariant;
  tone?: Tone;
};

// No tabular figures: Fixel's tabular set swaps in a barred 7. Number columns
// get fixed widths instead.
export const AppText = ({
  variant = 'body',
  tone = 'primary',
  style,
  ...rest
}: AppTextProps) => (
  <Text {...rest} style={[type[variant], { color: toneColor[tone] }, style]} />
);
