import { useState, useCallback } from 'react';
import { Attendance, AttendanceStatus } from '@/types';
import { attendanceService } from '@/services/api';

/**
 * Hook para gerenciamento de frequência/chamada no sistema ALETHEIA.
 * Fornece funcionalidades para registrar presença, buscar histórico e calcular estatísticas.
 */
export const useAttendance = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Busca a lista de presença de uma aula específica
   */
  const fetchAttendanceByLesson = useCallback(async (lessonId: string): Promise<Attendance[]> => {
    setLoading(true);
    setError(null);
    try {
      const data = await attendanceService.getAttendanceByLesson(lessonId);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao buscar dados de frequência';
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Salva ou atualiza uma lista de registros de presença (chamada em lote)
   */
  const saveAttendanceBatch = useCallback(async (
    lessonId: string, 
    date: string, 
    records: Array<{
      studentId: string;
      status: AttendanceStatus;
      remarks?: string;
    }>
  ): Promise<Attendance[]> => {
    setLoading(true);
    setError(null);
    try {
      const data = await attendanceService.saveAttendanceBatch(lessonId, date, records);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao salvar registros de presença';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Busca estatísticas de frequência de um aluno em uma turma/disciplina específica
   */
  const getStudentAttendanceStats = useCallback(async (studentId: string, classId: string) => {
    setLoading(true);
    setError(null);
    try {
      const stats = await attendanceService.getStudentAttendanceStats(studentId, classId);
      return stats;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao buscar estatísticas do aluno';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Busca o histórico completo de frequência de uma turma para uma disciplina
   */
  const getClassAttendanceHistory = useCallback(async (classId: string, subjectId: string) => {
    setLoading(true);
    setError(null);
    try {
      const history = await attendanceService.getClassAttendanceHistory(classId, subjectId);
      return history;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao buscar histórico da turma';
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Calcula a porcentagem de presença com base nos registros fornecidos
   */
  const calculateAttendancePercentage = useCallback((attendances: Attendance[]): number => {
    if (attendances.length === 0) return 100;
    
    const totalClasses = attendances.length;
    const presences = attendances.filter(a => 
      a.status === 'presente' || a.status === 'atrasado' || a.status === 'justificado'
    ).length;

    return parseFloat(((presences / totalClasses) * 100).toFixed(2));
  }, []);

  return {
    loading,
    error,
    fetchAttendanceByLesson,
    saveAttendanceBatch,
    getStudentAttendanceStats,
    getClassAttendanceHistory,
    calculateAttendancePercentage,
  };
};
