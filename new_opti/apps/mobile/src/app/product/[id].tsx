import { Pressable, ScrollView, Text, View } from 'react-native';
import { Link, useLocalSearchParams } from 'expo-router';

import { Spacing, Radii } from '../../theme/spacing';
import { useTheme } from '../../theme/provider';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ padding: Spacing.lg }}>
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: Radii.xl,
            height: 300,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{ fontSize: 64 }}>👓</Text>
          <Text style={{ color: colors.textSecondary, marginTop: Spacing.sm }}>Product {id}</Text>
        </View>

        <Text style={{ fontSize: 22, fontWeight: '700', color: colors.text, marginTop: Spacing.lg }}>
          Product Name
        </Text>
        <Text style={{ fontSize: 20, fontWeight: '600', color: colors.primary, marginTop: Spacing.xs }}>$0.00</Text>

        <Link href={`/ar-try-on/${id}`} asChild>
          <Pressable
            style={{
              backgroundColor: colors.primary,
              borderRadius: Radii.md,
              padding: Spacing.lg,
              alignItems: 'center',
              marginTop: Spacing.xl,
            }}>
            <Text style={{ color: '#fff', fontSize: 17, fontWeight: '600' }}>Try On with AR ✨</Text>
          </Pressable>
        </Link>

        <Pressable
          style={{
            backgroundColor: colors.secondary,
            borderRadius: Radii.md,
            padding: Spacing.lg,
            alignItems: 'center',
            marginTop: Spacing.md,
          }}>
          <Text style={{ color: '#fff', fontSize: 17, fontWeight: '600' }}>Add to Cart</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
