import { View, ActivityIndicator, Text } from 'react-native';
import { useTheme } from '../../theme/provider';
import { Spacing } from '../../theme/spacing';

interface LoadingIndicatorProps {
  message?: string;
}

export function LoadingIndicator({ message }: LoadingIndicatorProps) {
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
      <ActivityIndicator size="large" color={colors.primary} />
      {message && <Text style={{ color: colors.textSecondary, marginTop: Spacing.md, fontSize: 15 }}>{message}</Text>}
    </View>
  );
}
