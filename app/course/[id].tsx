import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { NaverMapView, NaverMapPathOverlay } from '@mj-studio/react-native-naver-map';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useCourse } from '@/hooks/useCourses';
import { openNavigation } from '@/lib/navigation';
import { DIFFICULTY_CONFIG, formatDistance, formatDuration } from '@/constants/course';

export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { data: course, isLoading } = useCourse(id ?? null);

  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.tint} />
      </View>
    );
  }

  if (!course) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.textSecondary }}>코스를 찾을 수 없습니다.</Text>
      </View>
    );
  }

  const diff = DIFFICULTY_CONFIG[course.difficulty];
  const coords = (course.coordinates as [number, number][]).map(([lng, lat]) => ({
    latitude: lat,
    longitude: lng,
  }));

  // 지도 카메라 중심 계산
  const lats = coords.map((c) => c.latitude);
  const lngs = coords.map((c) => c.longitude);
  const centerLat = (Math.max(...lats) + Math.min(...lats)) / 2;
  const centerLng = (Math.max(...lngs) + Math.min(...lngs)) / 2;

  // 목적지 (마지막 좌표)
  const destination = coords[coords.length - 1];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}>
      {/* 지도 미리보기 */}
      {coords.length >= 2 && (
        <View style={styles.mapContainer}>
          <NaverMapView
            style={styles.map}
            mapType="Basic"
            isNightModeEnabled={colorScheme === 'dark'}
            isShowLocationButton={false}
            isShowCompass={false}
            isShowScaleBar={false}
            isShowZoomControls={false}
            locale="ko"
            initialCamera={{
              latitude: centerLat,
              longitude: centerLng,
              zoom: 9,
            }}>
            <NaverMapPathOverlay
              coords={coords}
              width={5}
              color="#F97316"
              outlineWidth={2}
              outlineColor="#FFFFFF"
            />
          </NaverMapView>
        </View>
      )}

      {/* 코스 정보 */}
      <View style={styles.info}>
        <View style={styles.header}>
          <View style={[styles.diffBadge, { backgroundColor: diff.color + '20' }]}>
            <Text style={[styles.diffText, { color: diff.color }]}>{diff.label}</Text>
          </View>
          {course.rating > 0 && (
            <View style={styles.ratingRow}>
              <Text style={styles.ratingStar}>★</Text>
              <Text style={[styles.ratingText, { color: colors.text }]}>
                {course.rating}
              </Text>
              <Text style={[styles.reviewCount, { color: colors.textSecondary }]}>
                ({course.reviewCount})
              </Text>
            </View>
          )}
        </View>

        <Text style={[styles.name, { color: colors.text }]}>{course.name}</Text>
        {course.description ? (
          <Text style={[styles.desc, { color: colors.textSecondary }]}>
            {course.description}
          </Text>
        ) : null}

        <View style={[styles.statsRow, { borderColor: colors.border }]}>
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {formatDistance(course.distance)}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              거리
            </Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {formatDuration(course.duration)}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              예상 시간
            </Text>
          </View>
        </View>

        {destination && (
          <Pressable
            onPress={() =>
              openNavigation({
                name: course.name,
                latitude: destination.latitude,
                longitude: destination.longitude,
              })
            }
            style={({ pressed }) => [
              styles.navButton,
              { opacity: pressed ? 0.8 : 1 },
            ]}>
            <Text style={styles.navButtonText}>이 코스로 네비 시작</Text>
          </Pressable>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapContainer: {
    height: 280,
  },
  map: {
    flex: 1,
  },
  info: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  diffBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  diffText: {
    fontSize: 13,
    fontWeight: '700',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingStar: {
    fontSize: 14,
    color: '#FBBF24',
    marginRight: 2,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '700',
  },
  reviewCount: {
    fontSize: 12,
    marginLeft: 2,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  desc: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 16,
    marginBottom: 20,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
  },
  statDivider: {
    width: 1,
    height: 32,
  },
  navButton: {
    backgroundColor: '#F97316',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  navButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
