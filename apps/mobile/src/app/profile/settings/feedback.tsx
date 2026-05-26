import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useState } from 'react';

import { Spacing, Radii } from '../../../theme/spacing';
import { useTheme } from '../../../theme/provider';

const FEEDBACK_TYPES = ['App Experience', 'AR Accuracy', 'Order Issue', 'Feature Request', 'Bug Report', 'Other'];

export default function FeedbackScreen() {
  const { colors } = useTheme();
  const [selectedType, setSelectedType] = useState(0);
  const [message, setMessage] = useState('');

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ padding: Spacing.lg }}>
        <Text style={{ fontSize: 17, fontWeight: '600', color: colors.text, marginBottom: Spacing.md }}>
          {"What's this about?"}
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm }}>
          {FEEDBACK_TYPES.map((type, i) => (
            <Pressable
              key={type}
              onPress={() => setSelectedType(i)}
              style={{
                backgroundColor: selectedType === i ? colors.primary : colors.surface,
                borderRadius: Radii.full,
                paddingHorizontal: Spacing.md,
                paddingVertical: Spacing.sm,
              }}>
              <Text style={{ color: selectedType === i ? '#fff' : colors.text, fontSize: 14 }}>{type}</Text>
            </Pressable>
          ))}
        </View>
        <TextInput
          multiline
          placeholder="Tell us more..."
          value={message}
          onChangeText={setMessage}
          style={{
            backgroundColor: colors.surface,
            borderRadius: Radii.md,
            padding: Spacing.lg,
            fontSize: 17,
            color: colors.text,
            marginTop: Spacing.lg,
            minHeight: 120,
            textAlignVertical: 'top',
          }}
          placeholderTextColor={colors.textTertiary}
        />
        <Pressable
          style={{
            backgroundColor: colors.primary,
            borderRadius: Radii.md,
            padding: Spacing.lg,
            alignItems: 'center',
            marginTop: Spacing.lg,
          }}>
          <Text style={{ color: '#fff', fontSize: 17, fontWeight: '600' }}>Submit Feedback</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
