import { Grade } from '@/types';
import { GRADE_CONFIG, CONCEPT_MAPPING } from '@/constants';

/**
 * Calcula a média anual baseada nos 4 bimestres
 */
export function calculateAnnualAverage(grade: Partial<Grade>): number | null {
  const quarters = [
    grade.quarter1,
    grade.quarter2,
    grade.quarter3,
    grade.quarter4
  ].filter((q): q is number => q !== null && q !== undefined);

  if (quarters.length === 0) return null;

  const sum = quarters.reduce((acc, curr) => acc + curr, 0);
  const average = sum / quarters.length;

  return parseFloat(average.toFixed(2));
}

/**
 * Converte um conceito qualitativo para nota numérica (Educação Infantil)
 */
export function convertConceptToGrade(concept: keyof typeof CONCEPT_MAPPING): number {
  return CONCEPT_MAPPING[concept].value;
}

/**
 * Valida se o aluno foi aprovado com base na média
 */
export function isStudentApproved(average: number | null): boolean {
  if (average === null) return false;
  return average >= GRADE_CONFIG.MIN_PASSING_GRADE;
}

/**
 * Formata a nota para exibição (ex: 7.50)
 */
export function formatGrade(grade: number | null | undefined): string {
  if (grade === null || grade === undefined) return '-';
  return grade.toLocaleString('pt-BR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  });
}

/**
 * Valida a entrada de nota para garantir que está entre 0 e 10
 */
export function validateGradeInput(value: string | number): number | null {
  const numValue = typeof value === 'string' ? parseFloat(value.replace(',', '.')) : value;

  if (isNaN(numValue)) return null;

  if (numValue < GRADE_CONFIG.MIN_GRADE) return GRADE_CONFIG.MIN_GRADE;
  if (numValue > GRADE_CONFIG.MAX_GRADE) return GRADE_CONFIG.MAX_GRADE;

  return parseFloat(numValue.toFixed(2));
}