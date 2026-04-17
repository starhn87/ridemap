import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Place } from '@/types';

async function fetchPlaceById(id: string): Promise<Place | null> {
  const { data, error } = await supabase.rpc('all_places', {
    category_filter: null,
  });

  if (error) return null;

  const row = (data ?? []).find((r: any) => r.id === id);
  if (!row) return null;

  return {
    id: row.id,
    name: row.name,
    description: row.description ?? '',
    category: row.category,
    latitude: row.latitude,
    longitude: row.longitude,
    address: row.address,
    phone: row.phone,
    photos: row.photos ?? [],
    rating: Number(row.rating) || 0,
    reviewCount: row.review_count ?? 0,
    tags: row.tags ?? [],
    openingHours: row.opening_hours,
    parkingInfo: row.parking_info,
    submittedBy: row.submitted_by,
    approved: row.approved,
    createdAt: row.created_at,
  };
}

export function usePlace(id: string | null) {
  return useQuery({
    queryKey: ['place', id],
    queryFn: () => fetchPlaceById(id!),
    enabled: !!id,
  });
}
