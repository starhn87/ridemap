import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { fetchCourseReviews, createCourseReview } from '@/lib/api/courseReviews';

export function useCourseReviews(courseId: string | null) {
  return useQuery({
    queryKey: ['course-reviews', courseId],
    queryFn: () => fetchCourseReviews(courseId!),
    enabled: !!courseId,
  });
}

export function useCreateCourseReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCourseReview,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['course-reviews', variables.courseId] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
}
