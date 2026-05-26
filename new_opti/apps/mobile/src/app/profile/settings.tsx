import { Pressable, ScrollView, Text, View } from 'react-native';
import { Link } from 'expo-router';

import { Spacing, Radii } from '../../theme/spacing';
import { useSettingsStore } from '../../stores/settings-store';
import { useTheme, useToggleTheme } from '../../theme/provider';

export default function SettingsScreen() {
  const { colors } = useTheme();
  const toggleTheme = useToggleTheme();
  const { areNotificationsEnabled, isDarkMode, setDarkMode, setNotificationsEnabled } = useSettingsStore();

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ padding: Spacing.lg }}>
        <View style={{ backgroundColor: colors.surface, borderRadius: Radii.md, padding: Spacing.lg, marginBottom: Spacing.md }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 17, color: colors.text }}>Dark Mode</Text>
            <Pressable
              onPress={() => {
                setDarkMode(!isDarkMode);
                toggleTheme();
              }}
              style={{
                width: 51,
                height: 31,
                borderRadius: Radii.full,
                backgroundColor: isDarkMode ? colors.primary : colors.border,
                padding: 2,
              }}>
              <View
                style={{
                  width: 27,
                  height: 27,
                  borderRadius: Radii.full,
                  backgroundColor: '#fff',
                  transform: [{ translateX: isDarkMode ? 20 : 0 }],
                }}
              />
            </Pressable>
          </View>
        </View>
        <View style={{ backgroundColor: colors.surface, borderRadius: Radii.md, padding: Spacing.lg, marginBottom: Spacing.md }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 17, color: colors.text }}>Notifications</Text>
            <Pressable
              onPress={() => setNotificationsEnabled(!areNotificationsEnabled)}
              style={{
                width: 51,
                height: 31,
                borderRadius: Radii.full,
                backgroundColor: areNotificationsEnabled ? colors.primary : colors.border,
                padding: 2,
              }}>
              <View
                style={{
                  width: 27,
                  height: 27,
                  borderRadius: Radii.full,
                  backgroundColor: '#fff',
                  transform: [{ translateX: areNotificationsEnabled ? 20 : 0 }],
                }}
              />
            </Pressable>
          </View>
        </View>
        <Link href="/profile/settings/feedback" asChild>
          <Pressable
            style={{
              backgroundColor: colors.surface,
              borderRadius: Radii.md,
              padding: Spacing.lg,
              marginBottom: Spacing.md,
            }}>
            <Text style={{ fontSize: 17, color: colors.text }}>Feedback & Support</Text>
          </Pressable>
        </Link>
      </View>
    </ScrollView>
  );
}
