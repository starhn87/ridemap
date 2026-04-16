import { supabase } from '@/lib/supabase';

export async function fetchFavorites(): Promise<string[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('favorites')
    .select('place_id')
    .eq('user_id', user.id);

  if (error) throw error;

  return (data ?? []).map((row) => row.place_id);
}

export async function toggleFavorite(placeId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('로그인이 필요합니다.');

  const { data: existing } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', user.id)
    .eq('place_id', placeId)
    .single();

  if (existing) {
    await supabase.from('favorites').delete().eq('id', existing.id);
    return false;
  } else {
    await supabase.from('favorites').insert({
      user_id: user.id,
      place_id: placeId,
    });
    return true;
  }
}
