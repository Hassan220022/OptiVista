import { ActivityIndicator, Alert, Pressable, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';

import { Spacing, Radii } from '../../theme/spacing';
import { useAuthStore } from '../../stores/auth-store';
import { useTheme } from '../../theme/provider';

export default function SignUpScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const signUp = useAuthStore((s) => s.signUp);
  const isLoading = useAuthStore((s) => s.isLoading);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    try {
      await signUp(email, password, fullName);
      router.replace('/(tabs)');
    } catch (e) {
      Alert.alert('Sign Up Failed', (e as Error).message);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: Spacing.xl }}>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text
          style={{
            fontSize: 34,
            fontWeight: '700',
            color: colors.text,
            letterSpacing: -0.4,
            marginBottom: Spacing.xs,
          }}>
          Create Account
        </Text>
        <Text style={{ fontSize: 15, color: colors.textSecondary, marginBottom: Spacing.xxl }}>
          Join OptiVista and try on glasses virtually
        </Text>

        <TextInput
          placeholder="Full Name"
          value={fullName}
          onChangeText={setFullName}
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
            marginBottom: Spacing.md,
          }}
          placeholderTextColor={colors.textTertiary}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
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
          onPress={handleSignUp}
          disabled={isLoading}
          style={{
            backgroundColor: colors.primary,
            borderRadius: Radii.md,
            padding: Spacing.lg,
            alignItems: 'center',
            opacity: isLoading ? 0.7 : 1,
          }}>
          {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff', fontSize: 17, fontWeight: '600' }}>Create Account</Text>}
        </Pressable>
      </View>
    </View>
  );
}
