export interface WeeklyStats {
  avgSteps: number;
  avgCalories: number;
  totalXP: number;
}

export interface TrendData {
  period: string; // e.g., "Last 7 Days"
  value: number;
  change: number; // +10% or -5%
  isPositive: boolean;
}