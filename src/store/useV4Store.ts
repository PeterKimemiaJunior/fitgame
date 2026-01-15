import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface V4State {
  dailyProgress: Record<string, { activityDone: boolean; nutritionDone: boolean }>;
  toggleActivity: (date: string) => void;
  toggleNutrition: (date: string) => void;
  resetProgress: () => void;
  resetAllData: () => void; // NOVO: Factory reset
}

export const useV4Store = create<V4State>()(
  persist(
    (set) => ({
      dailyProgress: {},
      
      toggleActivity: (date) => {
        set((state) => {
          const current = state.dailyProgress[date] || { activityDone: false, nutritionDone: false };
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
          const current = state.dailyProgress[date] || { activityDone: false, nutritionDone: false };
          return {
            dailyProgress: {
              ...state.dailyProgress,
              [date]: { ...current, nutritionDone: !current.nutritionDone },
            },
          };
        });
      },

      resetProgress: () => set({ dailyProgress: {} }),

      // NOVO: Função para limpar dados do v4 e apontar para limpeza do v3
      // Nota: Vamos usar isso no Profile para limpar o localStorage inteiro.
      resetAllData: () => {
        set({ dailyProgress: {} });
        // Limpa também o localStorage do v3 se existir
        localStorage.removeItem('fitgame-user');
        localStorage.removeItem('fitgame-v4-progress');
        // Recarrega a página para resetar o estado
        window.location.reload();
      },
    }),
    {
      name: 'fitgame-v4-progress',
      storage: createJSONStorage(() => localStorage),
    }
  )
);