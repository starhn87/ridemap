import { supabase } from '@/lib/supabase';

export type FeedbackType = 'bug' | 'feature' | 'general';

export async function submitFeedback(params: {
  type: FeedbackType;
  content: string;
}): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('로그인이 필요합니다.');

  const { error } = await supabase.from('feedback').insert({
    user_id: user.id,
    type: params.type,
    content: params.content,
  });

  if (error) throw error;
}
