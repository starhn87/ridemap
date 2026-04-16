import { View, Pressable, Text, StyleSheet } from 'react-native';

interface Props {
  rating: number;
  onRate?: (rating: number) => void;
  size?: number;
  readonly?: boolean;
}

export default function StarRating({
  rating,
  onRate,
  size = 24,
  readonly = false,
}: Props) {
  return (
    <View style={styles.container}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Pressable
          key={star}
          onPress={() => !readonly && onRate?.(star)}
          disabled={readonly}>
          <Text
            style={[
              styles.star,
              { fontSize: size, color: star <= rating ? '#FBBF24' : '#D1D5DB' },
            ]}>
            ★
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 2,
  },
  star: {
    lineHeight: undefined,
  },
});
