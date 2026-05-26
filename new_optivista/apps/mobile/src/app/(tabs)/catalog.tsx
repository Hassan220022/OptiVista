import { Pressable, ScrollView, Text, View } from 'react-native';

import { Spacing, Radii } from '../../theme/spacing';
import { useTheme } from '../../theme/provider';

export default function CatalogScreen() {
  const { colors } = useTheme();

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ padding: Spacing.lg }}>
        <Text style={{ fontSize: 28, fontWeight: '700', color: colors.text }}>Catalog</Text>
        <Text style={{ fontSize: 15, color: colors.textSecondary, marginTop: Spacing.xs }}>
          Browse our eyewear collection
        </Text>
        <View style={{ flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.md }}>
          {['All', 'Sunglasses', 'Optical', 'Sport', 'AR Ready'].map((f) => (
            <Pressable
              key={f}
              style={{
                backgroundColor: f === 'All' ? colors.primary : colors.surface,
                borderRadius: Radii.full,
                paddingHorizontal: Spacing.lg,
                paddingVertical: Spacing.sm,
              }}>
              <Text style={{ color: f === 'All' ? '#fff' : colors.text, fontSize: 14 }}>{f}</Text>
            </Pressable>
          ))}
        </View>
        <Text style={{ fontSize: 15, color: colors.textSecondary, marginTop: Spacing.xxl, textAlign: 'center' }}>
          Products will load from API
        </Text>
      </View>
    </ScrollView>
  );
}
