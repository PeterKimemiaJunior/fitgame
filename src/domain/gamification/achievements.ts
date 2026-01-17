import type { V4DailyRecord } from '../../store/useV4Store';
import { calculateStreak } from './streak';

// Union type para garantir que só existam ícones suportados
export type AchievementIcon = 'seed' | 'shield' | 'fire';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconKey: AchievementIcon; // Mudado de string para tipo seguro
  unlocked: boolean;
}

/**
 * Verifica conquistas baseadas no histórico.
 */
export function checkAchievements(dailyProgress: Record<string, V4DailyRecord>): Achievement[] {
  
  // Helper para contar dias ATIVOS (não apenas dias com dados salvos)
  const activeDaysCount = Object.values(dailyProgress).filter(day => 
    day.activityDone || day.nutritionDone
  ).length;

  const streak = calculateStreak(dailyProgress);

  const achievements: Achievement[] = [
    {
      id: 'first_week',
      title: 'Iniciante Dedicado',
      description: 'Completou 7 dias de rastreamento ativo.',
      iconKey: 'seed', // Semente (Início)
      unlocked: activeDaysCount >= 7,
    },
    {
      id: 'consistent_7',
      title: 'Disciplina de Ferro',
      description: 'Manteve consistência por uma semana.',
      iconKey: 'shield', // Escudo (Proteção/Disciplina)
      unlocked: streak.current >= 7,
    },
    {
      id: 'fire_streak',
      title: 'Em Chamas',
      description: 'Alcançou uma sequência de 3 dias.',
      iconKey: 'fire', // Fogo (Streak)
      unlocked: streak.current >= 3,
    },
  ];

  return achievements;
}