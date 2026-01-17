import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '../types';

// Store simplificado: Focado APENAS no perfil do usuário
interface UserStore {
  user: User | null;
  setUser: (userData: User) => void;
  clearUser: () => void;
}

// Validação Aumentada: Incluindo os novos campos v5
function isValidUser(obj: unknown): obj is User {
  if (typeof obj !== 'object' || obj === null) return false;
  const user = obj as Record<string, unknown>;
  
  return (
    typeof user.name === 'string' &&
    typeof user.age === 'number' &&
    typeof user.weight === 'number' &&
    typeof user.height === 'number' &&
    (user.gender === 'male' || user.gender === 'female' || user.gender === 'other') &&
    // Validação dos novos campos
    typeof user.activityLevel === 'string' &&
    typeof user.goal === 'string'
  );
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (userData) => set({ user: userData }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: 'fitgame-user',
      storage: createJSONStorage(() => localStorage),
      // Salva apenas o usuário validado. Se falhar, salva null (o que força o registro)
      partialize: (state) => ({
        user: state.user && isValidUser(state.user) ? state.user : null,
      }),
    }
  )
);