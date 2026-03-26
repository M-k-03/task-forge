import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

/**
 * Reusable page header with back button support.
 *
 * Usage:
 * <app-header title="Page Title" [showBack]="true"></app-header>
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [IonicModule, CommonModule],
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
}
