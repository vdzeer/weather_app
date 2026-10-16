import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { usePlacesStore } from '@entities/place';
import { useStrings } from '@shared/lib/i18n';
import type { ScreenProps } from '@shared/navigation/types';
import { HEADER_HEIGHT, ScreenHeader, TextButton } from '@shared/ui';
import { ForecastView } from '@widgets/forecast-view';

export const CityPreviewPage = ({
  navigation,
  route,
}: ScreenProps<'CityPreview'>) => {
  const strings = useStrings();
  const insets = useSafeAreaInsets();
  const add = usePlacesStore(s => s.add);
  const { place } = route.params;

  const onAdd = () => {
    add(place);
    navigation.popTo('Home', { placeId: place.id });
  };

  return (
    <View style={styles.fill}>
      <ForecastView place={place} topInset={insets.top + HEADER_HEIGHT} />
      <ScreenHeader
        overlay
        left={<TextButton title={strings.cancel} onPress={navigation.goBack} />}
        right={<TextButton title={strings.add} emphasized onPress={onAdd} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
