import { Redirect } from 'expo-router';
import { Stack } from 'expo-router/stack';

import { useTheme } from '../../theme/provider';
import { useAuthStore } from '../../stores/auth-store';

export default function AuthLayout() {
  const { colors } = useTheme();
  const { session } = useAuthStore();

  if (session) return <Redirect href="/(tabs)" />;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}>
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="sign-up" />
      <Stack.Screen name="forgot-password" />
    </Stack>
  );
}
