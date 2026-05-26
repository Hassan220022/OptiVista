import { ScrollView, Text, View } from 'react-native';

import { Spacing } from '../../theme/spacing';
import { useTheme } from '../../theme/provider';

export default function AddressesScreen() {
  const { colors } = useTheme();

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ padding: Spacing.lg, alignItems: 'center', marginTop: 48 }}>
        <Text style={{ fontSize: 48 }}>📍</Text>
        <Text style={{ fontSize: 17, color: colors.textSecondary, marginTop: Spacing.md }}>No addresses yet</Text>
        <Text style={{ fontSize: 15, color: colors.textTertiary, marginTop: Spacing.xs }}>
          Add your first shipping address
        </Text>
      </View>
    </ScrollView>
  );
}
