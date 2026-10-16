import React, { useEffect, useRef } from 'react';
import { AccessibilityInfo, Animated, StyleSheet, View } from 'react-native';

import { colors } from '@shared/theme/colors';
import { AppText } from '@shared/ui';

type Props = { name: string; topInset: number; label: string };

export const ForecastSkeleton = ({ name, topInset, label }: Props) => {
  const opacity = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    let animation: Animated.CompositeAnimation | undefined;
    AccessibilityInfo.isReduceMotionEnabled().then(reduced => {
      if (reduced) {
        return;
      }
      animation = Animated.loop(
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.5,
            duration: 700,
            useNativeDriver: true,
          }),
        ]),
      );
      animation.start();
    });
    return () => animation?.stop();
  }, [opacity]);

  return (
    <View
      style={[styles.container, { paddingTop: topInset + 8 }]}
      accessible
      accessibilityLabel={label}
      accessibilityState={{ busy: true }}>
      <AppText variant="title" numberOfLines={1}>
        {name}
      </AppText>
      <Animated.View style={{ opacity }}>
        <View style={[styles.block, styles.hero]} />
        <View style={[styles.block, styles.line]} />
        <View style={[styles.block, styles.lineShort]} />
        <View style={[styles.block, styles.strip]} />
        <View style={[styles.block, styles.list]} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  block: { backgroundColor: colors.control, borderRadius: 10 },
  hero: { width: 150, height: 96, marginTop: 14, borderRadius: 18 },
  line: { width: 180, height: 18, marginTop: 14 },
  lineShort: { width: 130, height: 16, marginTop: 10 },
  strip: { height: 110, marginTop: 40, borderRadius: 16 },
  list: { height: 260, marginTop: 20, borderRadius: 16 },
});
