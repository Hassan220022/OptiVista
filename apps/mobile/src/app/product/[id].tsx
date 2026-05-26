import * as React from 'react';
import { Image } from 'expo-image';
import { Link, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { useProduct } from '../../hooks/use-products';
import { useCartStore } from '../../stores/cart-store';
import { Spacing, Radii } from '../../theme/spacing';
import { useTheme } from '../../theme/provider';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const { product, isLoading, error } = useProduct(id);
  const addToCart = useCartStore((state) => state.addToCart);
  const [cartMessage, setCartMessage] = React.useState<string | null>(null);

  async function handleAddToCart() {
    if (!product) return;
    setCartMessage(null);
    try {
      await addToCart(product.id);
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
        {isLoading ? <Text style={{ color: colors.textSecondary }}>Loading product...</Text> : null}
        {error ? <Text style={{ color: colors.error }}>{error}</Text> : null}
        {product ? (
          <>
            <View
              style={{
                backgroundColor: colors.surface,
                borderRadius: Radii.xl,
                height: 300,
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}>
              {product.images[0] ? (
                <Image source={{ uri: product.images[0] }} style={{ height: '100%', width: '100%' }} contentFit="cover" />
              ) : (
                <Text style={{ fontSize: 64 }}>👓</Text>
              )}
            </View>

            <Text style={{ fontSize: 22, fontWeight: '700', color: colors.text, marginTop: Spacing.lg }}>
              {product.name}
            </Text>
            <Text style={{ fontSize: 15, color: colors.textSecondary, marginTop: Spacing.xs }}>{product.brand || product.category}</Text>
            <Text style={{ fontSize: 20, fontWeight: '600', color: colors.primary, marginTop: Spacing.xs }}>
              ${(product.price / 100).toFixed(2)}
            </Text>
            <Text style={{ fontSize: 15, color: colors.textSecondary, marginTop: Spacing.md }}>{product.description}</Text>

            <Link href={`/ar-try-on/${id}`} asChild>
              <Pressable
                disabled={!product.is_virtual_try_on_enabled}
                style={{
                  backgroundColor: product.is_virtual_try_on_enabled ? colors.primary : colors.textTertiary,
                  borderRadius: Radii.md,
                  padding: Spacing.lg,
                  alignItems: 'center',
                  marginTop: Spacing.xl,
                }}>
                <Text style={{ color: '#fff', fontSize: 17, fontWeight: '600' }}>
                  {product.is_virtual_try_on_enabled ? 'Try On with AR' : 'AR not available'}
                </Text>
              </Pressable>
            </Link>

            <Pressable
              disabled={product.stock_quantity === 0}
              onPress={handleAddToCart}
              style={{
                backgroundColor: product.stock_quantity === 0 ? colors.textTertiary : colors.secondary,
                borderRadius: Radii.md,
                padding: Spacing.lg,
                alignItems: 'center',
                marginTop: Spacing.md,
              }}>
              <Text style={{ color: '#fff', fontSize: 17, fontWeight: '600' }}>
                {product.stock_quantity === 0 ? 'Out of stock' : 'Add to Cart'}
              </Text>
            </Pressable>
            {cartMessage ? <Text style={{ color: colors.primary, marginTop: Spacing.md, textAlign: 'center' }}>{cartMessage}</Text> : null}
          </>
        ) : null}
      </View>
    </ScrollView>
  );
}
