import type { DailyLog } from '../types';
import type { AnalysisResult } from './types';
import { calculateConsistency } from './analyzers/consistency';
import { analyzePatterns } from './analyzers/patterns';
import { generateFeedback } from './rules/feedbackEngine';

/**
 * Função Principal de Análise.
 * Recebe logs brutos, processa e retorna inteligência pronta para consumo.
 */
export function getInsights(logs: DailyLog[]): AnalysisResult {
  // 1. Calcula Consistência (7 dias)
  const consistencyScore = calculateConsistency(logs, 7);
  
  // MVP: não comparamos com semana passada para simplificar o armazenamento
  const previousConsistencyScore = null; 

  // 2. Analisa Padrões (Melhor/Pior Hábito)
  const { bestHabit, worstHabit } = analyzePatterns(logs);

  // 3. Gera Feedback via Motor de Regras
  const feedback = generateFeedback({ consistencyScore, bestHabit, worstHabit });

  return {
    consistencyScore,
    previousConsistencyScore,
    bestHabit,
    worstHabit,
    currentStreak: 0, // Já existe no Hook de GameProgress
    feedback,
  };
}