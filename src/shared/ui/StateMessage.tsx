import React, { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from './AppText';
import { WeatherIllustration } from './WeatherIllustration';

type StateMessageProps = {
  title: string;
  body?: string;
  code?: number;
  children?: ReactNode;
};

// Full-screen message for empty, error and permission states. Always says
// what happened and offers the next step as buttons in `children`.
export const StateMessage = ({
  title,
  body,
  code = 3,
  children,
}: StateMessageProps) => (
  <View style={styles.container}>
    <WeatherIllustration code={code} isDay size={150} style={styles.art} />
    <AppText variant="title" accessibilityRole="header">
      {title}
    </AppText>
    {body ? (
      <AppText tone="secondary" style={styles.body}>
        {body}
      </AppText>
    ) : null}
    {children ? <View style={styles.actions}>{children}</View> : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingBottom: 40,
  },
  art: { marginBottom: 20, marginLeft: -12 },
  body: { marginTop: 10, maxWidth: 420 },
  actions: { marginTop: 28, gap: 12, alignItems: 'stretch' },
});
