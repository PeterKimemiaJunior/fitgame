import { useUserStore } from '../store/useUserStore';
import type { DailyLog } from '../types';

export function useTodayLog() {
  const logs = useUserStore((state) => state.logs);
  const toggleHabit = useUserStore((state) => state.toggleHabit);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayLog = logs.find((log: DailyLog) => log.date === todayStr);
  
  const completedIds = todayLog?.completedHabits || [];

  return {
    completedIds,
    toggleHabit,
    todayLog,
  };
}