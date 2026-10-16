import React, { useRef, useState } from 'react';
import {
  Animated,
  Linking,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CloudOff } from 'lucide-react-native';

import {
  CurrentHero,
  DailyList,
  DetailsGrid,
  HourlyStrip,
  upcomingHours,
  useForecast,
} from '@entities/forecast';
import { isCurrentPlace, type Place } from '@entities/place';
import { useUnits } from '@entities/settings';
import { HOURLY_WINDOW } from '@shared/config';
import { hour12, useStrings } from '@shared/lib/i18n';
import { useIsOnline } from '@shared/lib/network';
import { formatDeviceTime } from '@shared/lib/time';
import { describeWeather } from '@shared/lib/weatherCode';
import { colors, neutralSky, skyFor } from '@shared/theme/colors';
import { AppText, Button, Section, Sky, StateMessage } from '@shared/ui';

import { ForecastSkeleton } from './ForecastSkeleton';

type Props = {
  place: Place;
  // Height of the overlay header drawn above this view.
  topInset: number;
};

export const ForecastView = ({ place, topInset }: Props) => {
  const strings = useStrings();
  const units = useUnits();
  const online = useIsOnline();
  const insets = useSafeAreaInsets();
  const { data, isError, refetch } = useForecast(place);
  const scrollY = useRef(new Animated.Value(0)).current;
  // Only show the spinner for a pull the user made, not background refreshes.
  const [pulling, setPulling] = useState(false);
  const onPull = async () => {
    setPulling(true);
    try {
      await refetch();
    } finally {
      setPulling(false);
    }
  };

  const sky = data
    ? skyFor(describeWeather(data.current.weatherCode).sky, data.current.isDay)
    : neutralSky;

  if (!data) {
    return (
      <View style={styles.fill}>
        <Sky colors={sky} />
        {isError ? (
          <StateMessage
            title={strings.loadErrorTitle}
            body={strings.loadErrorBody}>
            <Button title={strings.retry} onPress={() => refetch()} />
          </StateMessage>
        ) : (
          <ForecastSkeleton
            name={place.name}
            topInset={topInset}
            label={strings.loadingForecast}
          />
        )}
      </View>
    );
  }

  const updatedAt = formatDeviceTime(data.fetchedAt, hour12);
  const nowUnix = Math.floor(Date.now() / 1000);
  let staleNotice: string | null = null;
  if (!online) {
    staleNotice = strings.offline(updatedAt);
  } else if (isError) {
    staleNotice = `${strings.loadErrorTitle}. ${strings.updatedAt(updatedAt)}.`;
  }

  return (
    <View style={styles.fill}>
      <Sky colors={sky} />
      <Animated.ScrollView
        contentContainerStyle={styles.content}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
        refreshControl={
          <RefreshControl
            refreshing={pulling}
            onRefresh={onPull}
            tintColor={colors.text}
            colors={[colors.buttonText]}
            progressViewOffset={topInset}
          />
        }>
        <CurrentHero
          name={place.name}
          isCurrent={isCurrentPlace(place)}
          forecast={data}
          units={units}
          topInset={topInset}
        />
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
          {staleNotice ? (
            <View style={styles.notice} accessibilityRole="alert">
              <CloudOff size={18} color={colors.text} strokeWidth={1.8} />
              <AppText variant="callout" style={styles.noticeText}>
                {staleNotice}
              </AppText>
            </View>
          ) : null}
          <Section title={strings.next24h} inset={false} divider={false}>
            <HourlyStrip
              hours={upcomingHours(data, HOURLY_WINDOW, nowUnix)}
              utcOffsetSeconds={data.utcOffsetSeconds}
              units={units}
            />
          </Section>
          <Section title={strings.tenDays}>
            <DailyList
              days={data.days}
              utcOffsetSeconds={data.utcOffsetSeconds}
              units={units}
              currentTemperature={data.current.temperature}
            />
          </Section>
          <Section title={strings.details}>
            <DetailsGrid forecast={data} units={units} />
          </Section>
          <View style={styles.footer}>
            <AppText variant="caption" tone="tertiary">
              {strings.updatedAt(updatedAt)}
            </AppText>
            <Pressable
              accessibilityRole="link"
              onPress={() => Linking.openURL('https://open-meteo.com/')}
              hitSlop={8}>
              <AppText variant="caption" tone="tertiary" style={styles.link}>
                {strings.dataSource}
              </AppText>
            </Pressable>
          </View>
        </View>
      </Animated.ScrollView>
      {/* Fades in behind the status bar and header once content scrolls under them. */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.scrim,
          {
            height: topInset,
            backgroundColor: sky[0],
            opacity: scrollY.interpolate({
              inputRange: [topInset, topInset + 80],
              outputRange: [0, 1],
              extrapolate: 'clamp',
            }),
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  fill: { flex: 1 },
  content: { flexGrow: 1 },
  scrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.hairline,
  },
  sheet: {
    flexGrow: 1,
    backgroundColor: colors.sheet,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 8,
  },
  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 16,
  },
  noticeText: { flex: 1 },
  footer: { paddingHorizontal: 20, paddingTop: 8, gap: 4 },
  link: { textDecorationLine: 'underline' },
});
