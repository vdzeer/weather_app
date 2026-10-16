import React from 'react';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {
  CitiesPage,
  CityPreviewPage,
  HomePage,
  SettingsPage,
} from '@pages/index';
import type { RootStackParamList } from '@shared/navigation/types';
import { colors, neutralSky } from '@shared/theme/colors';

const Stack = createNativeStackNavigator<RootStackParamList>();

const theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: neutralSky[0],
    text: colors.text,
    primary: colors.sun,
  },
};

type Props = { onReady?: () => void };

export const Navigation = ({ onReady }: Props) => (
  <NavigationContainer theme={theme} onReady={onReady}>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomePage} />
      <Stack.Screen name="Cities" component={CitiesPage} />
      <Stack.Screen name="Settings" component={SettingsPage} />
      <Stack.Screen
        name="CityPreview"
        component={CityPreviewPage}
        options={{
          presentation: 'fullScreenModal',
          animation: 'slide_from_bottom',
        }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);
