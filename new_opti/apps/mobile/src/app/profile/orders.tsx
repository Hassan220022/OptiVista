import { ScrollView, Text, View } from 'react-native';

import { Spacing } from '../../theme/spacing';
import { useTheme } from '../../theme/provider';

export default function OrdersScreen() {
  const { colors } = useTheme();

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ padding: Spacing.lg, alignItems: 'center', marginTop: 48 }}>
        <Text style={{ fontSize: 48 }}>📦</Text>
        <Text style={{ fontSize: 17, color: colors.textSecondary, marginTop: Spacing.md }}>No orders yet</Text>
        <Text style={{ fontSize: 15, color: colors.textTertiary, marginTop: Spacing.xs }}>
          Your order history will appear here
        </Text>
      </View>
    </ScrollView>
  );
}
