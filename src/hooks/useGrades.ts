import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gradeService } from '@/services/api';
import { Grade } from '@/types';
import { calculateAnnualAverage, isStudentApproved } from '@/utils/gradeUtils';
import { toast } from '@/components/ui/use-toast';

export const useGrades = (classId?: string, subjectId?: string) => {
  const queryClient = useQueryClient();

  const gradesQuery = useQuery({
    queryKey: ['grades', classId, subjectId],
    queryFn: () => (classId && subjectId) 
      ? gradeService.getByClassAndSubject(classId, subjectId) 
      : Promise.resolve([]),
    enabled: !!classId && !!subjectId,
  });

  const updateGradeMutation = useMutation({
    mutationFn: async (payload: { id: string; updates: Partial<Grade> }) => {
      const updatedData = { ...payload.updates };
      
      // Auto-calculate average if any quarter changes
      if ('quarter1' in payload.updates || 'quarter2' in payload.updates || 'quarter3' in payload.updates || 'quarter4' in payload.updates) {
        const currentGrades = gradesQuery.data?.find(g => g.id === payload.id);
        if (currentGrades) {
          const merged = { ...currentGrades, ...payload.updates };
          const average = calculateAnnualAverage(merged);
          updatedData.finalAverage = average;
          updatedData.status = isStudentApproved(average) ? 'aprovado' : (average !== null ? 'reprovado' : 'cursando');
        }
      }

      return gradeService.updateGrade(payload.id, updatedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grades', classId, subjectId] });
      toast({ title: "Sucesso", description: "Nota atualizada com sucesso." });
    },
    onError: () => {
      toast({ variant: "destructive", title: "Erro", description: "Não foi possível atualizar a nota." });
    }
  });

  return {
    grades: gradesQuery.data || [],
    isLoading: gradesQuery.isLoading,
    updateGrade: updateGradeMutation.mutate,
    isUpdating: updateGradeMutation.isPending,
  };
};