import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useReviews } from '@/hooks/useReviews';
import StarRating from './StarRating';

interface Props {
  placeId: string;
}

export default function ReviewList({ placeId }: Props) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { data: reviews, isLoading } = useReviews(placeId);

  if (isLoading) {
    return <ActivityIndicator size="small" color={colors.tint} style={{ marginVertical: 16 }} />;
  }

  if (!reviews?.length) {
    return (
      <Text style={[styles.empty, { color: colors.textSecondary }]}>
        아직 리뷰가 없습니다. 첫 리뷰를 남겨보세요!
      </Text>
    );
  }

  return (
    <View style={styles.container}>
      {reviews.map((review) => (
        <View
          key={review.id}
          style={[
            styles.reviewItem,
            {
              backgroundColor: colorScheme === 'dark' ? '#1A1A1A' : '#F9FAFB',
              borderColor: colors.border,
            },
          ]}>
          <View style={styles.reviewHeader}>
            <View style={styles.reviewUser}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {review.userName.charAt(0).toUpperCase()}
                </Text>
              </View>
              <Text style={[styles.userName, { color: colors.text }]}>
                {review.userName}
              </Text>
            </View>
            <StarRating rating={review.rating} size={14} readonly />
          </View>
          {review.content ? (
            <Text style={[styles.reviewContent, { color: colors.text }]}>
              {review.content}
            </Text>
          ) : null}
          <Text style={[styles.reviewDate, { color: colors.textSecondary }]}>
            {new Date(review.createdAt).toLocaleDateString('ko-KR')}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  empty: {
    fontSize: 13,
    textAlign: 'center',
    marginVertical: 16,
  },
  reviewItem: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewUser: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F97316',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  userName: {
    fontSize: 13,
    fontWeight: '600',
  },
  reviewContent: {
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 6,
  },
  reviewDate: {
    fontSize: 11,
  },
});
