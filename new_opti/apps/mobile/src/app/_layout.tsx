import { Stack } from 'expo-router/stack';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { ThemeProvider, useTheme } from '../theme/provider';
import { useAuthStore } from '../stores/auth-store';
import { useCartStore } from '../stores/cart-store';
import { useSettingsStore } from '../stores/settings-store';

function RootLayoutNav() {
  const { colors } = useTheme();
  const { isInitialized } = useAuthStore();

  if (!isInitialized) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.background,
        }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="product/[id]" options={{ presentation: 'card' }} />
      <Stack.Screen name="ar-try-on/[id]" options={{ presentation: 'fullScreenModal' }} />
      <Stack.Screen name="checkout/shipping" options={{ headerShown: true, title: 'Shipping' }} />
      <Stack.Screen name="checkout/payment" options={{ headerShown: true, title: 'Payment' }} />
      <Stack.Screen name="checkout/review" options={{ headerShown: true, title: 'Review Order' }} />
      <Stack.Screen
        name="checkout/confirmation/[id]"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="profile/edit" options={{ headerShown: true, title: 'Edit Profile' }} />
      <Stack.Screen
        name="profile/addresses"
        options={{ headerShown: true, title: 'Addresses' }}
      />
      <Stack.Screen name="profile/orders" options={{ headerShown: true, title: 'My Orders' }} />
      <Stack.Screen
        name="profile/orders/[id]"
        options={{ headerShown: true, title: 'Order Details' }}
      />
      <Stack.Screen name="profile/settings" options={{ headerShown: true, title: 'Settings' }} />
      <Stack.Screen
        name="profile/settings/feedback"
        options={{ headerShown: true, title: 'Feedback' }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const initialize = useAuthStore((s) => s.initialize);
  const fetchCart = useCartStore((s) => s.fetchCart);
  const loadSettings = useSettingsStore((s) => s.loadSettings);

  useEffect(() => {
    initialize().then(() => fetchCart());
    loadSettings();
  }, [fetchCart, initialize, loadSettings]);

  return (
    <ThemeProvider>
      <RootLayoutNav />
    </ThemeProvider>
  );
}
