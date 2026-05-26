import * as React from 'react';
import { Link, router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { ProductCard } from '../../components/ui/product-card';
import { useProducts } from '../../hooks/use-products';
import { useAuthStore } from '../../stores/auth-store';
import { useCartStore } from '../../stores/cart-store';
import { Spacing, Radii } from '../../theme/spacing';
import { useTheme } from '../../theme/provider';

export default function HomeScreen() {
  const { colors } = useTheme();
  const { user } = useAuthStore();
  const { products, isLoading, error } = useProducts(3);
  const addToCart = useCartStore((state) => state.addToCart);
  const [cartMessage, setCartMessage] = React.useState<string | null>(null);

  async function handleAddToCart(productId: string) {
    setCartMessage(null);
    try {
      await addToCart(productId);
      setCartMessage('Added to cart.');
    } catch (e) {
      setCartMessage(e instanceof Error ? e.message : 'Unable to add to cart.');
    }
  }

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ padding: Spacing.lg }}>
        <Text
          style={{
            fontSize: 28,
            fontWeight: '700',
            color: colors.text,
            letterSpacing: -0.4,
          }}>
          Hello, {user?.user_metadata?.full_name ?? 'there'}
        </Text>
        <Text style={{ fontSize: 15, color: colors.textSecondary, marginTop: Spacing.xs }}>
          Find your perfect pair of glasses
        </Text>

        <Link href="/ar-try-on/demo" asChild>
          <Pressable
            style={{
              backgroundColor: colors.primary,
              borderRadius: Radii.xl,
              padding: Spacing.xxl,
              marginTop: Spacing.lg,
            }}>
            <Text style={{ color: '#fff', fontSize: 22, fontWeight: '700' }}>Try On with AR</Text>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 15, marginTop: Spacing.xs }}>
              See how AR-ready frames look on your face
            </Text>
          </Pressable>
        </Link>

        <Text style={{ fontSize: 20, fontWeight: '600', color: colors.text, marginTop: Spacing.xxl }}>Categories</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginTop: Spacing.md }}>
          {['Sunglasses', 'Reading Glasses', 'Sports Glasses', 'AR Ready'].map((category) => (
            <Link href={`/catalog?category=${encodeURIComponent(category)}`} asChild key={category}>
              <Pressable
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: Radii.full,
                  paddingHorizontal: Spacing.lg,
                  paddingVertical: Spacing.sm,
                }}>
                <Text style={{ color: colors.text, fontSize: 15 }}>{category}</Text>
              </Pressable>
            </Link>
          ))}
        </View>

        <Text style={{ fontSize: 20, fontWeight: '600', color: colors.text, marginTop: Spacing.xxl }}>Featured</Text>
        {isLoading ? <Text style={{ fontSize: 15, color: colors.textSecondary, marginTop: Spacing.xs }}>Loading live products...</Text> : null}
        {error ? <Text style={{ fontSize: 15, color: colors.error, marginTop: Spacing.xs }}>{error}</Text> : null}
        {cartMessage ? <Text style={{ fontSize: 15, color: colors.primary, marginTop: Spacing.xs }}>{cartMessage}</Text> : null}
        <View style={{ gap: Spacing.lg, marginTop: Spacing.md }}>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onPress={(id) => router.push(`/product/${id}`)}
              onAddToCart={handleAddToCart}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
