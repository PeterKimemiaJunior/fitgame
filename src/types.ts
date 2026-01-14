export interface User {
  name: string;
  age: number;
  weight: number; // em kg
  height: number; // em cm
  gender: 'male' | 'female' | 'other';
}

// Lista de hábitos pré-definidos do MVP
export interface Habit {
  id: string;
  title: string;
  points: number;
  icon: string; // Emoji simples
}

export const HABITS_LIST: Habit[] = [
  { id: 'water', title: 'Bebeu 2L de Água', points: 10, icon: '💧' },
  { id: 'diet', title: 'Seguiu a dieta', points: 20, icon: '🥗' },
  { id: 'exercise', title: 'Caminhou/Exercitou', points: 15, icon: '🏃' },
];

export interface DailyLog {
  date: string; // 'YYYY-MM-DD'
  points: number;
  completedHabits: string[]; // IDs dos hábitos marcados
}