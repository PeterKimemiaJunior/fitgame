export type InsightType = 'positive' | 'warning' | 'info';

export interface InsightFeedback {
  type: InsightType;
  title: string;
  message: string;
}

export interface HabitPerformance {
  id: string;
  title: string;
  completedCount: number; // Últimos 7 dias
  successRate: number;    // 0-100
}

export interface AnalysisResult {
  consistencyScore: number; // 0-100
  previousConsistencyScore: number | null; // Para comparar
  bestHabit: HabitPerformance | null;
  worstHabit: HabitPerformance | null;
  currentStreak: number;
  feedback: InsightFeedback | null;
}