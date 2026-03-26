import { Injectable } from '@angular/core';
import { StorageService } from '../../../core/services/storage.service';
import { STORAGE_KEYS } from '../../../core/constants/app.constants';
import { Expense } from '../models/expense.model';

@Injectable({ providedIn: 'root' })
export class ExpenseService {
  constructor(private storage: StorageService) {}

  getAll(): Expense[] {
    const items = this.storage.get<Expense[]>(STORAGE_KEYS.EXPENSES) || [];
    return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  add(title: string, amount: number, category?: string): Expense {
    const expense: Expense = {
      id: Date.now().toString(36) + Math.random().toString(36).substring(2),
      title,
      amount,
      category,
      date: new Date().toISOString(),
    };
    const expenses = this.getAll();
    expenses.push(expense);
    this.storage.set(STORAGE_KEYS.EXPENSES, expenses);
    return expense;
  }

  delete(id: string): void {
    const expenses = this.getAll().filter((e) => e.id !== id);
    this.storage.set(STORAGE_KEYS.EXPENSES, expenses);
  }

  getTotal(): number {
    return this.getAll().reduce((sum, e) => sum + e.amount, 0);
  }
}
