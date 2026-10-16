import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { placeSubtitle } from '@entities/place';
import { useCitySearch } from '@features/city-search';
import type { GeocodingResult } from '@shared/api';
import { useStrings } from '@shared/lib/i18n';
import { colors } from '@shared/theme/colors';
import { AppText } from '@shared/ui';

type Props = {
  query: string;
  savedIds: string[];
  onSelect: (result: GeocodingResult) => void;
  bottomInset: number;
};

export const SearchResults = ({
  query,
  savedIds,
  onSelect,
  bottomInset,
}: Props) => {
  const strings = useStrings();
  const { data, isError, pending, enabled, term } = useCitySearch(query);

  if (!enabled) {
    return null;
  }
  if (isError && !data) {
    return <Message text={strings.searchError} />;
  }
  if (!data) {
    return <ActivityIndicator color={colors.text} style={styles.spinner} />;
  }
  if (data.length === 0 && !pending) {
    return <Message text={strings.searchEmpty(term)} />;
  }

  return (
    <FlatList
      data={data}
      keyExtractor={item => String(item.id)}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      contentContainerStyle={[styles.list, { paddingBottom: bottomInset + 16 }]}
      renderItem={({ item }) => {
        const subtitle = placeSubtitle({
          region: item.admin1,
          country: item.country,
        });
        const saved = savedIds.includes(String(item.id));
        return (
          <Pressable
            onPress={() => onSelect(item)}
            accessibilityRole="button"
            accessibilityLabel={`${item.name}, ${subtitle}${
              saved ? `, ${strings.alreadySaved}` : ''
            }`}
            style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
            <View style={styles.text}>
              <AppText variant="headline" numberOfLines={1}>
                {item.name}
              </AppText>
              <AppText variant="caption" tone="secondary" numberOfLines={1}>
                {subtitle}
              </AppText>
            </View>
            {saved ? (
              <AppText variant="caption" tone="tertiary">
                {strings.alreadySaved}
              </AppText>
            ) : null}
          </Pressable>
        );
      }}
    />
  );
};

const Message = ({ text }: { text: string }) => (
  <AppText tone="secondary" style={styles.message}>
    {text}
  </AppText>
);

const styles = StyleSheet.create({
  list: { paddingHorizontal: 20 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 60,
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.hairline,
  },
  pressed: { opacity: 0.7 },
  text: { flex: 1 },
  message: { paddingHorizontal: 20, paddingTop: 16 },
  spinner: { marginTop: 24 },
});
