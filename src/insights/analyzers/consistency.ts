import type { DailyLog } from '../../types';

/**
 * Calcula a consistência baseada nos últimos N dias.
 * Assume 3 hábitos fixos por dia (base do MVP).
 */
export function calculateConsistency(logs: DailyLog[], daysToAnalyze: number = 7): number {
  if (daysToAnalyze <= 0) return 0;

  let totalPossibleHabits = 0;
  let totalCompletedHabits = 0;
  const HABITS_PER_DAY = 3; // Água, Dieta, Exercício

  // Itera nos últimos N dias (incluindo hoje)
  for (let i = 0; i < daysToAnalyze; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateKey = d.toISOString().split('T')[0];

    const log = logs.find(l => l.date === dateKey);

    if (log) {
      totalCompletedHabits += log.completedHabits.length;
      totalPossibleHabits += HABITS_PER_DAY;
    } else {
      totalPossibleHabits += HABITS_PER_DAY; // Dias sem log contam como 0 concluídos
    }
  }

  return totalPossibleHabits > 0 ? Math.round((totalCompletedHabits / totalPossibleHabits) * 100) : 0;
}