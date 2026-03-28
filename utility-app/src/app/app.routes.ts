import { Routes } from '@angular/router';

/**
 * Application routes with lazy-loaded feature modules.
 * Only the Water Tracker is included as per the streamlined project focus.
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
