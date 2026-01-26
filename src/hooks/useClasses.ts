import { useQuery } from '@tanstack/react-query';
import { classService } from '@/services/api';
import { Class, Student } from '@/types';

export const useClasses = (teacherId?: string) => {
  const classesQuery = useQuery({
    queryKey: ['classes', teacherId],
    queryFn: () => teacherId ? classService.getByTeacher(teacherId) : Promise.resolve([]),
    enabled: !!teacherId,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  const useClassDetails = (classId: string) => {
    return useQuery({
      queryKey: ['class', classId],
      queryFn: () => classService.getById(classId),
      enabled: !!classId,
    });
  };

  const useClassStudents = (classId: string) => {
    return useQuery({
      queryKey: ['class-students', classId],
      queryFn: () => classService.getStudentsInClass(classId),
      enabled: !!classId,
    });
  };

  return {
    classes: classesQuery.data || [],
    isLoading: classesQuery.isLoading,
    error: classesQuery.error,
    useClassDetails,
    useClassStudents,
  };
};