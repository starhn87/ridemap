import { useQuery } from '@tanstack/react-query';

import { fetchNearbyPlaces, fetchAllPlaces } from '@/lib/api/places';
import { useMapStore } from '@/stores/useMapStore';
import type { PlaceCategory } from '@/types';

export function useNearbyPlaces(category?: PlaceCategory | null) {
  const userLocation = useMapStore((s) => s.userLocation);

  return useQuery({
    queryKey: ['places', 'nearby', userLocation, category],
    queryFn: () =>
      fetchNearbyPlaces({
        latitude: userLocation!.latitude,
        longitude: userLocation!.longitude,
        radiusMeters: 10000,
        category,
      }),
    enabled: !!userLocation,
  });
}

export function useAllPlaces() {
  return useQuery({
    queryKey: ['places', 'all'],
    queryFn: fetchAllPlaces,
  });
}
