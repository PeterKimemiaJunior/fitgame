export interface HealthMetrics {
  bmi: number;
  bmiLabel: string;
  bmr: number;
  dailyCalories: number;
}

/**
 * Calcula o Índice de Massa Corporal (IMC).
 */
export function calculateBMI(weight: number, heightCm: number): number {
  const heightM = heightCm / 100;
  if (weight <= 0 || heightM <= 0) return 0;
  return parseFloat((weight / (heightM * heightM)).toFixed(1));
}

/**
 * Retorna a classificação do IMC.
 */
export function getBMILabel(bmi: number): string {
  if (bmi === 0) return '-';
  if (bmi < 18.5) return 'Abaixo do peso';
  if (bmi < 25) return 'Peso normal';
  if (bmi < 30) return 'Sobrepeso';
  return 'Obesidade';
}

/**
 * Calcula a Taxa Metabólica Basal (TMB) - Equação de Mifflin-St Jeor.
 */
export function calculateBMR(
  age: number,
  weight: number,
  heightCm: number,
  gender: 'male' | 'female' | 'other'
): number {
  if (age <= 0 || weight <= 0 || heightCm <= 0) return 0;

  // Fórmula Masculina
  const maleFormula = 10 * weight + 6.25 * heightCm - 5 * age + 5;
  // Fórmula Feminina
  const femaleFormula = 10 * weight + 6.25 * heightCm - 5 * age - 161;

  if (gender === 'male') return Math.round(maleFormula);
  if (gender === 'female') return Math.round(femaleFormula);
  
  // Média neutra para 'other'
  return Math.round((maleFormula + femaleFormula) / 2);
}

/**
 * Calcula as calorias diárias recomendadas.
 * Fator de atividade sedentário leve (1.375).
 */
export function calculateDailyCalories(bmr: number): number {
  if (bmr <= 0) return 0;
  return Math.round(bmr * 1.375);
}

/**
 * Orquestrador principal.
 */
export function calculateHealthMetrics(
  age: number,
  weight: number,
  heightCm: number,
  gender: 'male' | 'female' | 'other'
): HealthMetrics {
  const bmi = calculateBMI(weight, heightCm);
  const bmiLabel = getBMILabel(bmi);
  const bmr = calculateBMR(age, weight, heightCm, gender);
  const dailyCalories = calculateDailyCalories(bmr);

  return {
    bmi,
    bmiLabel,
    bmr,
    dailyCalories,
  };
}