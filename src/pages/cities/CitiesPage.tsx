import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, Search, X } from 'lucide-react-native';
import { useShallow } from 'zustand/react/shallow';

import {
  placeFromGeocoding,
  selectPlaces,
  usePlacesStore,
} from '@entities/place';
import type { GeocodingResult } from '@shared/api';
import { useStrings } from '@shared/lib/i18n';
import type { ScreenProps } from '@shared/navigation/types';
import { colors, neutralSky } from '@shared/theme/colors';
import { fonts } from '@shared/theme/typography';
import { AppText, IconButton, ScreenHeader, Sky, TextButton } from '@shared/ui';

import { CityRow } from './CityRow';
import { SearchResults } from './SearchResults';

export const CitiesPage = ({ navigation }: ScreenProps<'Cities'>) => {
  const strings = useStrings();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState(false);
  const places = usePlacesStore(useShallow(selectPlaces));
  const saved = usePlacesStore(s => s.saved);
  const remove = usePlacesStore(s => s.remove);
  const searching = query.trim().length > 0;

  const openPlace = (id: string) => navigation.popTo('Home', { placeId: id });

  const onSelectResult = (result: GeocodingResult) => {
    const place = placeFromGeocoding(result);
    if (saved.some(p => p.id === place.id)) {
      openPlace(place.id);
    } else {
      navigation.navigate('CityPreview', { place });
    }
  };

  return (
    <View style={styles.fill}>
      <Sky colors={neutralSky} />
      <ScreenHeader
        title={strings.cities}
        left={
          <IconButton
            icon={ChevronLeft}
            label={strings.back}
            onPress={navigation.goBack}
          />
        }
        right={
          !searching && saved.length > 0 ? (
            <TextButton
              title={editing ? strings.done : strings.edit}
              onPress={() => setEditing(e => !e)}
            />
          ) : null
        }
      />

      <View style={styles.searchBox}>
        <Search size={18} color={colors.textSecondary} strokeWidth={2} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={strings.searchPlaceholder}
          placeholderTextColor={colors.textTertiary}
          selectionColor={colors.text}
          style={styles.input}
          autoCorrect={false}
          returnKeyType="search"
          clearButtonMode="never"
          accessibilityLabel={strings.searchPlaceholder}
          onFocus={() => setEditing(false)}
        />
        {query ? (
          <Pressable
            onPress={() => setQuery('')}
            accessibilityRole="button"
            accessibilityLabel={strings.cancel}
            hitSlop={10}>
            <X size={18} color={colors.textSecondary} strokeWidth={2} />
          </Pressable>
        ) : null}
      </View>

      {searching ? (
        <SearchResults
          query={query}
          savedIds={saved.map(p => p.id)}
          onSelect={onSelectResult}
          bottomInset={insets.bottom}
        />
      ) : (
        <FlatList
          data={places}
          keyExtractor={place => place.id}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            styles.list,
            { paddingBottom: insets.bottom + 16 },
          ]}
          renderItem={({ item }) => (
            <CityRow
              place={item}
              editing={editing}
              onPress={() => openPlace(item.id)}
              onRemove={() => remove(item.id)}
            />
          )}
          ListFooterComponent={
            saved.length === 0 ? (
              <AppText tone="secondary" style={styles.empty}>
                {strings.noSavedCities}
              </AppText>
            ) : undefined
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  fill: { flex: 1 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 20,
    marginTop: 4,
    marginBottom: 8,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: colors.control,
  },
  input: {
    flex: 1,
    minHeight: 46,
    color: colors.text,
    fontFamily: fonts.regular,
    fontSize: 17,
  },
  list: { paddingHorizontal: 20 },
  empty: { marginTop: 20 },
});
