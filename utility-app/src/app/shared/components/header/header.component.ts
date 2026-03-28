import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonHeader, 
  IonToolbar, 
  IonButtons, 
  IonBackButton, 
  IonTitle 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBack } from 'ionicons/icons';

/**
 * Reusable page header with back button support.
 *
 * Usage:
 * <app-header title="Page Title" [showBack]="true"></app-header>
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start" *ngIf="showBack">
          <ion-back-button defaultHref="/home" text="" icon="arrow-back"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ title }}</ion-title>
      </ion-toolbar>
    </ion-header>
  `,
  styles: [
    `
      ion-toolbar {
        --background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        --color: #ffffff;
      }

      ion-title {
        font-weight: 600;
        font-size: 1.1rem;
        letter-spacing: 0.3px;
      }
    `,
  ],
})
export class HeaderComponent {
  @Input() title: string = '';
  @Input() showBack: boolean = true;

  constructor() {
    addIcons({ 'arrow-back': arrowBack });
  }
}
