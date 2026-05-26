import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useState } from 'react';

import { Spacing, Radii } from '../../theme/spacing';
import { useAuthStore } from '../../stores/auth-store';
import { useTheme } from '../../theme/provider';

export default function EditProfileScreen() {
  const { colors } = useTheme();
  const { profile } = useAuthStore();
  const [name, setName] = useState(profile?.full_name ?? '');
  const [phone, setPhone] = useState(profile?.phone ?? '');

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ padding: Spacing.lg }}>
        <TextInput
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
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
        <TextInput
          placeholder="Phone"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          style={{
            backgroundColor: colors.surface,
            borderRadius: Radii.md,
            padding: Spacing.lg,
            fontSize: 17,
            color: colors.text,
            marginBottom: Spacing.lg,
          }}
          placeholderTextColor={colors.textTertiary}
        />
        <Pressable
          style={{
            backgroundColor: colors.primary,
            borderRadius: Radii.md,
            padding: Spacing.lg,
            alignItems: 'center',
          }}>
          <Text style={{ color: '#fff', fontSize: 17, fontWeight: '600' }}>Save Changes</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
