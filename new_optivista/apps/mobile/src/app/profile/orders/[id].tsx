import { ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { Spacing } from '../../../theme/spacing';
import { useTheme } from '../../../theme/provider';

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ padding: Spacing.lg }}>
        <Text style={{ fontSize: 22, fontWeight: '700', color: colors.text }}>Order #{id}</Text>
        <Text style={{ fontSize: 15, color: colors.textSecondary, marginTop: Spacing.xs }}>
          Order details will load from API
        </Text>
      </View>
    </ScrollView>
  );
}
