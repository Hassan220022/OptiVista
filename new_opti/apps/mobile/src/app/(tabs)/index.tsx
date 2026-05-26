import { Pressable, ScrollView, Text, View } from 'react-native';
import { Link } from 'expo-router';

import { Spacing, Radii } from '../../theme/spacing';
import { useAuthStore } from '../../stores/auth-store';
import { useTheme } from '../../theme/provider';

export default function HomeScreen() {
  const { colors } = useTheme();
  const { user } = useAuthStore();

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ padding: Spacing.lg }}>
        <Text
          style={{
            fontSize: 28,
            fontWeight: '700',
            color: colors.text,
            letterSpacing: -0.4,
          }}>
          Hello, {user?.user_metadata?.full_name ?? 'there'} 👋
        </Text>
        <Text style={{ fontSize: 15, color: colors.textSecondary, marginTop: Spacing.xs }}>
          Find your perfect pair of glasses
        </Text>

        {/* Hero Card */}
        <Link href="/ar-try-on/demo" asChild>
          <Pressable
            style={{
              backgroundColor: colors.primary,
              borderRadius: Radii.xl,
              padding: Spacing.xxl,
              marginTop: Spacing.lg,
            }}>
            <Text style={{ color: '#fff', fontSize: 22, fontWeight: '700' }}>Try On with AR ✨</Text>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 15, marginTop: Spacing.xs }}>
              See how glasses look on your face
            </Text>
          </Pressable>
        </Link>

        {/* Categories */}
        <Text style={{ fontSize: 20, fontWeight: '600', color: colors.text, marginTop: Spacing.xxl }}>Categories</Text>
        <View
          style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginTop: Spacing.md }}>
          {['Sunglasses', 'Optical', 'Sport', 'Men', 'Women'].map((cat) => (
            <Link href={`/catalog?category=${cat.toLowerCase()}`} asChild key={cat}>
              <Pressable
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: Radii.full,
                  paddingHorizontal: Spacing.lg,
                  paddingVertical: Spacing.sm,
                }}>
                <Text style={{ color: colors.text, fontSize: 15 }}>{cat}</Text>
              </Pressable>
            </Link>
          ))}
        </View>

        {/* Featured Products */}
        <Text style={{ fontSize: 20, fontWeight: '600', color: colors.text, marginTop: Spacing.xxl }}>Featured</Text>
        <Text style={{ fontSize: 15, color: colors.textSecondary, marginTop: Spacing.xs }}>
          Coming soon — products will load from API
        </Text>
      </View>
    </ScrollView>
  );
}
