import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonCard, 
  IonCardContent, 
  IonIcon 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { apps, arrowForwardOutline, water, fitness } from 'ionicons/icons';
import { MenuItem } from '../core/models/menu-item.model';

/**
 * Home page — dashboard with navigation cards for each feature.
 * Optimized for the Water Tracker and Gym Tracker.
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonCard, 
    IonCardContent, 
    IonIcon
  ],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  menuItems: MenuItem[] = [
    {
      title: 'Water Tracker',
      description: 'Track hydration and costs',
      icon: 'water',
      route: '/water-tracker',
      color: '#0061A4',
      backgroundImage: 'assets/water_card_bg.png',
      iconImage: 'assets/water_can_icon.png',
    },
    {
      title: 'Gym Tracker',
      description: '6-day PPL Split tracking',
      icon: 'fitness',
      route: '/gym-tracker',
      color: '#764ba2',
      backgroundImage: 'assets/gym_card_bg.png',
      iconImage: 'assets/gym_icon.png',
    },
  ];

  constructor() {
    addIcons({ 
      'apps': apps, 
      'arrow-forward-outline': arrowForwardOutline, 
      'water': water, 
      'fitness': fitness 
    });
  }
}
