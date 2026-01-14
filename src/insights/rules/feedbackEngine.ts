import type { AnalysisResult } from '../types';
import type { InsightFeedback } from '../types';

/**
 * Motor de Feedback Adaptativo.
 * NOTA: Esta função substitui a IA no MVP.
 * No futuro, a assinatura pode ser mantida, mas a implementação chamará uma API.
 */
export function generateFeedback(data: Pick<AnalysisResult, 'consistencyScore' | 'bestHabit' | 'worstHabit'>): InsightFeedback | null {
  const { consistencyScore, bestHabit, worstHabit } = data;

  // Regra 1: Crise de consistência (Prioridade Alta)
  if (consistencyScore < 40) {
    return {
      type: 'warning',
      title: 'Vamos recomeçar!',
      message: 'Sua consistência caiu nos últimos dias. Não se preocupe, foque em completar apenas 1 hábito simples hoje.',
    };
  }

  // Regra 2: Consistência sólida
  if (consistencyScore >= 80) {
    return {
      type: 'positive',
      title: 'Em chamas! 🔥',
      message: `Você é incrível! Sua consistência acima de 80% mostra que você criou o hábito.`,
    };
  }

  // Regra 3: Feedback Específico (Hábito negligenciado)
  if (worstHabit && worstHabit.successRate < 30) {
    return {
      type: 'info',
      title: 'Dica do Dia',
      message: `O hábito "${worstHabit.title}" tem sido difícil. Que tal fazer logo pela manhã amanhã?`,
    };
  }

  // Regra 4: Padrão positivo (Leverage)
  if (bestHabit && bestHabit.successRate === 100 && consistencyScore < 100) {
    return {
      type: 'info',
      title: 'Sua Superpotência',
      message: `Você domina o "${bestHabit.title}". Use essa disciplina para ajudar nos outros hábitos!`,
    };
  }

  return null;
}