import * as React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { ProductCard } from '../../components/ui/product-card';
import { useProducts } from '../../hooks/use-products';
import { useCartStore } from '../../stores/cart-store';
import { Spacing, Radii } from '../../theme/spacing';
import { useTheme } from '../../theme/provider';

const baseFilters = ['All', 'AR Ready'];

export default function CatalogScreen() {
  const { colors } = useTheme();
  const params = useLocalSearchParams<{ category?: string }>();
  const selectedFilter = params.category ?? 'All';
  const { products, isLoading, error } = useProducts();
  const addToCart = useCartStore((state) => state.addToCart);
  const [cartMessage, setCartMessage] = React.useState<string | null>(null);

  const visibleProducts = products.filter((product) => {
    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'AR Ready') return product.is_virtual_try_on_enabled;
    return product.category === selectedFilter;
  });
  const filters = [
    ...baseFilters,
    ...Array.from(new Set(products.map((product) => product.category).filter(Boolean) as string[])),
  ];

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
        <Text style={{ fontSize: 28, fontWeight: '700', color: colors.text }}>Catalog</Text>
        <Text style={{ fontSize: 15, color: colors.textSecondary, marginTop: Spacing.xs }}>
          Browse the live OptiVista eyewear collection
        </Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: Spacing.md }}>
          <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
            {filters.map((filter) => (
              <Pressable
                key={filter}
                onPress={() => router.setParams({ category: filter })}
                style={{
                  backgroundColor: selectedFilter === filter ? colors.primary : colors.surface,
                  borderRadius: Radii.full,
                  paddingHorizontal: Spacing.lg,
                  paddingVertical: Spacing.sm,
                }}>
                <Text style={{ color: selectedFilter === filter ? '#fff' : colors.text, fontSize: 14 }}>{filter}</Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        {cartMessage ? <Text style={{ color: colors.primary, marginTop: Spacing.md }}>{cartMessage}</Text> : null}
        {isLoading ? <Text style={{ color: colors.textSecondary, marginTop: Spacing.xxl, textAlign: 'center' }}>Loading products...</Text> : null}
        {error ? <Text style={{ color: colors.error, marginTop: Spacing.xxl, textAlign: 'center' }}>{error}</Text> : null}
        {!isLoading && !error && visibleProducts.length === 0 ? (
          <Text style={{ fontSize: 15, color: colors.textSecondary, marginTop: Spacing.xxl, textAlign: 'center' }}>
            No live products match this filter.
          </Text>
        ) : null}

        <View style={{ gap: Spacing.lg, marginTop: Spacing.xl }}>
          {visibleProducts.map((product) => (
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
