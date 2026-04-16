import { useQuery } from '@tanstack/react-query';

import { fetchNearbyPlaces, fetchAllPlaces } from '@/lib/api/places';
import { useMapStore } from '@/stores/useMapStore';
import type { PlaceCategory } from '@/types';

export function usePlaces(category?: PlaceCategory | null) {
  const userLocation = useMapStore((s) => s.userLocation);

  return useQuery({
    queryKey: ['places', userLocation ? 'nearby' : 'all', userLocation, category],
    queryFn: () =>
      userLocation
        ? fetchNearbyPlaces({
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            radiusMeters: 50000,
            category,
          })
        : fetchAllPlaces(category),
  });
}
