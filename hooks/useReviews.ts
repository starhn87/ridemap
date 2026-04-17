import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { fetchReviews, createReview, updateReview, deleteReview } from '@/lib/api/reviews';

function invalidatePlaceData(queryClient: ReturnType<typeof useQueryClient>, placeId: string) {
  queryClient.invalidateQueries({ queryKey: ['reviews', placeId] });
  setTimeout(() => {
    queryClient.invalidateQueries({ queryKey: ['places'] });
    queryClient.invalidateQueries({ queryKey: ['place', placeId] });
  }, 500);
}

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
      invalidatePlaceData(queryClient, variables.placeId);
    },
  });
}

export function useUpdateReview(placeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateReview,
    onSuccess: () => {
      invalidatePlaceData(queryClient, placeId);
    },
  });
}

export function useDeleteReview(placeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      invalidatePlaceData(queryClient, placeId);
    },
  });
}
