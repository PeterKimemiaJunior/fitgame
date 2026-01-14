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
  toggleChallenge: () => void;
  updateDailyStats: (date: string, steps: number, calories: number) => void; // NOVO
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
        
        // Preservar steps/calories existentes ao atualizar hábitos
        const currentStats = currentLog || { steps: 0, calories: 0, completedChallenge: false };
        const challengePoints = currentStats.completedChallenge ? getTodaysChallenge().points : 0;

        const updatedLog: DailyLog = {
          date: today,
          points: newPoints + challengePoints,
          completedHabits: newCompletedHabits,
          completedChallenge: currentStats.completedChallenge,
          steps: currentStats.steps || 0,
          calories: currentStats.calories || 0,
        };

        set({ logs: [...otherLogs, updatedLog] });
      },

      toggleChallenge: () => {
        const today = new Date().toISOString().split('T')[0];
        const state = get();
        const currentLog = state.logs.find(log => log.date === today);
        
        const isCompleted = currentLog?.completedChallenge ? false : true;
        const challengeData = getTodaysChallenge();
        const challengePoints = isCompleted ? challengeData.points : 0;

        const existingHabits = currentLog?.completedHabits || [];
        const habitsPoints = existingHabits.reduce((acc, hId) => {
          const habit = HABITS_LIST.find(h => h.id === hId);
          return acc + (habit ? habit.points : 0);
        }, 0);

        const totalPoints = habitsPoints + challengePoints;

        const otherLogs = state.logs.filter(log => log.date !== today);
        
        const currentStats = currentLog || { steps: 0, calories: 0, completedHabits: [] };
        
        const updatedLog: DailyLog = {
          date: today,
          points: totalPoints,
          completedHabits: existingHabits,
          completedChallenge: isCompleted,
          steps: currentStats.steps || 0,
          calories: currentStats.calories || 0,
        };

        set({ logs: [...otherLogs, updatedLog] });
      },

      // NOVA AÇÃO: Atualizar Stats do Dia
      updateDailyStats: (date: string, steps: number, calories: number) => {
        const state = get();
        const logs = [...state.logs];
        const index = logs.findIndex(l => l.date === date);

        if (index !== -1) {
          // Atualiza log existente
          logs[index] = { ...logs[index], steps, calories };
        } else {
          // Cria novo log (apenas stats)
          logs.push({
            date,
            points: 0,
            completedHabits: [],
            completedChallenge: false,
            steps,
            calories,
          });
        }

        set({ logs });
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

function getTodaysChallenge() {
  const CHALLENGES = [
    { id: 1, title: 'Beber 3L de água hoje', points: 25, icon: '💧' },
    { id: 2, title: 'Caminhar 20 min a mais', points: 30, icon: '🚶' },
    { id: 3, title: 'Comer 1 fruta no lanche', points: 20, icon: '🍎' },
    { id: 4, title: 'Fazer 10 agachamentos', points: 15, icon: '🏋️' },
    { id: 5, title: 'Dormir antes das 23h', points: 20, icon: '😴' },
  ];
  
  const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
  const index = dayOfYear % CHALLENGES.length;
  return CHALLENGES[index];
}