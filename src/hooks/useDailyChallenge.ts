import { useUserStore } from "../store/useUserStore";

// Lista de desafios (poderia vir de um arquivo de dados, mas aqui fica isolado)
const CHALLENGES = [
  { id: 1, title: "Beber 3L de água hoje", points: 25, icon: "💧" },
  { id: 2, title: "Caminhar 20 min a mais", points: 30, icon: "🚶" },
  { id: 3, title: "Comer 1 fruta no lanche", points: 20, icon: "🍎" },
  { id: 4, title: "Fazer 10 agachamentos", points: 15, icon: "🏋️" },
  { id: 5, title: "Dormir antes das 23h", points: 20, icon: "😴" },
];

export function useDailyChallenge() {
  const logs = useUserStore((state) => state.logs);
  const toggleChallenge = useUserStore((state) => state.toggleChallenge);

  const todayStr = new Date().toISOString().split("T")[0];
  const todayLog = logs.find((l) => l.date === todayStr);

  // Lógica determinística para o dia do ano
  const dayOfYear = Math.floor(
    (new Date().getTime() -
      new Date(new Date().getFullYear(), 0, 0).getTime()) /
      1000 /
      60 /
      60 /
      24
  );
  const challenge = CHALLENGES[dayOfYear % CHALLENGES.length];

  const isCompleted = todayLog?.completedChallenge || false;

  return {
    challenge,
    isCompleted,
    toggleChallenge,
  };
}
