import { Pressable, Text, View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { Spacing, Radii } from '../../theme/spacing';
import { useTheme } from '../../theme/provider';

export default function ARTryOnScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: '#fff', fontSize: 20, fontWeight: '600' }}>AR Try-On</Text>
      <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15, marginTop: Spacing.sm }}>Product: {id}</Text>
      <Text
        style={{
          color: 'rgba(255,255,255,0.5)',
          fontSize: 13,
          marginTop: Spacing.md,
          textAlign: 'center',
          paddingHorizontal: Spacing.xl,
        }}>
        AR camera integration requires native modules (ARKit/ARCore). This placeholder will be replaced with the
        actual AR experience.
      </Text>
      <Pressable
        onPress={() => router.back()}
        style={{
          backgroundColor: '#fff',
          borderRadius: Radii.md,
          paddingHorizontal: Spacing.xl,
          paddingVertical: Spacing.md,
          marginTop: Spacing.xxl,
        }}>
        <Text style={{ color: '#000', fontWeight: '600' }}>Close</Text>
      </Pressable>
    </View>
  );
}
