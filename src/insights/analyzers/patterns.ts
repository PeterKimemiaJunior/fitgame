import type { DailyLog } from '../../types';
import type { HabitPerformance } from '../types';
import { HABITS_LIST } from '../../types';

/**
 * Analisa os padrões dos últimos 7 logs disponíveis.
 */
export function analyzePatterns(logs: DailyLog[]): { bestHabit: HabitPerformance | null; worstHabit: HabitPerformance | null } {
  // Pega os últimos 7 logs únicos ou menos
  const recentLogs = logs.slice(-7);
  
  // Inicializar mapa de performance
  const performanceMap = new Map<string, HabitPerformance>();

  HABITS_LIST.forEach(habit => {
    performanceMap.set(habit.id, {
      id: habit.id,
      title: habit.title,
      completedCount: 0,
      successRate: 0,
    });
  });

  const totalDaysAnalyzed = recentLogs.length;

  recentLogs.forEach(log => {
    log.completedHabits.forEach(hId => {
      const habitPerf = performanceMap.get(hId);
      if (habitPerf) habitPerf.completedCount++;
    });
  });

  // Calcular taxas de sucesso
  const performances = Array.from(performanceMap.values()).map(p => ({
    ...p,
    successRate: totalDaysAnalyzed > 0 ? Math.round((p.completedCount / totalDaysAnalyzed) * 100) : 0,
  }));

  // Ordenar: do melhor para o pior
  performances.sort((a, b) => b.successRate - a.successRate);

  const best = performances.length > 0 && performances[0].successRate > 0 ? performances[0] : null;
  const worst = performances.length > 0 && performances[performances.length - 1].successRate < 100 ? performances[performances.length - 1] : null;

  return { bestHabit: best, worstHabit: worst };
}