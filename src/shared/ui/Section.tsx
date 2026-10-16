import React, { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors } from '@shared/theme/colors';

import { AppText } from './AppText';

type SectionProps = {
  title: string;
  children: ReactNode;
  inset?: boolean;
  divider?: boolean;
};

// Sections are separated by a hairline, not boxed into cards: the forecast
// reads as one continuous sheet under the sky.
export const Section = ({
  title,
  children,
  inset = true,
  divider = true,
}: SectionProps) => (
  <View style={[styles.section, divider && styles.divider]}>
    <AppText
      variant="label"
      tone="secondary"
      accessibilityRole="header"
      style={styles.title}>
      {title}
    </AppText>
    <View style={inset ? styles.inset : undefined}>{children}</View>
  </View>
);

export const Hairline = () => <View style={styles.hairline} />;

const styles = StyleSheet.create({
  section: { paddingTop: 14, paddingBottom: 18 },
  divider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.hairline,
  },
  title: { paddingHorizontal: 20, marginBottom: 10 },
  inset: { paddingHorizontal: 20 },
  hairline: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.hairline,
  },
});
