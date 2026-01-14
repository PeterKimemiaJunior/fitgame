import type { DailyLog } from '../types';
import type { WeeklyStats, TrendData } from '../history/history.types';

/**
 * Calcula médias móveis (7 dias).
 */
export function calculateWeeklyStats(logs: DailyLog[]): WeeklyStats {
  // Filtra logs dos últimos 7 dias (simulados ou reais)
  // Para MVP v3, usamos os logs disponíveis ordenados por data.
  const recentLogs = logs.slice(-7);

  if (recentLogs.length === 0) {
    return { avgSteps: 0, avgCalories: 0, totalXP: 0 };
  }

  const totalSteps = recentLogs.reduce((acc, log) => acc + (log.steps || 0), 0);
  const totalCalories = recentLogs.reduce((acc, log) => acc + (log.calories || 0), 0);
  const totalXP = recentLogs.reduce((acc, log) => acc + log.points, 0);

  return {
    avgSteps: Math.round(totalSteps / recentLogs.length),
    avgCalories: Math.round(totalCalories / recentLogs.length),
    totalXP: totalXP,
  };
}

/**
 * Calcula a tendência comparando período atual com anterior.
 */
export function calculateTrend(currentLogs: DailyLog[], previousLogs: DailyLog[]): TrendData {
  const currentXP = currentLogs.reduce((acc, log) => acc + log.points, 0);
  const previousXP = previousLogs.reduce((acc, log) => acc + log.points, 0);

  if (previousXP === 0) {
    return { period: 'Current Week', value: currentXP, change: 0, isPositive: true };
  }

  const changePercent = ((currentXP - previousXP) / previousXP) * 100;

  return {
    period: 'Last 7 Days',
    value: currentXP,
    change: Math.round(changePercent),
    isPositive: changePercent >= 0,
  };
}

/**
 * Prepara dados para o gráfico de Passos.
 */
export function prepareChartData(logs: DailyLog[], key: 'steps' | 'calories' | 'points', days: number = 7) {
  const lastLogs = logs.slice(-days);
  
  // Se tivermos menos logs que 'days', preenchemos com zeros atrás
  // Para simplificar MVP: usamos os dados brutos existentes
  return {
    labels: lastLogs.map(l => new Date(l.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })),
    data: lastLogs.map(l => l[key] || 0),
  };
}