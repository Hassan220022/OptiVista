import { ScrollView, Text, View } from 'react-native';

import { Spacing } from '../../theme/spacing';
import { useCartStore } from '../../stores/cart-store';
import { useTheme } from '../../theme/provider';

export default function CartScreen() {
  const { colors } = useTheme();
  const { getItemCount, getSubtotal } = useCartStore();
  const count = getItemCount();

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ padding: Spacing.lg }}>
        <Text style={{ fontSize: 28, fontWeight: '700', color: colors.text }}>Cart</Text>
        {count === 0 ? (
          <View style={{ alignItems: 'center', marginTop: 48 }}>
            <Text style={{ fontSize: 48 }}>🛒</Text>
            <Text style={{ fontSize: 17, color: colors.textSecondary, marginTop: Spacing.md }}>Your cart is empty</Text>
          </View>
        ) : (
          <Text style={{ fontSize: 15, color: colors.textSecondary, marginTop: Spacing.xs }}>
            {count} item{count !== 1 ? 's' : ''} · ${(getSubtotal() / 100).toFixed(2)}
          </Text>
        )}
      </View>
    </ScrollView>
  );
}
