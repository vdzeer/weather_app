import React, { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from './AppText';

type Props = {
  title?: string;
  left?: ReactNode;
  right?: ReactNode;
  overlay?: boolean;
};

export const HEADER_HEIGHT = 52;

export const ScreenHeader = ({ title, left, right, overlay }: Props) => {
  const { top } = useSafeAreaInsets();
  return (
    <View
      pointerEvents={overlay ? 'box-none' : 'auto'}
      style={[
        styles.header,
        { paddingTop: top, height: top + HEADER_HEIGHT },
        overlay && styles.overlay,
      ]}>
      <View style={styles.side} pointerEvents="box-none">
        {left}
      </View>
      <AppText
        variant="headline"
        numberOfLines={1}
        accessibilityRole="header"
        pointerEvents="none"
        style={styles.title}>
        {title ?? ''}
      </AppText>
      <View style={[styles.side, styles.right]} pointerEvents="box-none">
        {right}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1 },
  side: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  right: { justifyContent: 'flex-end' },
  title: { flexShrink: 1, textAlign: 'center' },
});
