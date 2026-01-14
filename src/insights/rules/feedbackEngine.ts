import type { AnalysisResult } from '../types';
import type { InsightFeedback } from '../types';
import type { TrendData } from '../../history/history.types';

/**
 * Motor de Feedback Adaptativo V2 (Data-Driven).
 */
export function generateFeedback(data: Pick<AnalysisResult, 'consistencyScore' | 'bestHabit' | 'worstHabit'> & { trend?: TrendData }): InsightFeedback | null {
  const { consistencyScore, bestHabit, worstHabit, trend } = data;

  // Prioridade Alta: Tendência Positiva Forte
  if (trend && trend.change > 20 && trend.isPositive) {
    return {
      type: 'positive',
      title: 'Foco Máximo! 🚀',
      message: `Seu desempenho aumentou ${trend.change}% na última semana. Continue assim!`,
    };
  }

  // Prioridade Alta: Tendência Negativa Forte
  if (trend && trend.change < -20 && !trend.isPositive) {
    return {
      type: 'warning',
      title: 'Atenção',
      message: `Sua performance caiu ${Math.abs(trend.change)}% recentemente. Não desista.`,
    };
  }

  // Regra: Crise de consistência
  if (consistencyScore < 40) {
    return {
      type: 'warning',
      title: 'Vamos recomeçar!',
      message: 'Sua consistência caiu nos últimos dias. Foque em completar apenas 1 hábito simples hoje.',
    };
  }

  // Regra: Consistência sólida
  if (consistencyScore >= 80) {
    return {
      type: 'positive',
      title: 'Em chamas! 🔥',
      message: `Você é incrível! Sua consistência acima de 80% mostra comprometimento real.`,
    };
  }

  // Regra: Feedback Específico (Hábito negligenciado)
  if (worstHabit && worstHabit.successRate < 30) {
    return {
      type: 'info',
      title: 'Dica do Dia',
      message: `O hábito "${worstHabit.title}" tem sido difícil. Que tal fazer logo pela manhã amanhã?`,
    };
  }

  // Regra: Padrão positivo (Leverage) -> USA bestHabit
  if (bestHabit && bestHabit.successRate === 100 && consistencyScore < 100) {
    return {
      type: 'info',
      title: 'Sua Superpotência',
      message: `Você domina o "${bestHabit.title}". Use essa disciplina para ajudar nos outros hábitos!`,
    };
  }

  return null;
}