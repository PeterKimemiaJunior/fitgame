export interface WeeklySummary {
  daysActivityCompleted: number;
  daysNutritionCompleted: number;
  totalDays: number;
  adherenceRate: number; // 0-100
}

/**
 * Calculates simple adherence metrics for the last 7 days.
 */
export function calculateWeeklySummary(
  progress: Record<string, { activityDone: boolean; nutritionDone: boolean }>
): WeeklySummary {
  // Generate last 7 days keys
  const days: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }

  let daysActivityCompleted = 0;
  let daysNutritionCompleted = 0;
  let daysWithAnyData = 0;

  days.forEach((date) => {
    const dayData = progress[date];
    if (dayData) {
      daysWithAnyData++;
      if (dayData.activityDone) daysActivityCompleted++;
      if (dayData.nutritionDone) daysNutritionCompleted++;
    }
  });

  // Adherence: Based on days we have data for (to not penalize for simply starting)
  const adherenceRate = daysWithAnyData > 0 
    ? Math.round(((daysActivityCompleted + daysNutritionCompleted) / (daysWithAnyData * 2)) * 100) 
    : 0;

  return {
    daysActivityCompleted,
    daysNutritionCompleted,
    totalDays: daysWithAnyData,
    adherenceRate,
  };
}