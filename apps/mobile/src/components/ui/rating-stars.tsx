import { View, Text } from 'react-native';
import { useTheme } from '../../theme/provider';
import { Spacing } from '../../theme/spacing';

interface RatingStarsProps {
  rating: number;
  reviewCount?: number;
  size?: number;
}

export function RatingStars({ rating, reviewCount, size = 16 }: RatingStarsProps) {
  const { colors } = useTheme();

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.xs }}>
      <Text style={{ fontSize: size, color: '#FFD700' }}>
        {'★'.repeat(Math.floor(rating))}{rating % 1 >= 0.5 ? '½' : '☆'.repeat(5 - Math.ceil(rating))}
      </Text>
      <Text style={{ fontSize: 13, color: colors.textSecondary }}>{rating.toFixed(1)}</Text>
      {reviewCount !== undefined && (
        <Text style={{ fontSize: 13, color: colors.textTertiary }}>({reviewCount})</Text>
      )}
    </View>
  );
}
