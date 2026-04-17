import { useQuery } from '@tanstack/react-query';

import { fetchCourses, fetchCourseById } from '@/lib/api/courses';

export function useCourses(difficulty?: string | null) {
  return useQuery({
    queryKey: ['courses', difficulty],
    queryFn: () => fetchCourses(difficulty),
  });
}

export function useCourse(id: string | null) {
  return useQuery({
    queryKey: ['courses', 'detail', id],
    queryFn: () => fetchCourseById(id!),
    enabled: !!id,
  });
}
