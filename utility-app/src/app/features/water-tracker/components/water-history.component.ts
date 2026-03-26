import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { WaterEntry } from '../models/water-entry.model';
import { AppCurrencyPipe } from '../../../shared/pipes/currency.pipe';

/**
 * Displays the history of water can purchases.
 * Supports swipe-to-delete on each entry.
 */
@Component({
  selector: 'app-water-history',
  standalone: true,
  imports: [IonicModule, CommonModule, AppCurrencyPipe],
  template: `
    <div class="history-section">
      <h3 class="section-title">
        <ion-icon name="time-outline"></ion-icon>
        Purchase History
      </h3>

      <ion-list *ngIf="entries.length > 0; else noEntries" lines="none" class="history-list">
        <ion-item-sliding *ngFor="let entry of entries; trackBy: trackByFn">
          <ion-item class="history-item">
            <ion-icon name="water-outline" slot="start" color="primary" class="entry-icon"></ion-icon>
            <ion-label>
              <h2 class="entry-title">{{ entry.cans }} Can{{ entry.cans > 1 ? 's' : '' }}</h2>
              <p class="entry-date">{{ entry.date | date: 'MMM d, y · h:mm a' }}</p>
              <p *ngIf="entry.note" class="entry-note">{{ entry.note }}</p>
            </ion-label>
            <ion-badge slot="end" color="primary" class="entry-cost">
              {{ entry.totalCost | appCurrency }}
            </ion-badge>
          </ion-item>

          <ion-item-options side="end">
            <ion-item-option color="danger" (click)="onDelete.emit(entry.id)">
              <ion-icon slot="icon-only" name="trash-outline"></ion-icon>
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>

      <ng-template #noEntries>
        <div class="empty-state">
          <ion-icon name="water-outline" class="empty-icon"></ion-icon>
          <p>No purchases yet. Add your first water can!</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [
    `
      .history-section {
        margin-top: 16px;
      }

      .section-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 1rem;
        font-weight: 600;
        color: var(--ion-color-dark);
        padding: 0 4px;
        margin-bottom: 12px;
      }

      .section-title ion-icon {
        font-size: 1.2rem;
        color: var(--ion-color-primary);
      }

      .history-list {
        background: transparent;
      }

      .history-item {
        --background: var(--ion-color-light);
        --border-radius: 12px;
        --padding-start: 12px;
        --padding-end: 12px;
        --inner-padding-end: 8px;
        margin-bottom: 8px;
        border-radius: 12px;
        overflow: hidden;
      }

      .entry-icon {
        font-size: 1.5rem;
        margin-right: 8px;
      }

      .entry-title {
        font-weight: 600;
        font-size: 0.95rem;
        color: var(--ion-color-dark);
      }

      .entry-date {
        font-size: 0.8rem;
        color: var(--ion-color-medium);
        margin-top: 2px;
      }

      .entry-note {
        font-size: 0.8rem;
        font-style: italic;
        color: var(--ion-color-medium-shade);
        margin-top: 2px;
      }

      .entry-cost {
        font-weight: 600;
        --padding-start: 10px;
        --padding-end: 10px;
        --padding-top: 6px;
        --padding-bottom: 6px;
        border-radius: 8px;
      }

      .empty-state {
        text-align: center;
        padding: 40px 20px;
        color: var(--ion-color-medium);
      }

      .empty-icon {
        font-size: 3rem;
        color: var(--ion-color-primary-tint);
        margin-bottom: 12px;
        opacity: 0.5;
      }

      .empty-state p {
        font-size: 0.9rem;
      }
    `,
  ],
})
export class WaterHistoryComponent {
  @Input() entries: WaterEntry[] = [];
  @Output() onDelete = new EventEmitter<string>();

  trackByFn(index: number, entry: WaterEntry): string {
    return entry.id;
  }
}
