import { Injectable } from '@angular/core';
import { StorageService } from '../../../core/services/storage.service';
import { STORAGE_KEYS } from '../../../core/constants/app.constants';
import { BmiResult, BmiCategory } from '../models/bmi-result.model';

@Injectable({ providedIn: 'root' })
export class BmiService {
  constructor(private storage: StorageService) {}

  /**
   * Calculate BMI from height (cm) and weight (kg).
   */
  calculate(heightCm: number, weightKg: number): BmiResult {
    const heightM = heightCm / 100;
    const bmi = parseFloat((weightKg / (heightM * heightM)).toFixed(1));
    const category = this.getCategory(bmi);

    const result: BmiResult = {
      id: Date.now().toString(36) + Math.random().toString(36).substring(2),
      height: heightCm,
      weight: weightKg,
      bmi,
      category,
      date: new Date().toISOString(),
    };

    // Save to history
    const history = this.getHistory();
    history.unshift(result);
    this.storage.set(STORAGE_KEYS.BMI_HISTORY, history);

    return result;
  }

  getHistory(): BmiResult[] {
    return this.storage.get<BmiResult[]>(STORAGE_KEYS.BMI_HISTORY) || [];
  }

  clearHistory(): void {
    this.storage.remove(STORAGE_KEYS.BMI_HISTORY);
  }

  private getCategory(bmi: number): BmiCategory {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  }
}
