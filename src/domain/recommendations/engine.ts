import type { ActivitySuggestion, NutritionSuggestion, DailyRecommendation } from './types';

const ACTIVITIES: ActivitySuggestion[] = [
  {
    id: 'walk_15',
    title: 'Caminhada Rápida (15 min)',
    description: 'Mantenha um ritmo onde consiga conversar, mas não cantar.',
    caloriesBurned: 70,
    reason: 'A saúde cardiovascular melhora com estresse mínimo nas articulações.',
  },
  {
    id: 'stretching',
    title: 'Alongamento Completo (10 min)',
    description: 'Foco em isquiotibiais, costas e pescoço.',
    caloriesBurned: 30,
    reason: 'A flexibilidade reduz o risco de lesões e auxilia na mobilidade diária.',
  },
  {
    id: 'squats',
    title: 'Agachamentos (3x10)',
    description: 'Movimento lento e controlado. Apoie-se se necessário.',
    caloriesBurned: 40,
    reason: 'A força das pernas é fundamental para a função e independência diária.',
  },
  {
    id: 'stairs',
    title: 'Subir Escadas',
    description: 'Evite o elevador em uma viagem para cima ou para baixo.',
    caloriesBurned: 50,
    reason: 'Movimento funcional que constrói resistência da parte inferior do corpo.',
  },
  {
    id: 'yoga_basic',
    title: 'Yoga Básico (20 min)',
    description: 'Sessão simples de respiração e alongamento.',
    caloriesBurned: 60,
    reason: 'Ajuda a reduzir o estresse e melhora a consciência corporal.',
  },
  {
    id: 'arm_raises',
    title: 'Levantamento de Braços (3x12)',
    description: 'Use garrafas de água como peso se preferir.',
    caloriesBurned: 25,
    reason: 'Fortalece os ombros e a parte superior das costas.',
  },
];

const NUTRITION_TIPS: NutritionSuggestion[] = [
  {
    id: 'water_swap',
    title: 'Trocar refrigerante por água',
    description: 'Substitua um refrigerante ou suco por um copo de água.',
    caloriesSaved: 140,
    reason: 'Calorias líquidas são metabolizadas de forma diferente e não fornecem saciedade.',
  },
  {
    id: 'veg_add',
    title: 'Adicionar vegetais no jantar',
    description: 'Aumente a porção de vegetais verdes em um tamanho de punho.',
    caloriesSaved: 50,
    reason: 'A fibra aumenta a saciedade e reduz a densidade calórica da refeição.',
  },
  {
    id: 'plate_control',
    title: 'Reduzir porção de amido',
    description: 'Sirva arroz ou massa 20% menor que o habitual.',
    caloriesSaved: 60,
    reason: 'O manejo de carboidratos é essencial para a estabilidade do açúcar no sangue.',
  },
  {
    id: 'fruit_snack',
    title: 'Fruta inteira ao invés de suco',
    description: 'Coma uma maçã ou laranja em vez de beber o suco.',
    caloriesSaved: 80,
    reason: 'A fibra retarda a absorção de açúcar, evitando picos de insulina.',
  },
  {
    id: 'grill_not_fry',
    title: 'Grelhar em vez de fritar',
    description: 'Prepare a carne ou vegetais na grelha.',
    caloriesSaved: 100,
    reason: 'Reduz drasticamente a ingestão de gorduras trans saturadas nocivas.',
  },
  {
    id: 'coffee_sugar',
    title: 'Café sem açúcar',
    description: 'Tome café preto ou apenas com leite sem açúcar adicionado.',
    caloriesSaved: 40,
    reason: 'A redução de açúcar adicionado melhora a sensibilidade à insulina.',
  },
];

/**
 * Generates a deterministic recommendation for a specific date.
 */
export function generateRecommendation(date: string): DailyRecommendation {
  const dayIndex = Math.floor(
    new Date(date).getTime() / (1000 * 60 * 60 * 24)
  );

  const activityIndex = dayIndex % ACTIVITIES.length;
  const nutritionIndex = (dayIndex + 1) % NUTRITION_TIPS.length;

  return {
    date,
    activity: ACTIVITIES[activityIndex],
    nutrition: NUTRITION_TIPS[nutritionIndex],
  };
}

// Exports for library pages
export const ACTIVITIES_LIBRARY = ACTIVITIES;
export const NUTRITION_LIBRARY = NUTRITION_TIPS;