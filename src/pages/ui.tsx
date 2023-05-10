import React from 'react';
import { Image, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ColorfulTabBar as TabBar } from 'react-navigation-tabbar-collection';

import {
  NAV_BACKGROUND_COLOR,
  BACKGROUND_COLOR,
  NAV_BORDER_COLOR,
  SECONDARY,
  SUCCESS,
  WARNING,
  DANGER,
  LIGHT,
  INFO,
} from 'shared/constants/colors';

import { SCREENS } from './index.types';
import SearchPage from './search';
import HomePage from './home';
import { styles } from './styles.module';

import home from '../../assets/home.png';
import search from '../../assets/search.png';

const Tab = createBottomTabNavigator();

export const Navigation = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            position: 'absolute',
            bottom: '2%',
            left: '3%',
            right: '3%',
            borderRadius: 20,
            borderWidth: 2,
            borderColor: NAV_BORDER_COLOR,
            backgroundColor: NAV_BACKGROUND_COLOR,
            borderTopWidth: 2,
            borderTopColor: NAV_BORDER_COLOR,
          },
        }}
        tabBar={(props: any) => (
          <TabBar
            colorPalette={{
              primary: NAV_BACKGROUND_COLOR,
              secondary: SECONDARY,
              success: SUCCESS,
              danger: DANGER,
              warning: WARNING,
              info: INFO,
              light: LIGHT,
              dark: BACKGROUND_COLOR,
            }}
            maxWidth={320}
            height={75}
            darkMode={true}
            {...props}
          />
        )}>
        <Tab.Screen
          options={{
            tabBarShowLabel: false,
            tabBarIcon: () => {
              return (
                <View>
                  <Image source={home} style={styles.tabIcon} />
                </View>
              );
            },
          }}
          name={SCREENS.HOME}
          component={HomePage}
        />
        <Tab.Screen
          options={{
            tabBarShowLabel: false,
            tabBarIcon: () => {
              return (
                <View>
                  <Image source={search} style={styles.tabIcon} />
                </View>
              );
            },
          }}
          name={SCREENS.SEARCH}
          component={SearchPage}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
