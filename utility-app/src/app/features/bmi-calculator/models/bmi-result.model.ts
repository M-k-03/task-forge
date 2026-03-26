export interface BmiResult {
  id: string;
  height: number;       // in cm
  weight: number;       // in kg
  bmi: number;
  category: BmiCategory;
  date: string;
}

export type BmiCategory = 'Underweight' | 'Normal' | 'Overweight' | 'Obese';
