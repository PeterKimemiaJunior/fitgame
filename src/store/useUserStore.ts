import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User, DailyLog } from '../types';
import { HABITS_LIST } from '../types';

interface UserStore {
  user: User | null;
  logs: DailyLog[];
  setUser: (userData: User) => void;
  clearUser: () => void;
  toggleHabit: (habitId: string) => void;
}

function isValidUser(obj: unknown): obj is User {
  if (typeof obj !== 'object' || obj === null) return false;
  const user = obj as Record<string, unknown>;
  return (
    typeof user.name === 'string' &&
    typeof user.age === 'number' &&
    typeof user.weight === 'number' &&
    typeof user.height === 'number' &&
    (user.gender === 'male' || user.gender === 'female' || user.gender === 'other')
  );
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      logs: [],
      setUser: (userData) => set({ user: userData }),
      clearUser: () => set({ user: null, logs: [] }),
      
      toggleHabit: (habitId: string) => {
        const today = new Date().toISOString().split('T')[0];
        const state = get();
        
        const currentLog = state.logs.find(log => log.date === today);
        
        let newCompletedHabits: string[] = [];
        
        if (currentLog) {
          // CORREÇÃO AQUI: Se completedHabits for undefined (dados antigos), usa []
          const existingHabits = currentLog.completedHabits || [];
          
          if (existingHabits.includes(habitId)) {
            newCompletedHabits = existingHabits.filter(id => id !== habitId);
          } else {
            newCompletedHabits = [...existingHabits, habitId];
          }
        } else {
          newCompletedHabits = [habitId];
        }

        const newPoints = newCompletedHabits.reduce((acc, hId) => {
          const habit = HABITS_LIST.find(h => h.id === hId);
          return acc + (habit ? habit.points : 0);
        }, 0);

        const otherLogs = state.logs.filter(log => log.date !== today);
        const updatedLog: DailyLog = {
          date: today,
          points: newPoints,
          completedHabits: newCompletedHabits,
        };

        set({ logs: [...otherLogs, updatedLog] });
      },
    }),
    {
      name: 'fitgame-user',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user && isValidUser(state.user) ? state.user : null,
        logs: state.logs,
      }),
    }
  )
);