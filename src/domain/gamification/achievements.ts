import type { V4DailyRecord } from '../../store/useV4Store';
import { calculateStreak } from './streak';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

/**
 * Verifica conquistas baseadas no histórico.
 */
export function checkAchievements(dailyProgress: Record<string, V4DailyRecord>): Achievement[] {
  const achievements: Achievement[] = [
    {
      id: 'first_week',
      title: 'Iniciante Dedicado',
      description: 'Completou 7 dias de rastreamento.',
      icon: '🌱', // Semente
      unlocked: Object.keys(dailyProgress).length >= 7,
    },
    {
      id: 'consistent_7',
      title: 'Disciplina de Ferro',
      description: 'Manteve consistência por uma semana.',
      icon: '🛡', // Escudo
      unlocked: calculateStreak(dailyProgress).current >= 7,
    },
    {
      id: 'fire_streak',
      title: 'Em Chamas',
      description: 'Alcançou uma sequência de 3 dias.',
      icon: '🔥', // Fogo
      unlocked: calculateStreak(dailyProgress).current >= 3,
    },
  ];

  return achievements;
}