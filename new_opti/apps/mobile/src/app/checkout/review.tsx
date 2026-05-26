import { Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { Spacing, Radii } from '../../theme/spacing';
import { useCartStore } from '../../stores/cart-store';
import { useTheme } from '../../theme/provider';

export default function ReviewScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { getSubtotal, items } = useCartStore();

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ padding: Spacing.lg }}>
        <Text style={{ fontSize: 22, fontWeight: '700', color: colors.text, marginBottom: Spacing.lg }}>
          Review Order
        </Text>
        <View style={{ backgroundColor: colors.surface, borderRadius: Radii.md, padding: Spacing.lg, marginBottom: Spacing.md }}>
          <Text style={{ fontSize: 15, fontWeight: '600', color: colors.text }}>Shipping Address</Text>
          <Text style={{ fontSize: 15, color: colors.textSecondary, marginTop: Spacing.xs }}>
            Address entered in previous step
          </Text>
        </View>
        <View style={{ backgroundColor: colors.surface, borderRadius: Radii.md, padding: Spacing.lg, marginBottom: Spacing.md }}>
          <Text style={{ fontSize: 15, fontWeight: '600', color: colors.text }}>Payment Method</Text>
          <Text style={{ fontSize: 15, color: colors.textSecondary, marginTop: Spacing.xs }}>
            Selected payment method
          </Text>
        </View>
        <View style={{ backgroundColor: colors.surface, borderRadius: Radii.md, padding: Spacing.lg, marginBottom: Spacing.md }}>
          <Text style={{ fontSize: 15, fontWeight: '600', color: colors.text, marginBottom: Spacing.sm }}>
            Order Summary
          </Text>
          <Text style={{ fontSize: 15, color: colors.textSecondary }}>{items.length} item(s)</Text>
          <View style={{ borderTopWidth: 1, borderTopColor: colors.border, marginTop: Spacing.md, paddingTop: Spacing.md }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: colors.textSecondary }}>Subtotal</Text>
              <Text style={{ color: colors.text }}>${(getSubtotal() / 100).toFixed(2)}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.xs }}>
              <Text style={{ color: colors.textSecondary }}>Shipping</Text>
              <Text style={{ color: colors.text }}>Free</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.sm }}>
              <Text style={{ fontSize: 17, fontWeight: '600', color: colors.text }}>Total</Text>
              <Text style={{ fontSize: 17, fontWeight: '600', color: colors.primary }}>
                ${(getSubtotal() / 100).toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
        <Pressable
          onPress={() => router.push('/checkout/confirmation/demo-order')}
          style={{
            backgroundColor: colors.primary,
            borderRadius: Radii.md,
            padding: Spacing.lg,
            alignItems: 'center',
          }}>
          <Text style={{ color: '#fff', fontSize: 17, fontWeight: '600' }}>Place Order</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
