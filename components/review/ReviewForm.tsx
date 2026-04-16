import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useState } from 'react';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useAuthStore } from '@/stores/useAuthStore';
import { useCreateReview } from '@/hooks/useReviews';
import StarRating from './StarRating';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface Props {
  placeId: string;
}

export default function ReviewForm({ placeId }: Props) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const user = useAuthStore((s) => s.user);
  const { mutateAsync, isPending } = useCreateReview();

  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');

  const submitScale = useSharedValue(1);
  const submitStyle = useAnimatedStyle(() => ({
    transform: [{ scale: submitScale.value }],
  }));

  if (!user) {
    return (
      <Text style={[styles.loginHint, { color: colors.textSecondary }]}>
        리뷰를 작성하려면 로그인이 필요합니다.
      </Text>
    );
  }

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('알림', '별점을 선택해주세요.');
      return;
    }

    submitScale.value = withSpring(0.95);

    try {
      await mutateAsync({ placeId, rating, content: content.trim() });
      setRating(0);
      setContent('');
      Alert.alert('완료', '리뷰가 등록되었습니다.');
    } catch (error: any) {
      Alert.alert('오류', error.message ?? '리뷰 등록에 실패했습니다.');
    } finally {
      submitScale.value = withSpring(1);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text }]}>별점</Text>
      <StarRating rating={rating} onRate={setRating} size={32} />

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colorScheme === 'dark' ? '#1A1A1A' : '#F9FAFB',
            color: colors.text,
            borderColor: colors.border,
          },
        ]}
        placeholder="리뷰를 작성해주세요 (선택)"
        placeholderTextColor={colors.textSecondary}
        value={content}
        onChangeText={setContent}
        multiline
        numberOfLines={3}
      />

      <AnimatedPressable
        onPress={handleSubmit}
        disabled={isPending}
        style={[
          styles.submitButton,
          submitStyle,
          { opacity: isPending ? 0.6 : 1 },
        ]}>
        {isPending ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text style={styles.submitText}>리뷰 등록</Text>
        )}
      </AnimatedPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  loginHint: {
    fontSize: 13,
    textAlign: 'center',
    marginVertical: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    minHeight: 70,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#F97316',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
