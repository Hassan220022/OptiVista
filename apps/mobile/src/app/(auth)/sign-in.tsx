import { ActivityIndicator, Alert, Pressable, Text, TextInput, View } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';

import { Spacing, Radii } from '../../theme/spacing';
import { useAuthStore } from '../../stores/auth-store';
import { useTheme } from '../../theme/provider';

export default function SignInScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const signIn = useAuthStore((s) => s.signIn);
  const isLoading = useAuthStore((s) => s.isLoading);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    try {
      await signIn(email, password);
      router.replace('/(tabs)');
    } catch (e) {
      Alert.alert('Sign In Failed', (e as Error).message);
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
          Welcome Back
        </Text>
        <Text style={{ fontSize: 15, color: colors.textSecondary, marginBottom: Spacing.xxl }}>
          Sign in to continue shopping
        </Text>

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
          onPress={handleSignIn}
          disabled={isLoading}
          style={{
            backgroundColor: colors.primary,
            borderRadius: Radii.md,
            padding: Spacing.lg,
            alignItems: 'center',
            opacity: isLoading ? 0.7 : 1,
          }}>
          {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff', fontSize: 17, fontWeight: '600' }}>Sign In</Text>}
        </Pressable>

        <Link href="/(auth)/forgot-password" style={{ textAlign: 'center', marginTop: Spacing.md, color: colors.primary, fontSize: 15 }}>
          Forgot Password?
        </Link>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'center', paddingBottom: Spacing.xl }}>
        <Text style={{ color: colors.textSecondary }}>{"Don't have an account? "}</Text>
        <Link href="/(auth)/sign-up" style={{ color: colors.primary, fontWeight: '600' }}>
          Sign Up
        </Link>
      </View>
    </View>
  );
}
