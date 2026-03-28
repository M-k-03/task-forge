import { Component, Input, Output, EventEmitter } from '@angular/core';
import { 
  IonSegment, 
  IonSegmentButton, 
  IonIcon, 
  IonLabel 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { calendarOutline, todayOutline } from 'ionicons/icons';
import { CommonModule } from '@angular/common';
import { UsageType } from '../models/water-entry.model';

/**
 * Segmented control to switch between Weekly and Monthly usage views.
 */
@Component({
  selector: 'app-usage-toggle',
  standalone: true,
  imports: [IonSegment, IonSegmentButton, IonIcon, IonLabel, CommonModule],
  template: `
    <div class="toggle-wrapper">
      <ion-segment
        [value]="selectedType"
        (ionChange)="onToggle($event)"
        mode="ios"
        class="usage-segment"
      >
        <ion-segment-button value="weekly">
          <ion-icon name="calendar-outline"></ion-icon>
          <ion-label>Weekly</ion-label>
        </ion-segment-button>
        <ion-segment-button value="monthly">
          <ion-icon name="today-outline"></ion-icon>
          <ion-label>Monthly</ion-label>
        </ion-segment-button>
      </ion-segment>
    </div>
  `,
  styles: [
    `
      .toggle-wrapper {
        margin-bottom: 16px;
      }

      .usage-segment {
        --background: rgba(var(--ion-color-primary-rgb), 0.08);
        border-radius: 14px;
        padding: 3px;
      }

      ion-segment-button {
        --border-radius: 11px;
        --indicator-color: var(--ion-color-primary);
        --color: var(--ion-color-medium);
        --color-checked: #fff;
        --indicator-box-shadow: 0 2px 8px rgba(var(--ion-color-primary-rgb), 0.35);
        min-height: 44px;
        font-weight: 600;
        font-size: 0.85rem;
        text-transform: none;
        letter-spacing: 0;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      ion-segment-button::part(native) {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 6px;
      }

      ion-segment-button ion-icon {
        font-size: 1.1rem;
        margin: 0;
      }

      ion-segment-button ion-label {
        font-weight: 700;
        font-size: 0.85rem;
        margin: 0;
      }
    `,
  ],
})
export class UsageToggleComponent {
  @Input() selectedType: UsageType = 'weekly';
  @Output() typeChange = new EventEmitter<UsageType>();

  constructor() {
    addIcons({ 
      'calendar-outline': calendarOutline, 
      'today-outline': todayOutline 
    });
  }

  onToggle(event: any): void {
    const value = event.detail.value as UsageType;
    if (value && value !== this.selectedType) {
      this.typeChange.emit(value);
    }
  }
}
