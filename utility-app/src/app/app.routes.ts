import { Routes } from '@angular/router';

/**
 * Application routes with lazy-loaded feature modules.
 * Each feature is loaded on demand for optimal performance.
 */
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'water-tracker',
    loadComponent: () =>
      import('./features/water-tracker/water-tracker.page').then(
        (m) => m.WaterTrackerPage
      ),
  },
  {
    path: 'bmi-calculator',
    loadComponent: () =>
      import('./features/bmi-calculator/bmi-calculator.page').then(
        (m) => m.BmiCalculatorPage
      ),
  },
  {
    path: 'expense-tracker',
    loadComponent: () =>
      import('./features/expense-tracker/expense-tracker.page').then(
        (m) => m.ExpenseTrackerPage
      ),
  },
  {
    path: 'notes',
    loadComponent: () =>
      import('./features/notes/notes.page').then((m) => m.NotesPage),
  },
  {
    path: 'gym-tracker',
    loadComponent: () =>
      import('./features/gym-tracker/gym-tracker.page').then(
        (m) => m.GymTrackerPage
      ),
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
