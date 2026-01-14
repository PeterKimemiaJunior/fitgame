import { useUserStore } from '../store/useUserStore';
import { calculateBMI, calculateBMR, calculateDailyCalories } from '../utils/calculations';

export function useUserMetrics() {
  const user = useUserStore((state) => state.user);

  if (!user) {
    return {
      bmi: 0,
      bmr: 0,
      calories: 0,
      bmiLabel: '-',
    };
  }

  const bmi = calculateBMI(user.weight, user.height);
  const bmr = calculateBMR(user.age, user.weight, user.height, user.gender);
  const calories = calculateDailyCalories(bmr);
  
  // Regra de classificação encapsulada
  const bmiLabel = bmi < 18.5 ? 'Abaixo' : bmi < 25 ? 'Normal' : 'Sobrepeso';

  return {
    bmi,
    bmr,
    calories,
    bmiLabel,
  };
}