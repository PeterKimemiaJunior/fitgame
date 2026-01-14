import { useUserStore } from '../store/useUserStore';

export function useTotalPoints() {
  const logs = useUserStore((state) => state.logs);
  
  // Cálculo puro e simples
  const totalPoints = logs.reduce((acc, curr) => acc + curr.points, 0);

  return totalPoints;
}