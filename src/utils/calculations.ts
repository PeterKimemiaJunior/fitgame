// IMC (Índice de Massa Corporal)
export function calculateBMI(weight: number, heightCm: number): number {
  if (!weight || !heightCm) return 0;
  const heightM = heightCm / 100;
  // Peso / (Altura em metros * Altura em metros)
  return parseFloat((weight / (heightM * heightM)).toFixed(1));
}

// TMB (Taxa Metabólica Basal) - Equação de Mifflin-St Jeor
export function calculateBMR(
  age: number,
  weight: number,
  heightCm: number,
  gender: 'male' | 'female' | 'other'
): number {
  // Fórmula Masculina
  const maleFormula = 10 * weight + 6.25 * heightCm - 5 * age + 5;
  // Fórmula Feminina
  const femaleFormula = 10 * weight + 6.25 * heightCm - 5 * age - 161;

  if (gender === 'male') return Math.round(maleFormula);
  if (gender === 'female') return Math.round(femaleFormula);
  
  // Para 'other', usamos a média para ser neutro
  return Math.round((maleFormula + femaleFormula) / 2);
}

// Calorias Diárias (Considerando fator 1.375 para sedentário)
export function calculateDailyCalories(bmr: number): number {
  return Math.round(bmr * 1.375);
}