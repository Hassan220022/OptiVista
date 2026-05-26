import { View, Text, Pressable } from 'react-native';
import { useTheme } from '../../theme/provider';
import { Spacing, Radii } from '../../theme/spacing';

interface ErrorViewProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorView({ message, onRetry }: ErrorViewProps) {
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl }}>
      <Text style={{ fontSize: 64 }}>😕</Text>
      <Text style={{ fontSize: 17, color: colors.text, marginTop: Spacing.lg, textAlign: 'center' }}>Something went wrong</Text>
      <Text style={{ fontSize: 15, color: colors.textSecondary, marginTop: Spacing.xs, textAlign: 'center' }}>{message}</Text>
      {onRetry && (
        <Pressable onPress={onRetry} style={{ backgroundColor: colors.primary, borderRadius: Radii.md, paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, marginTop: Spacing.lg }}>
          <Text style={{ color: '#fff', fontSize: 17, fontWeight: '600' }}>Try Again</Text>
        </Pressable>
      )}
    </View>
  );
}
