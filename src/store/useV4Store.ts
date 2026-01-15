import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface V4DailyRecord {
  activityDone: boolean;
  nutritionDone: boolean;
  waterIntake: number; // ml
  weightLogged: number | null; // kg
}

interface V4State {
  dailyProgress: Record<string, V4DailyRecord>;
  toggleActivity: (date: string) => void;
  toggleNutrition: (date: string) => void;
  addWater: (date: string) => void;
  logWeight: (date: string, weight: number) => void;
  resetProgress: () => void;
  resetAllData: () => void;
}

export const useV4Store = create<V4State>()(
  persist(
    (set) => ({
      dailyProgress: {},
      
      toggleActivity: (date) => {
        set((state) => {
          const current = state.dailyProgress[date] || { activityDone: false, nutritionDone: false, waterIntake: 0, weightLogged: null };
          return {
            dailyProgress: {
              ...state.dailyProgress,
              [date]: { ...current, activityDone: !current.activityDone },
            },
          };
        });
      },

      toggleNutrition: (date) => {
        set((state) => {
          const current = state.dailyProgress[date] || { activityDone: false, nutritionDone: false, waterIntake: 0, weightLogged: null };
          return {
            dailyProgress: {
              ...state.dailyProgress,
              [date]: { ...current, nutritionDone: !current.nutritionDone },
            },
          };
        });
      },

      // NOVO: Adiciona 250ml de água
      addWater: (date) => {
        set((state) => {
          const current = state.dailyProgress[date] || { activityDone: false, nutritionDone: false, waterIntake: 0, weightLogged: null };
          return {
            dailyProgress: {
              ...state.dailyProgress,
              [date]: { ...current, waterIntake: current.waterIntake + 250 },
            },
          };
        });
      },

      // NOVO: Registra peso (sobrescreve se já existir)
      logWeight: (date, weight) => {
        set((state) => {
          const current = state.dailyProgress[date] || { activityDone: false, nutritionDone: false, waterIntake: 0, weightLogged: null };
          return {
            dailyProgress: {
              ...state.dailyProgress,
              [date]: { ...current, weightLogged: weight },
            },
          };
        });
      },

      resetProgress: () => set({ dailyProgress: {} }),
      
      resetAllData: () => {
        set({ dailyProgress: {} });
        localStorage.removeItem('fitgame-user');
        localStorage.removeItem('fitgame-v4-progress');
        window.location.reload();
      },
    }),
    {
      name: 'fitgame-v4-progress',
      storage: createJSONStorage(() => localStorage),
    }
  )
);