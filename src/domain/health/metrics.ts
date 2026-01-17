// src/domain/health/metrics.ts
import type { ActivityLevel, Goal } from '../../types'; // Importando os tipos atualizados

export interface HealthMetrics {
  bmi: number;
  bmiLabel: string;
  bmr: number;
  tdee: number; // Total Daily Energy Expenditure
  targetCalories: number;
  safeCalories: number;
}

export function calculateBMI(weight: number, heightCm: number): number {
  const heightM = heightCm / 100;
  if (weight <= 0 || heightM <= 0) return 0;
  return parseFloat((weight / (heightM * heightM)).toFixed(1));
}

export function getBMILabel(bmi: number): string {
  if (bmi === 0) return '-';
  if (bmi < 18.5) return 'Abaixo do peso';
  if (bmi < 25) return 'Peso normal';
  if (bmi < 30) return 'Sobrepeso';
  return 'Obesidade';
}

export function calculateBMR(
  age: number,
  weight: number,
  heightCm: number,
  gender: 'male' | 'female' | 'other'
): number {
  if (age <= 0 || weight <= 0 || heightCm <= 0) return 0;

  const maleFormula = 10 * weight + 6.25 * heightCm - 5 * age + 5;
  const femaleFormula = 10 * weight + 6.25 * heightCm - 5 * age - 161;

  if (gender === 'male') return Math.round(maleFormula);
  if (gender === 'female') return Math.round(femaleFormula);
  
  return Math.round((maleFormula + femaleFormula) / 2);
}

export function calculateHealthMetrics(
  age: number,
  weight: number,
  heightCm: number,
  gender: 'male' | 'female' | 'other',
  activityLevel: ActivityLevel, // Agora aceita 'very_active'
  goal: Goal // Agora aceita 'gain_muscle'
): HealthMetrics {
  const bmi = calculateBMI(weight, heightCm);
  const bmiLabel = getBMILabel(bmi);
  const bmr = calculateBMR(age, weight, heightCm, gender);

  // 1. Fator de Atividade
  let activityMultiplier = 1.2;
  if (activityLevel === 'lightly_active') activityMultiplier = 1.375;
  if (activityLevel === 'moderately_active') activityMultiplier = 1.55;
  if (activityLevel === 'very_active') activityMultiplier = 1.725; // NOVO

  const tdee = Math.round(bmr * activityMultiplier);

  // 2. Definição de Meta
  let deficit = 0;
  if (goal === 'loss_moderate') deficit = 500;
  if (goal === 'loss_aggressive') deficit = 700;
  if (goal === 'gain_muscle') deficit = -300; // Superávit (valores negativos aqui somam)
  if (goal === 'maintain') deficit = 0;

  // 3. Cálculo da Meta e Limite Seguro
  const rawTarget = tdee - deficit; 
  const targetCalories = Math.max(1000, Math.round(rawTarget));
  
  // Regra de Ouro: Não comer menos que o TMB
  const safeCalories = Math.max(bmr, targetCalories);

  return {
    bmi,
    bmiLabel,
    bmr,
    tdee,
    targetCalories,
    safeCalories,
  };
}