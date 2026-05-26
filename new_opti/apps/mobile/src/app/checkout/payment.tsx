import { ScrollView, Text, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';

import { Spacing, Radii } from '../../theme/spacing';
import { useTheme } from '../../theme/provider';

const PAYMENT_METHODS = ['Credit Card', 'Apple Pay', 'Google Pay', 'Cash on Delivery'];

export default function PaymentScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [selected, setSelected] = useState(0);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ padding: Spacing.lg }}>
        <Text style={{ fontSize: 22, fontWeight: '700', color: colors.text, marginBottom: Spacing.lg }}>
          Payment Method
        </Text>
        {PAYMENT_METHODS.map((method, i) => (
          <Pressable
            key={method}
            onPress={() => setSelected(i)}
            style={{
              backgroundColor: selected === i ? `${colors.primary}15` : colors.surface,
              borderWidth: selected === i ? 2 : 0,
              borderColor: colors.primary,
              borderRadius: Radii.md,
              padding: Spacing.lg,
              marginBottom: Spacing.sm,
            }}>
            <Text
              style={{
                fontSize: 17,
                color: selected === i ? colors.primary : colors.text,
                fontWeight: selected === i ? '600' : '400',
              }}>
              {method}
            </Text>
          </Pressable>
        ))}
        <Pressable
          onPress={() => router.push('/checkout/review')}
          style={{
            backgroundColor: colors.primary,
            borderRadius: Radii.md,
            padding: Spacing.lg,
            alignItems: 'center',
            marginTop: Spacing.lg,
          }}>
          <Text style={{ color: '#fff', fontSize: 17, fontWeight: '600' }}>Review Order</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
