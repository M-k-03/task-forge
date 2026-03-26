import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { BmiService } from './services/bmi.service';
import { BmiResult } from './models/bmi-result.model';

@Component({
  selector: 'app-bmi-calculator',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HeaderComponent],
  template: `
    <app-header title="BMI Calculator"></app-header>

    <ion-content class="ion-padding">
      <ion-card class="calc-card">
        <ion-card-content>
          <ion-item lines="none" class="input-item">
            <ion-label position="stacked">Height (cm)</ion-label>
            <ion-input type="number" [(ngModel)]="height" placeholder="e.g. 170"></ion-input>
          </ion-item>

          <ion-item lines="none" class="input-item">
            <ion-label position="stacked">Weight (kg)</ion-label>
            <ion-input type="number" [(ngModel)]="weight" placeholder="e.g. 70"></ion-input>
          </ion-item>

          <ion-button expand="block" (click)="calculate()" [disabled]="!height || !weight" class="calc-btn">
            <ion-icon name="calculator-outline" slot="start"></ion-icon>
            Calculate BMI
          </ion-button>
        </ion-card-content>
      </ion-card>

      <!-- Result -->
      <ion-card *ngIf="result" class="result-card" [ngClass]="'cat-' + result.category.toLowerCase()">
        <ion-card-content class="result-content">
          <div class="bmi-value">{{ result.bmi }}</div>
          <div class="bmi-category">{{ result.category }}</div>
          <p class="bmi-details">
            Height: {{ result.height }} cm · Weight: {{ result.weight }} kg
          </p>
        </ion-card-content>
      </ion-card>

      <!-- History -->
      <h3 *ngIf="history.length > 0" class="section-title">
        <ion-icon name="time-outline"></ion-icon> History
      </h3>
      <ion-list lines="none">
        <ion-item *ngFor="let item of history" class="history-item">
          <ion-label>
            <h2>BMI: {{ item.bmi }} — {{ item.category }}</h2>
            <p>{{ item.date | date: 'MMM d, y' }}</p>
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  `,
  styles: [`
    .calc-card, .result-card {
      margin: 0 0 16px 0;
      border-radius: 16px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.08);
      border: none;
    }
    .input-item {
      --background: var(--ion-color-light);
      --border-radius: 12px;
      margin-bottom: 10px;
      border-radius: 12px;
    }
    .calc-btn {
      margin-top: 16px;
      --border-radius: 12px;
      --background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      font-weight: 600;
      height: 48px;
    }
    .result-content { text-align: center; padding: 24px; }
    .bmi-value { font-size: 2.5rem; font-weight: 800; color: var(--ion-color-dark); }
    .bmi-category { font-size: 1.1rem; font-weight: 600; margin-top: 4px; }
    .cat-normal .bmi-category { color: #43e97b; }
    .cat-underweight .bmi-category { color: #4facfe; }
    .cat-overweight .bmi-category { color: #f093fb; }
    .cat-obese .bmi-category { color: #f5576c; }
    .bmi-details { font-size: 0.85rem; color: var(--ion-color-medium); margin-top: 8px; }
    .section-title {
      display: flex; align-items: center; gap: 8px;
      font-size: 1rem; font-weight: 600; padding: 0 4px; margin: 16px 0 12px;
    }
    .section-title ion-icon { color: var(--ion-color-primary); }
    .history-item {
      --background: var(--ion-color-light);
      --border-radius: 12px;
      margin-bottom: 8px;
      border-radius: 12px;
    }
  `],
})
export class BmiCalculatorPage {
  height: number | null = null;
  weight: number | null = null;
  result: BmiResult | null = null;
  history: BmiResult[] = [];

  constructor(private bmiService: BmiService) {}

  ionViewWillEnter(): void {
    this.history = this.bmiService.getHistory();
  }

  calculate(): void {
    if (!this.height || !this.weight) return;
    this.result = this.bmiService.calculate(this.height, this.weight);
    this.history = this.bmiService.getHistory();
  }
}
