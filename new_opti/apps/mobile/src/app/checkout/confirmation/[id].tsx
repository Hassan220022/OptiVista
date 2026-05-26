import { Pressable, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { Spacing, Radii } from '../../../theme/spacing';
import { useTheme } from '../../../theme/provider';

export default function ConfirmationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.xl,
      }}>
      <Text style={{ fontSize: 64 }}>🎉</Text>
      <Text style={{ fontSize: 28, fontWeight: '700', color: colors.text, marginTop: Spacing.lg }}>Order Placed!</Text>
      <Text style={{ fontSize: 15, color: colors.textSecondary, marginTop: Spacing.sm, textAlign: 'center' }}>
        Your order #{id} has been placed successfully.
      </Text>
      <Pressable
        onPress={() => router.replace('/(tabs)')}
        style={{
          backgroundColor: colors.primary,
          borderRadius: Radii.md,
          paddingHorizontal: Spacing.xxl,
          paddingVertical: Spacing.lg,
          marginTop: Spacing.xxl,
        }}>
        <Text style={{ color: '#fff', fontSize: 17, fontWeight: '600' }}>Continue Shopping</Text>
      </Pressable>
    </View>
  );
}
