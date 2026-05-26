import { Alert, Pressable, Text, TextInput, View } from 'react-native';
import { useState } from 'react';

import { Spacing, Radii } from '../../theme/spacing';
import { useAuthStore } from '../../stores/auth-store';
import { useTheme } from '../../theme/provider';

export default function ForgotPasswordScreen() {
  const { colors } = useTheme();
  const resetPassword = useAuthStore((s) => s.resetPassword);
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleReset = async () => {
    try {
      await resetPassword(email);
      setSent(true);
    } catch (e) {
      Alert.alert('Error', (e as Error).message);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: Spacing.xl, justifyContent: 'center' }}>
      <Text style={{ fontSize: 28, fontWeight: '700', color: colors.text, marginBottom: Spacing.sm }}>Reset Password</Text>
      <Text style={{ fontSize: 15, color: colors.textSecondary, marginBottom: Spacing.xxl }}>
        {sent ? 'Check your email for a reset link.' : "Enter your email and we'll send you a reset link."}
      </Text>
      {!sent && (
        <>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
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
            onPress={handleReset}
            style={{
              backgroundColor: colors.primary,
              borderRadius: Radii.md,
              padding: Spacing.lg,
              alignItems: 'center',
            }}>
            <Text style={{ color: '#fff', fontSize: 17, fontWeight: '600' }}>Send Reset Link</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}
