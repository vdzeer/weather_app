import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Linking,
  StyleSheet,
  useWindowDimensions,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { List, Settings2 } from 'lucide-react-native';
import { useShallow } from 'zustand/react/shallow';

import { isCurrentPlace, selectPlaces, usePlacesStore } from '@entities/place';
import { useCurrentLocation } from '@features/location';
import { useStrings } from '@shared/lib/i18n';
import type { ScreenProps } from '@shared/navigation/types';
import { neutralSky } from '@shared/theme/colors';
import {
  Button,
  HEADER_HEIGHT,
  IconButton,
  ScreenHeader,
  Sky,
  StateMessage,
} from '@shared/ui';
import { ForecastView } from '@widgets/forecast-view';

import { PageIndicator } from './PageIndicator';

export const HomePage = ({ navigation, route }: ScreenProps<'Home'>) => {
  const strings = useStrings();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const places = usePlacesStore(useShallow(selectPlaces));
  const { permission, locating, request, retry } = useCurrentLocation();
  const listRef = useRef<FlatList>(null);
  const [index, setIndex] = useState(0);

  const openCities = useCallback(
    () => navigation.navigate('Cities'),
    [navigation],
  );
  const actions = (
    <>
      <IconButton icon={List} label={strings.cities} onPress={openCities} />
      <IconButton
        icon={Settings2}
        label={strings.settings}
        onPress={() => navigation.navigate('Settings')}
      />
    </>
  );

  // Jump to a city picked on the Cities screen.
  const targetId = route.params?.placeId;
  useEffect(() => {
    if (!targetId) {
      return;
    }
    const target = places.findIndex(p => p.id === targetId);
    if (target >= 0) {
      listRef.current?.scrollToIndex({ index: target, animated: false });
      setIndex(target);
    }
    navigation.setParams({ placeId: undefined });
  }, [targetId, places, navigation]);

  // Keep the index valid when cities are removed.
  useEffect(() => {
    if (index > places.length - 1) {
      setIndex(Math.max(0, places.length - 1));
    }
  }, [index, places.length]);

  const onScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) =>
    setIndex(Math.round(event.nativeEvent.contentOffset.x / width));

  if (places.length === 0) {
    let content;
    if (permission === 'undetermined') {
      content = (
        <StateMessage
          title={strings.welcomeTitle}
          body={strings.welcomeBody}
          code={0}>
          <Button title={strings.allowLocation} onPress={request} />
          <Button
            title={strings.findCity}
            kind="secondary"
            onPress={openCities}
          />
        </StateMessage>
      );
    } else if (permission === 'denied') {
      content = (
        <StateMessage
          title={strings.locationDeniedTitle}
          body={strings.locationDeniedBody}
          code={45}>
          <Button
            title={strings.openSettings}
            onPress={() => Linking.openSettings()}
          />
          <Button
            title={strings.findCity}
            kind="secondary"
            onPress={openCities}
          />
        </StateMessage>
      );
    } else if (locating) {
      content = <StateMessage title={strings.locating} code={2} />;
    } else {
      content = (
        <StateMessage
          title={strings.locationFailedTitle}
          body={strings.locationFailedBody}
          code={45}>
          <Button title={strings.retry} onPress={retry} />
          <Button
            title={strings.findCity}
            kind="secondary"
            onPress={openCities}
          />
        </StateMessage>
      );
    }
    return (
      <View style={styles.fill}>
        <Sky colors={neutralSky} />
        <ScreenHeader right={actions} />
        {content}
      </View>
    );
  }

  return (
    <View style={styles.fill}>
      <FlatList
        ref={listRef}
        data={places}
        keyExtractor={place => place.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScrollEnd}
        getItemLayout={(_, i) => ({
          length: width,
          offset: width * i,
          index: i,
        })}
        initialNumToRender={1}
        windowSize={3}
        renderItem={({ item }) => (
          <View style={{ width }}>
            <ForecastView place={item} topInset={insets.top + HEADER_HEIGHT} />
          </View>
        )}
      />
      <ScreenHeader
        overlay
        left={
          <PageIndicator
            count={places.length}
            index={index}
            firstIsCurrent={places.length > 0 && isCurrentPlace(places[0])}
          />
        }
        right={actions}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
