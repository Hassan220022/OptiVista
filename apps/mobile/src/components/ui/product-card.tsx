import { Image } from 'expo-image';
import { View, Text, Pressable } from 'react-native';
import { useTheme } from '../../theme/provider';
import { Spacing, Radii } from '../../theme/spacing';
import type { Product } from '../../types/product';

interface ProductCardProps {
  product: Product;
  onPress: (id: string) => void;
  onAddToCart: (id: string) => void;
}

export function ProductCard({ product, onPress, onAddToCart }: ProductCardProps) {
  const { colors } = useTheme();
  const imageUrl = product.images[0];

  return (
    <View style={{ backgroundColor: colors.surface, borderRadius: Radii.lg, overflow: 'hidden' }}>
      <Pressable onPress={() => onPress(product.id)} style={{ height: 160, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={{ height: '100%', width: '100%' }} contentFit="cover" />
        ) : (
          <Text style={{ fontSize: 40 }}>👓</Text>
        )}
        {product.is_virtual_try_on_enabled && (
          <View style={{ position: 'absolute', top: Spacing.sm, right: Spacing.sm, backgroundColor: colors.primary, borderRadius: Radii.full, paddingHorizontal: Spacing.sm, paddingVertical: 2 }}>
            <Text style={{ color: '#fff', fontSize: 11, fontWeight: '600' }}>AR</Text>
          </View>
        )}
      </Pressable>
      <View style={{ padding: Spacing.md }}>
        <Pressable onPress={() => onPress(product.id)}>
          <Text style={{ fontSize: 15, fontWeight: '600', color: colors.text }} numberOfLines={1}>{product.name}</Text>
          <Text style={{ fontSize: 13, color: colors.textSecondary, marginTop: 2 }} numberOfLines={1}>{product.brand || product.category}</Text>
        </Pressable>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: Spacing.sm }}>
          <Text style={{ fontSize: 17, fontWeight: '700', color: colors.primary }}>${(product.price / 100).toFixed(2)}</Text>
          <Pressable
            disabled={product.stock_quantity === 0}
            onPress={() => onAddToCart(product.id)}
            style={{ backgroundColor: product.stock_quantity === 0 ? colors.textTertiary : colors.primary, borderRadius: Radii.sm, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs }}>
            <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600' }}>
              {product.stock_quantity === 0 ? 'Out' : 'Add'}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
