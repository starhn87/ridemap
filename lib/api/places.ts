import { supabase } from '@/lib/supabase';
import type { Place, PlaceCategory } from '@/types';

interface NearbyParams {
  latitude: number;
  longitude: number;
  radiusMeters?: number;
  category?: PlaceCategory | null;
}

interface SubmitPlaceParams {
  name: string;
  description: string;
  category: PlaceCategory;
  latitude: number;
  longitude: number;
  address: string;
  phone?: string;
  tags?: string[];
  openingHours?: string;
  parkingInfo?: string;
}

function rowToPlace(row: any): Place {
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

export async function fetchNearbyPlaces({
  latitude,
  longitude,
  radiusMeters = 5000,
  category,
}: NearbyParams): Promise<Place[]> {
  const { data, error } = await supabase.rpc('nearby_places', {
    lat: latitude,
    lng: longitude,
    radius_meters: radiusMeters,
    category_filter: category ?? null,
  });

  if (error) throw error;

  return (data ?? []).map(rowToPlace);
}

export async function fetchAllPlaces(
  category?: PlaceCategory | null
): Promise<Place[]> {
  const { data, error } = await supabase.rpc('all_places', {
    category_filter: category ?? null,
  });

  if (error) throw error;

  return (data ?? []).map(rowToPlace);
}

export async function submitPlace(params: SubmitPlaceParams): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('로그인이 필요합니다.');

  const { error } = await supabase.from('places').insert({
    name: params.name,
    description: params.description,
    category: params.category,
    location: `POINT(${params.longitude} ${params.latitude})`,
    address: params.address,
    phone: params.phone,
    tags: params.tags ?? [],
    opening_hours: params.openingHours,
    parking_info: params.parkingInfo,
    submitted_by: user.id,
  });

  if (error) throw error;
}
