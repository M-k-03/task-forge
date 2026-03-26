import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { AppCurrencyPipe } from '../../shared/pipes/currency.pipe';
import { ExpenseService } from './services/expense.service';
import { Expense } from './models/expense.model';

@Component({
  selector: 'app-expense-tracker',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HeaderComponent, AppCurrencyPipe],
  template: `
    <app-header title="Expense Tracker"></app-header>

    <ion-content class="ion-padding">
      <!-- Total -->
      <ion-card class="total-card">
        <ion-card-content class="total-content">
          <div class="total-label">Total Expenses</div>
          <div class="total-value">{{ total | appCurrency }}</div>
        </ion-card-content>
      </ion-card>

      <!-- Add Form -->
      <ion-card class="form-card">
        <ion-card-header>
          <ion-card-title class="form-title">
            <ion-icon name="add-circle-outline"></ion-icon> Add Expense
          </ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-item lines="none" class="input-item">
            <ion-label position="stacked">Title</ion-label>
            <ion-input type="text" [(ngModel)]="newTitle" placeholder="e.g. Coffee"></ion-input>
          </ion-item>

          <ion-item lines="none" class="input-item">
            <ion-label position="stacked">Amount (₹)</ion-label>
            <ion-input type="number" [(ngModel)]="newAmount" placeholder="e.g. 150"></ion-input>
          </ion-item>

          <ion-button expand="block" (click)="addExpense()" [disabled]="!newTitle || !newAmount" class="add-btn">
            <ion-icon name="add-outline" slot="start"></ion-icon>
            Add Expense
          </ion-button>
        </ion-card-content>
      </ion-card>

      <!-- Expense List -->
      <ion-list *ngIf="expenses.length > 0" lines="none">
        <ion-item-sliding *ngFor="let exp of expenses">
          <ion-item class="expense-item">
            <ion-icon name="receipt-outline" slot="start" color="primary"></ion-icon>
            <ion-label>
              <h2>{{ exp.title }}</h2>
              <p>{{ exp.date | date: 'MMM d, y · h:mm a' }}</p>
            </ion-label>
            <ion-badge slot="end" color="warning">{{ exp.amount | appCurrency }}</ion-badge>
          </ion-item>
          <ion-item-options side="end">
            <ion-item-option color="danger" (click)="deleteExpense(exp.id)">
              <ion-icon slot="icon-only" name="trash-outline"></ion-icon>
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>
    </ion-content>
  `,
  styles: [`
    .total-card, .form-card {
      margin: 0 0 16px 0; border-radius: 16px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.08); border: none;
    }
    .total-content { text-align: center; padding: 24px; }
    .total-label { font-size: 0.85rem; color: var(--ion-color-medium); text-transform: uppercase; letter-spacing: 0.5px; }
    .total-value { font-size: 2rem; font-weight: 800; color: var(--ion-color-dark); margin-top: 4px; }
    .form-title { display: flex; align-items: center; gap: 8px; font-size: 1rem; font-weight: 600; }
    .form-title ion-icon { font-size: 1.3rem; color: var(--ion-color-primary); }
    .input-item {
      --background: var(--ion-color-light); --border-radius: 12px;
      margin-bottom: 10px; border-radius: 12px;
    }
    .add-btn {
      margin-top: 16px; --border-radius: 12px;
      --background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      font-weight: 600; height: 48px;
    }
    .expense-item {
      --background: var(--ion-color-light); --border-radius: 12px;
      margin-bottom: 8px; border-radius: 12px; overflow: hidden;
    }
  `],
})
export class ExpenseTrackerPage {
  expenses: Expense[] = [];
  total: number = 0;
  newTitle: string = '';
  newAmount: number | null = null;

  constructor(private expenseService: ExpenseService) {}

  ionViewWillEnter(): void {
    this.loadData();
  }

  addExpense(): void {
    if (!this.newTitle || !this.newAmount) return;
    this.expenseService.add(this.newTitle.trim(), this.newAmount);
    this.newTitle = '';
    this.newAmount = null;
    this.loadData();
  }

  deleteExpense(id: string): void {
    this.expenseService.delete(id);
    this.loadData();
  }

  private loadData(): void {
    this.expenses = this.expenseService.getAll();
    this.total = this.expenseService.getTotal();
  }
}
