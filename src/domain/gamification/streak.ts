import type { V4DailyRecord } from '../../store/useV4Store';

export interface StreakData {
  current: number;
  longest: number;
}

/**
 * Verifica se date2 é o dia imediatamente posterior a date1
 */
function isConsecutive(date1Str: string, date2Str: string): boolean {
  const d1 = new Date(date1Str);
  d1.setHours(0, 0, 0, 0);
  const d2 = new Date(date2Str);
  d2.setHours(0, 0, 0, 0);
  
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  return diffDays === 1;
}

export function calculateStreak(dailyProgress: Record<string, V4DailyRecord>): StreakData {
  const dates = Object.keys(dailyProgress).sort();
  let longestStreak = 0;
  let currentStreak = 0;

  // --- CÁLCULO DA MAIOR SEQUÊNCIA HISTÓRICA ---
  let tempStreak = 0;
  
  for (let i = 0; i < dates.length; i++) {
    const date = dates[i];
    const record = dailyProgress[date];
    const hasActivity = record.activityDone || record.nutritionDone;

    if (hasActivity) {
      // Se é o primeiro registro OU se a data anterior é contígua (dia anterior)
      if (i === 0 || isConsecutive(dates[i-1], date)) {
        tempStreak++;
      } else {
        // Houve quebra de data (dia 01 -> dia 03), reseta a contagem
        tempStreak = 1; 
      }
      
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
    } else {
      // Dia sem atividade, reseta
      tempStreak = 0;
    }
  }

  // --- CÁLCULO DA SEQUÊNCIA ATUAL (De hoje para trás) ---
  // Isso garante que se o usuário quebrou a sequência ontem, o current seja 0.
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Checamos dia a dia subtraindo 1 (hoje, ontem, anteontem...)
  const checkDate = new Date();
  
  for (let i = 0; i < 365; i++) { // Limite de 1 ano para loop infinito
    const dateKey = checkDate.toISOString().split('T')[0];
    const record = dailyProgress[dateKey];
    
    if (record && (record.activityDone || record.nutritionDone)) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1); // Vai para o dia anterior
    } else {
      // Achou um dia vazio ou sem atividade -> Fim da sequência atual
      break;
    }
  }

  return {
    current: currentStreak,
    longest: longestStreak,
  };
}