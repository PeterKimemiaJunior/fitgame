// src/store/useV4Store.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { HealthMetrics } from '../domain/health/metrics'; // Importando tipo de métricas

export interface V4DailyRecord {
  activityDone: boolean;
  nutritionDone: boolean;
  waterIntake: number; 
  weightLogged: number | null; 
}

interface V4State {
  // Progresso Diário (Existente)
  dailyProgress: Record<string, V4DailyRecord>;
  
  // NOVO: Métricas de Perfil Calculadas (TMB, TDEE)
  profileMetrics: HealthMetrics | null;

  // Ações Diárias
  toggleActivity: (date: string) => void;
  toggleNutrition: (date: string) => void;
  addWater: (date: string) => void;
  logWeight: (date: string, weight: number) => void;
  
  // Ações de Perfil
  setProfileMetrics: (metrics: HealthMetrics) => void;

  resetProgress: () => void;
  resetAllData: () => void;
}

export const useV4Store = create<V4State>()(
  persist(
    (set) => ({
      dailyProgress: {},
      profileMetrics: null, // Estado inicial
      
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

      // NOVO: Setter para métricas calculadas
      setProfileMetrics: (metrics) => set({ profileMetrics: metrics }),

      resetProgress: () => set({ dailyProgress: {} }),
      
      resetAllData: () => {
        set({ dailyProgress: {}, profileMetrics: null });
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