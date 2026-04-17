import { supabase } from '@/lib/supabase';
import type { RidingCourse } from '@/types';

function rowToCourse(row: any): RidingCourse {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? '',
    distance: Number(row.distance),
    duration: row.duration,
    difficulty: row.difficulty,
    coordinates: row.coordinates ?? [],
    waypoints: [],
    createdBy: row.created_by,
    rating: Number(row.rating) || 0,
    reviewCount: row.review_count ?? 0,
    createdAt: row.created_at,
  };
}

export async function fetchCourses(
  difficulty?: string | null
): Promise<RidingCourse[]> {
  let query = supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false });

  if (difficulty) {
    query = query.eq('difficulty', difficulty);
  }

  const { data, error } = await query;

  if (error) throw error;

  return (data ?? []).map(rowToCourse);
}

export async function fetchCourseById(id: string): Promise<RidingCourse> {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;

  return rowToCourse(data);
}
