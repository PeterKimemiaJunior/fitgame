import { useUserStore } from '../store/useUserStore';

export function useGameProgress() {
  const logs = useUserStore((state) => state.logs);
  const totalPoints = logs.reduce((acc, curr) => acc + curr.points, 0);

  // 1. Calcular Nível (1 nível a cada 100 pontos)
  const level = Math.floor(totalPoints / 100) + 1;
  const pointsToNextLevel = (level * 100) - totalPoints;

  // 2. Calcular Streak (Dias consecutivos com pelo menos 1 hábito)
  let streak = 0;
  const todayStr = new Date().toISOString().split('T')[0];

  // Método: Filtrar dias únicos com atividade
  const activeDays = logs
    .filter(l => l.completedHabits.length > 0)
    .map(l => l.date)
    .sort();

  if (activeDays.length > 0) {
    streak = 1; // O último dia conta
    for (let i = activeDays.length - 1; i > 0; i--) {
      const current = new Date(activeDays[i]);
      const previous = new Date(activeDays[i - 1]);
      const diffTime = Math.abs(current.getTime() - previous.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        streak++;
      } else {
        break; // Quebrou a sequência
      }
    }
  }

  // Se o último dia de atividade foi ontem e hoje ainda não fiz nada, mantém o streak.
  // Se o último dia foi antes de ontem e hoje não fiz nada, streak continua.
  // Regra visual do MVP: Streak é a maior sequência contínua terminando ontem ou hoje.
  if (activeDays.length > 0) {
    const lastActive = new Date(activeDays[activeDays.length - 1]);
    const today = new Date(todayStr);
    const yesterday = new Date(today); 
    yesterday.setDate(yesterday.getDate() - 1);

    if (lastActive.getTime() !== today.getTime() && lastActive.getTime() !== yesterday.getTime()) {
      streak = 0; // Sequência quebrada
    }
  }

  return {
    level,
    pointsToNextLevel,
    streak,
    totalPoints,
  };
}