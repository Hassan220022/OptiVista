import { ScrollView, Text, TextInput, View, Pressable } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';

import { Spacing, Radii } from '../../theme/spacing';
import { useTheme } from '../../theme/provider';

export default function ShippingScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
  });

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ padding: Spacing.lg }}>
        <Text style={{ fontSize: 22, fontWeight: '700', color: colors.text, marginBottom: Spacing.lg }}>
          Shipping Address
        </Text>
        {(['name', 'phone', 'address', 'city', 'state', 'zip'] as const).map((field) => (
          <TextInput
            key={field}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={form[field]}
            onChangeText={(v) => setForm((prev) => ({ ...prev, [field]: v }))}
            style={{
              backgroundColor: colors.surface,
              borderRadius: Radii.md,
              padding: Spacing.lg,
              fontSize: 17,
              color: colors.text,
              marginBottom: Spacing.md,
            }}
            placeholderTextColor={colors.textTertiary}
          />
        ))}
        <Pressable
          onPress={() => router.push('/checkout/payment')}
          style={{
            backgroundColor: colors.primary,
            borderRadius: Radii.md,
            padding: Spacing.lg,
            alignItems: 'center',
            marginTop: Spacing.md,
          }}>
          <Text style={{ color: '#fff', fontSize: 17, fontWeight: '600' }}>Continue to Payment</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
