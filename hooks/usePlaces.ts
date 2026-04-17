import { useQuery } from '@tanstack/react-query';

import { fetchNearbyPlaces, fetchAllPlaces } from '@/lib/api/places';
import type { PlaceCategory } from '@/types';

interface MapCenter {
  latitude: number;
  longitude: number;
  zoom: number;
}

// 줌 레벨 → 반경(m) 변환
// 줌 레벨이 높을수록(확대) 반경 작게, 낮을수록(축소) 반경 크게
function zoomToRadius(zoom: number): number {
  // 줌 5 → ~500km, 줌 10 → ~30km, 줌 14 → ~3km, 줌 18 → ~0.2km
  return Math.round(40000000 / Math.pow(2, zoom));
}

export function usePlaces(category?: PlaceCategory | null, center?: MapCenter | null) {
  const radius = center ? zoomToRadius(center.zoom) : 100000;

  return useQuery({
    queryKey: ['places', center?.latitude, center?.longitude, radius, category],
    queryFn: () =>
      center
        ? fetchNearbyPlaces({
            latitude: center.latitude,
            longitude: center.longitude,
            radiusMeters: radius,
            category,
          })
        : fetchAllPlaces(category),
    placeholderData: (prev) => prev,
  });
}
