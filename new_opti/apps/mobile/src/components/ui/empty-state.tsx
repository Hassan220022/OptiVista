import { View, Text, Pressable } from 'react-native';
import { useTheme } from '../../theme/provider';
import { Spacing, Radii } from '../../theme/spacing';

interface EmptyStateProps {
  emoji: string;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ emoji, title, subtitle, actionLabel, onAction }: EmptyStateProps) {
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl }}>
      <Text style={{ fontSize: 64 }}>{emoji}</Text>
      <Text style={{ fontSize: 20, fontWeight: '600', color: colors.text, marginTop: Spacing.lg, textAlign: 'center' }}>{title}</Text>
      {subtitle && <Text style={{ fontSize: 15, color: colors.textSecondary, marginTop: Spacing.xs, textAlign: 'center' }}>{subtitle}</Text>}
      {actionLabel && onAction && (
        <Pressable onPress={onAction} style={{ backgroundColor: colors.primary, borderRadius: Radii.md, paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, marginTop: Spacing.xl }}>
          <Text style={{ color: '#fff', fontSize: 17, fontWeight: '600' }}>{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}
