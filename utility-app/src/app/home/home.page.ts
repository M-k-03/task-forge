import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from '../core/models/menu-item.model';

/**
 * Home page — dashboard with navigation cards for each feature.
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  menuItems: MenuItem[] = [
    {
      title: 'Water Tracker',
      description: 'Track water cans purchased weekly',
      icon: 'water',
      route: '/water-tracker',
      color: '#667eea',
    },
    {
      title: 'BMI Calculator',
      description: 'Calculate your Body Mass Index',
      icon: 'body',
      route: '/bmi-calculator',
      color: '#f093fb',
    },
    {
      title: 'Expense Tracker',
      description: 'Track your daily expenses',
      icon: 'wallet',
      route: '/expense-tracker',
      color: '#4facfe',
    },
    {
      title: 'Notes',
      description: 'Quick notes & storage',
      icon: 'document-text',
      route: '/notes',
      color: '#43e97b',
    },
    {
      title: 'Gym Tracker',
      description: 'Weekly workout progress (Mon-Sat)',
      icon: 'barbell',
      route: '/gym-tracker',
      color: '#f9ca24',
    },
  ];
}
