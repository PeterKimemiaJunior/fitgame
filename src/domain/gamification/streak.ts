import type { V4DailyRecord } from '../../store/useV4Store';

export interface StreakData {
  current: number;
  longest: number;
}

export function calculateStreak(dailyProgress: Record<string, V4DailyRecord>): StreakData {
  const sortedDates = Object.keys(dailyProgress).sort();
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  sortedDates.forEach((date, index) => {
    const record = dailyProgress[date];
    const hasActivity = record.activityDone || record.nutritionDone;

    if (hasActivity) {
      tempStreak++;
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
    } else {
      if (index === 0) {
        // Se o primeiro registro é inativo, streak é 0
        tempStreak = 0;
      } else {
        // Se quebrou a sequência
        tempStreak = 0;
      }
    }
  });

  // Verificar se hoje estende a sequência atual
  const today = new Date().toISOString().split('T')[0];
  const todayRecord = dailyProgress[today];
  if (todayRecord && (todayRecord.activityDone || todayRecord.nutritionDone)) {
    currentStreak = tempStreak + 1;
  } else {
    currentStreak = 0; // Se não fez nada hoje, streak pausa ou zera (simplificação)
  }

  return {
    current: currentStreak,
    longest: longestStreak,
  };
}