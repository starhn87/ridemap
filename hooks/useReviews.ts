import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { fetchReviews, createReview } from '@/lib/api/reviews';

export function useReviews(placeId: string | null) {
  return useQuery({
    queryKey: ['reviews', placeId],
    queryFn: () => fetchReviews(placeId!),
    enabled: !!placeId,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReview,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.placeId] });
      queryClient.invalidateQueries({ queryKey: ['places'] });
    },
  });
}
