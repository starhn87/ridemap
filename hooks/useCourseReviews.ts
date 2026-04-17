import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  fetchCourseReviews,
  createCourseReview,
  updateCourseReview,
  deleteCourseReview,
} from '@/lib/api/courseReviews';

function invalidateCourseData(queryClient: ReturnType<typeof useQueryClient>, courseId: string) {
  queryClient.invalidateQueries({ queryKey: ['course-reviews', courseId] });
  // 트리거가 DB를 갱신하는 시간을 위해 약간의 딜레이 후 코스 데이터 refetch
  setTimeout(() => {
    queryClient.invalidateQueries({ queryKey: ['courses'] });
    queryClient.invalidateQueries({ queryKey: ['courses', 'detail', courseId] });
  }, 500);
}

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
      invalidateCourseData(queryClient, variables.courseId);
    },
  });
}

export function useUpdateCourseReview(courseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCourseReview,
    onSuccess: () => {
      invalidateCourseData(queryClient, courseId);
    },
  });
}

export function useDeleteCourseReview(courseId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCourseReview,
    onSuccess: () => {
      invalidateCourseData(queryClient, courseId);
    },
  });
}
