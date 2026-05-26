import { Pressable, ScrollView, Text, View } from 'react-native';
import { Link } from 'expo-router';

import { Spacing, Radii } from '../../theme/spacing';
import { useAuthStore } from '../../stores/auth-store';
import { useTheme } from '../../theme/provider';

export default function ProfileScreen() {
  const { colors } = useTheme();
  const { profile, signOut, user } = useAuthStore();

  const menuItems = [
    { label: 'Edit Profile', href: '/profile/edit' as const },
    { label: 'My Addresses', href: '/profile/addresses' as const },
    { label: 'My Orders', href: '/profile/orders' as const },
    { label: 'Settings', href: '/profile/settings' as const },
  ];

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ padding: Spacing.lg }}>
        <View style={{ alignItems: 'center', marginBottom: Spacing.xxl }}>
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: Radii.full,
              backgroundColor: colors.primary,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{ fontSize: 32, color: '#fff', fontWeight: '700' }}>
              {(profile?.full_name ?? user?.email ?? '?')[0].toUpperCase()}
            </Text>
          </View>
          <Text style={{ fontSize: 22, fontWeight: '700', color: colors.text, marginTop: Spacing.md }}>
            {profile?.full_name ?? 'User'}
          </Text>
          <Text style={{ fontSize: 15, color: colors.textSecondary }}>{user?.email}</Text>
        </View>

        {menuItems.map((item) => (
          <Link key={item.href} href={item.href} asChild>
            <Pressable
              style={{
                backgroundColor: colors.surface,
                borderRadius: Radii.md,
                padding: Spacing.lg,
                marginBottom: Spacing.sm,
              }}>
              <Text style={{ fontSize: 17, color: colors.text }}>{item.label}</Text>
            </Pressable>
          </Link>
        ))}

        <Pressable
          onPress={signOut}
          style={{
            backgroundColor: colors.error,
            borderRadius: Radii.md,
            padding: Spacing.lg,
            alignItems: 'center',
            marginTop: Spacing.xl,
          }}>
          <Text style={{ color: '#fff', fontSize: 17, fontWeight: '600' }}>Sign Out</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
