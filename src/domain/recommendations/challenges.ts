export interface Challenge {
  id: string;
  title: string;
  icon: string;
  reason: string;
}

const CHALLENGES: Challenge[] = [
  {
    id: 'water',
    title: 'Beber 2L de água',
    icon: '💧',
    reason: 'A hidratação é essencial para a função cognitiva e controle da fome.',
  },
  {
    id: 'no_phone',
    title: 'Jantar sem celular',
    icon: '📵',
    reason: 'Comer sem distrações melhora a saciedade e a digestão.',
  },
  {
    id: 'stretching',
    title: 'Alongar antes de dormir',
    icon: '🧘',
    reason: 'Melhora a qualidade do sono e relaxa os músculos.',
  },
  {
    id: 'breathing',
    title: 'Exercícios de respiração',
    icon: '🌬️',
    reason: 'Reduz o estresse rapidamente e oxigena o cérebro.',
  },
];

/**
 * Retorna o desafio do dia (determinístico).
 */
export function generateDailyChallenge(date: string): Challenge {
  const dayIndex = Math.floor(
    new Date(date).getTime() / (1000 * 60 * 60 * 24)
  );
  return CHALLENGES[dayIndex % CHALLENGES.length];
}