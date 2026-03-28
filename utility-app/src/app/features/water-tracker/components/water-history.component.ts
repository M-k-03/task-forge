import { Component, Input, Output, EventEmitter } from '@angular/core';
import { 
  IonIcon, 
  IonBadge 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  timeOutline, 
  chatbubbleOutline, 
  waterOutline 
} from 'ionicons/icons';
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
  imports: [IonIcon, IonBadge, CommonModule, AppCurrencyPipe],
  template: `
    <div class="history-section">
      <h3 class="section-title">
        <ion-icon name="time-outline"></ion-icon>
        Purchase History
      </h3>

      <div *ngIf="entries.length > 0; else noEntries" class="history-list">
        <div *ngFor="let entry of entries; trackBy: trackByFn" class="history-card">
          <div class="card-left">
            <div class="icon-circle">
              <img src="assets/water_can_icon.png" class="card-img" alt="Can"/>
            </div>
          </div>
          
          <div class="card-center">
            <h2 class="card-title">{{ entry.cans }} Can{{ entry.cans > 1 ? 's' : '' }}</h2>
            <p class="card-date">{{ entry.date | date: 'MMM d, y · h:mm a' }}</p>
            <div *ngIf="entry.note" class="comment-pill">
              <ion-icon name="chatbubble-outline"></ion-icon>
              <span>{{ entry.note }}</span>
            </div>
          </div>

          <div class="card-right">
            <ion-badge color="primary" class="cost-badge">
              {{ entry.totalCost | appCurrency }}
            </ion-badge>
            <div class="delete-badge" (click)="onDeleteClicked($event, entry.id)">
              <img src="assets/trash_custom.png" class="delete-img" alt="X"/>
            </div>
          </div>
        </div>
      </div>

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
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .history-card {
        display: flex;
        align-items: center;
        background: var(--ion-color-light);
        padding: 12px;
        border-radius: 16px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        cursor: pointer;
        transition: transform 0.2s, background 0.2s;
        
        &:active {
          transform: scale(0.98);
          background: var(--ion-color-light-shade);
        }
      }

      .card-left {
        margin-right: 12px;
      }

      .icon-circle {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: white;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
      }

      .card-img {
        width: 32px;
        height: 32px;
        object-fit: contain;
      }

      .card-center {
        flex: 1;
        overflow: hidden;
      }

      .card-title {
        margin: 0;
        font-size: 1rem;
        font-weight: 700;
        color: var(--ion-color-dark);
      }

      .card-date {
        margin: 2px 0 0 0;
        font-size: 0.8rem;
        color: var(--ion-color-medium);
      }

      .comment-pill {
        display: flex;
        align-items: center;
        gap: 6px;
        background: rgba(var(--ion-color-medium-rgb), 0.08);
        padding: 4px 10px;
        border-radius: 20px;
        margin-top: 6px;
        width: fit-content;
        font-size: 0.75rem;
        font-weight: 500;
        color: var(--ion-color-medium-shade);

        ion-icon {
          font-size: 0.85rem;
        }
      }

      .card-right {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-left: 8px;
      }

      .cost-badge {
        font-weight: 700;
        --padding-start: 10px;
        --padding-end: 10px;
        --padding-top: 6px;
        --padding-bottom: 6px;
        border-radius: 10px;
        font-size: 0.85rem;
      }

      .delete-badge {
        width: 34px;
        height: 34px;
        border-radius: 50%;
        background: var(--ion-color-danger);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 8px rgba(var(--ion-color-danger-rgb), 0.3);
        font-size: 1.1rem;
        cursor: pointer;
        transition: transform 0.2s;
        
        &:active {
          transform: scale(0.9);
        }
      }

      .delete-img {
        width: 18px;
        height: 18px;
        object-fit: contain;
        filter: brightness(0) invert(1);
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

  constructor() {
    addIcons({ 
      'time-outline': timeOutline, 
      'chatbubble-outline': chatbubbleOutline, 
      'water-outline': waterOutline 
    });
  }

  onDeleteClicked(event: Event, id: string): void {
    event.stopPropagation();
    this.onDelete.emit(id);
  }

  trackByFn(index: number, entry: WaterEntry): string {
    return entry.id;
  }
}
