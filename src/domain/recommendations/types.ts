export interface ActivitySuggestion {
  id: string;
  title: string;
  description: string;
  caloriesBurned: number; // Estimate
  reason: string; // Justification
}

export interface NutritionSuggestion {
  id: string;
  title: string;
  description: string;
  caloriesSaved: number; // Estimate
  reason: string;
}

export interface DailyRecommendation {
  date: string; // YYYY-MM-DD
  activity: ActivitySuggestion;
  nutrition: NutritionSuggestion;
}