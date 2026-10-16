import React, { useState, type ReactNode } from 'react';
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';

import { selectPrimaryPlace, usePlacesStore } from '@entities/place';
import { MORNING_TIMES, useSettingsStore } from '@entities/settings';
import { hour12, useStrings } from '@shared/lib/i18n';
import { formatClock } from '@shared/lib/time';
import type {
  PressureUnit,
  TemperatureUnit,
  WindUnit,
} from '@shared/lib/units';
import type { ScreenProps } from '@shared/navigation/types';
import { colors, neutralSky } from '@shared/theme/colors';
import {
  AppText,
  Button,
  IconButton,
  ScreenHeader,
  Section,
  Segmented,
  Sky,
} from '@shared/ui';

import { version } from '../../../package.json';
import { useNotificationPermission } from './useNotificationPermission';

export const SettingsPage = ({ navigation }: ScreenProps<'Settings'>) => {
  const strings = useStrings();
  const insets = useSafeAreaInsets();
  const units = useSettingsStore(s => s.units);
  const setUnits = useSettingsStore(s => s.setUnits);
  const notif = useSettingsStore(s => s.notifications);
  const setNotifications = useSettingsStore(s => s.setNotifications);
  const primary = usePlacesStore(selectPrimaryPlace);
  const { permission, ensure } = useNotificationPermission();
  const [refused, setRefused] = useState(false);
  const label = strings.unitLabels;
  // Only explain the system setting once it actually blocks something.
  const showDenied =
    permission === 'denied' && (refused || notif.morning || notif.rain);

  const toggle = async (key: 'morning' | 'rain', on: boolean) => {
    if (on && !(await ensure())) {
      setRefused(true);
      return;
    }
    setNotifications({ [key]: on });
  };

  const timeLabel = (value: string) => {
    const [h, m] = value.split(':').map(Number);
    return formatClock(h, m, hour12);
  };

  return (
    <View style={styles.fill}>
      <Sky colors={neutralSky} />
      <ScreenHeader
        title={strings.settings}
        left={
          <IconButton
            icon={ChevronLeft}
            label={strings.back}
            onPress={navigation.goBack}
          />
        }
      />
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
        <Section title={strings.units}>
          <Field label={strings.temperature}>
            <Segmented<TemperatureUnit>
              label={strings.temperature}
              value={units.temperature}
              onChange={temperature => setUnits({ temperature })}
              options={[
                { value: 'celsius', label: label.celsius },
                { value: 'fahrenheit', label: label.fahrenheit },
              ]}
            />
          </Field>
          <Field label={strings.windSpeed}>
            <Segmented<WindUnit>
              label={strings.windSpeed}
              value={units.wind}
              onChange={wind => setUnits({ wind })}
              options={[
                { value: 'ms', label: label.ms },
                { value: 'kmh', label: label.kmh },
                { value: 'mph', label: label.mph },
              ]}
            />
          </Field>
          <Field label={strings.pressureUnit}>
            <Segmented<PressureUnit>
              label={strings.pressureUnit}
              value={units.pressure}
              onChange={pressure => setUnits({ pressure })}
              options={[
                { value: 'mmHg', label: label.mmHg },
                { value: 'hPa', label: label.hPa },
              ]}
            />
          </Field>
        </Section>

        <Section title={strings.notifications}>
          <ToggleRow
            title={strings.morningForecast}
            hint={strings.morningForecastHint}
            value={notif.morning}
            onChange={on => toggle('morning', on)}
          />
          {notif.morning ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              accessibilityLabel={strings.morningTime}
              contentContainerStyle={styles.times}>
              {MORNING_TIMES.map(time => {
                const selected = time === notif.morningTime;
                return (
                  <Pressable
                    key={time}
                    onPress={() => setNotifications({ morningTime: time })}
                    accessibilityRole="radio"
                    accessibilityState={{ selected }}
                    style={[styles.chip, selected && styles.chipSelected]}>
                    <AppText
                      variant="callout"
                      style={selected ? styles.chipSelectedText : undefined}>
                      {timeLabel(time)}
                    </AppText>
                  </Pressable>
                );
              })}
            </ScrollView>
          ) : null}
          <ToggleRow
            title={strings.rainAlerts}
            hint={strings.rainAlertsHint}
            value={notif.rain}
            onChange={on => toggle('rain', on)}
          />
          {showDenied ? (
            <View style={styles.denied}>
              <AppText tone="secondary">{strings.notificationsDenied}</AppText>
              <Button
                title={strings.openSettings}
                kind="secondary"
                onPress={() => Linking.openSettings()}
              />
            </View>
          ) : null}
          {primary && (notif.morning || notif.rain) ? (
            <AppText variant="caption" tone="tertiary" style={styles.note}>
              {strings.notificationsFor(primary.name)}
            </AppText>
          ) : null}
        </Section>

        <Section title={strings.about}>
          <InfoRow label={strings.openMeteo}>
            <Pressable
              accessibilityRole="link"
              onPress={() => Linking.openURL('https://open-meteo.com/')}>
              <AppText style={styles.link}>Open-Meteo.com</AppText>
            </Pressable>
          </InfoRow>
          <InfoRow label={strings.version}>
            <AppText tone="secondary">{version}</AppText>
          </InfoRow>
        </Section>
      </ScrollView>
    </View>
  );
};

const Field = ({ label, children }: { label: string; children: ReactNode }) => (
  <View style={styles.field}>
    <AppText variant="callout" tone="secondary">
      {label}
    </AppText>
    {children}
  </View>
);

const ToggleRow = ({
  title,
  hint,
  value,
  onChange,
}: {
  title: string;
  hint: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) => (
  <View style={styles.toggleRow}>
    <View style={styles.toggleText}>
      <AppText variant="headline">{title}</AppText>
      <AppText variant="caption" tone="secondary">
        {hint}
      </AppText>
    </View>
    <Switch
      value={value}
      onValueChange={onChange}
      accessibilityLabel={title}
      trackColor={{ false: colors.control, true: colors.sun }}
      thumbColor={colors.text}
      ios_backgroundColor={colors.control}
    />
  </View>
);

const InfoRow = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => (
  <View style={styles.infoRow}>
    <AppText>{label}</AppText>
    {children}
  </View>
);

const styles = StyleSheet.create({
  fill: { flex: 1 },
  field: { gap: 8, marginBottom: 16 },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 12,
  },
  toggleText: { flex: 1, gap: 2 },
  times: { gap: 8, paddingBottom: 8 },
  chip: {
    paddingHorizontal: 14,
    minHeight: 38,
    justifyContent: 'center',
    borderRadius: 19,
    backgroundColor: colors.control,
  },
  chipSelected: { backgroundColor: colors.text },
  chipSelectedText: { color: colors.buttonText },
  denied: { gap: 12, paddingVertical: 12 },
  note: { marginTop: 6 },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 44,
  },
  link: { textDecorationLine: 'underline' },
});
