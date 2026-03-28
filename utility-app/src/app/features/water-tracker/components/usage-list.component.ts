import { Component, Input } from '@angular/core';
import { 
  IonCard, 
  IonCardContent, 
  IonIcon 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  calendarOutline, 
  todayOutline, 
  waterOutline, 
  analyticsOutline 
} from 'ionicons/icons';
import { CommonModule } from '@angular/common';
import { AppCurrencyPipe } from '../../../shared/pipes/currency.pipe';
import { UsageSummary, UsageType } from '../models/water-entry.model';

/**
 * Displays a list of usage summaries (weekly or monthly).
 * Animates in smoothly when data changes.
 */
@Component({
  selector: 'app-usage-list',
  standalone: true,
  imports: [IonCard, IonCardContent, IonIcon, CommonModule, AppCurrencyPipe],
  template: `
    <div class="usage-list" *ngIf="summaries.length > 0; else noData">
      <ion-card
        *ngFor="let item of summaries; let i = index; trackBy: trackByFn"
        class="usage-card"
        [style.animation-delay]="(i * 50) + 'ms'"
      >
        <ion-card-content class="usage-content">
          <div class="usage-left">
            <div class="usage-icon" [ngClass]="usageType === 'weekly' ? 'icon-weekly' : 'icon-monthly'">
              <ion-icon [name]="usageType === 'weekly' ? 'calendar-outline' : 'today-outline'"></ion-icon>
            </div>
            <div class="usage-info">
              <div class="usage-label">{{ item.label }}</div>
              <div class="usage-entries">{{ item.entryCount }} purchase{{ item.entryCount !== 1 ? 's' : '' }}</div>
            </div>
          </div>
          <div class="usage-right">
            <span class="usage-cans">
              <ion-icon name="water-outline"></ion-icon>
              {{ item.totalCans }}
            </span>
            <span class="usage-spent">{{ item.totalSpent | appCurrency }}</span>
          </div>
        </ion-card-content>
      </ion-card>
    </div>

    <ng-template #noData>
      <div class="empty-usage">
        <ion-icon name="analytics-outline" class="empty-icon"></ion-icon>
        <p>No {{ usageType }} data yet.</p>
        <p class="empty-hint">Add purchases to see your usage breakdown.</p>
      </div>
    </ng-template>
  `,
  styles: [
    `
      @keyframes slideInUp {
        from {
          opacity: 0;
          transform: translateY(12px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .usage-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .usage-card {
        margin: 0;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        border: none;
        animation: slideInUp 0.35s ease forwards;
        opacity: 0;
      }

      .usage-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 14px 16px;
      }

      .usage-left {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .usage-icon {
        width: 38px;
        height: 38px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .usage-icon ion-icon {
        font-size: 1.1rem;
        color: #fff;
      }

      .icon-weekly {
        background: linear-gradient(135deg, #667eea, #764ba2);
      }

      .icon-monthly {
        background: linear-gradient(135deg, #f093fb, #f5576c);
      }

      .usage-label {
        font-weight: 600;
        font-size: 0.9rem;
        color: var(--ion-color-dark);
      }

      .usage-entries {
        font-size: 0.75rem;
        color: var(--ion-color-medium);
        margin-top: 2px;
      }

      .usage-right {
        display: flex;
        align-items: center;
        gap: 14px;
      }

      .usage-cans {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 0.85rem;
        color: var(--ion-color-primary);
        font-weight: 500;
      }

      .usage-cans ion-icon {
        font-size: 1rem;
      }

      .usage-spent {
        font-weight: 700;
        font-size: 0.9rem;
        color: var(--ion-color-success-shade);
        white-space: nowrap;
      }

      .empty-usage {
        text-align: center;
        padding: 32px 20px;
        color: var(--ion-color-medium);
      }

      .empty-icon {
        font-size: 2.5rem;
        color: var(--ion-color-primary-tint);
        margin-bottom: 12px;
        opacity: 0.5;
      }

      .empty-usage p {
        font-size: 0.9rem;
        margin: 0;
      }

      .empty-hint {
        font-size: 0.8rem !important;
        margin-top: 4px !important;
        opacity: 0.7;
      }
    `,
  ],
})
export class UsageListComponent {
  @Input() summaries: UsageSummary[] = [];
  @Input() usageType: UsageType = 'weekly';

  constructor() {
    addIcons({ 
      'calendar-outline': calendarOutline, 
      'today-outline': todayOutline, 
      'water-outline': waterOutline, 
      'analytics-outline': analyticsOutline 
    });
  }

  trackByFn(index: number, item: UsageSummary): string {
    return item.label;
  }
}
