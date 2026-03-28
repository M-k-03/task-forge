import { Component, OnInit, inject, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonCard, 
  IonCardHeader, 
  IonCardTitle, 
  IonCardContent, 
  IonIcon, 
  IonItem, 
  IonLabel, 
  IonInput, 
  IonButton, 
  IonBadge,
  AlertController,
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  water, 
  analyticsOutline, 
  addCircleOutline, 
  addOutline, 
  timeOutline, 
  chatbubbleOutline,
  waterOutline,
  removeCircleOutline
} from 'ionicons/icons';
import { Observable } from 'rxjs';

import { AppCurrencyPipe } from '../../shared/pipes/currency.pipe';
import { WaterHistoryComponent } from './components/water-history.component';
import { UsageToggleComponent } from './components/usage-toggle.component';
import { UsageListComponent } from './components/usage-list.component';
import { WaterTrackerService } from './services/water-tracker.service';
import { WaterEntry, UsageSummary, UsageType } from './models/water-entry.model';
import { DEFAULT_WATER_CAN_PRICE } from '../../core/constants/app.constants';

/**
 * Water Can Tracker — main page component.
 */
@Component({
  selector: 'app-water-tracker',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonIcon,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonBadge,
    AppCurrencyPipe,
    WaterHistoryComponent,
    UsageToggleComponent,
    UsageListComponent,
  ],
  templateUrl: './water-tracker.page.html',
  styleUrls: ['./water-tracker.page.scss'],
})
export class WaterTrackerPage implements OnInit {
  private waterService = inject(WaterTrackerService);
  private alertCtrl = inject(AlertController);
  private toastCtrl = inject(ToastController);
  private zone = inject(NgZone);

  // Form fields
  newCans: number = 1;
  newPrice: number = DEFAULT_WATER_CAN_PRICE;
  newNote: string = '';

  // Data
  entries$: Observable<WaterEntry[]> = this.waterService.entries$;
  totalCans: number = 0;
  totalSpent: number = 0;
  heroLiters: number = 0;

  // UI State
  isFormVisible: boolean = true;
  usageType: UsageType = 'weekly';
  usageSummaries: UsageSummary[] = [];

  constructor() {
    addIcons({ 
      water, 
      'analytics-outline': analyticsOutline, 
      'add-circle-outline': addCircleOutline, 
      'add-outline': addOutline,
      'time-outline': timeOutline,
      'chatbubble-outline': chatbubbleOutline,
      'water-outline': waterOutline,
      'remove-circle-outline': removeCircleOutline
    });
  }

  /**
   * Toggle the visibility of the Add Purchase form block.
   */
  toggleFormVisibility(): void {
    this.zone.run(() => {
      this.isFormVisible = !this.isFormVisible;
    });
  }

  ngOnInit(): void {
    this.refreshAll();
    // Subscribing to entries ensures we refresh stats automatically
    this.entries$.subscribe(() => {
      this.zone.run(() => {
        this.refreshAll();
      });
    });
  }

  /**
   * Handle toggle change between weekly and monthly.
   */
  onUsageTypeChange(type: UsageType): void {
    this.usageType = type;
    this.refreshAll();
  }

  /**
   * Add a new water can entry.
   */
  async addEntry(): Promise<void> {
    const cansNum = Number(this.newCans);
    const priceNum = Number(this.newPrice);

    if (!cansNum || cansNum < 1) {
      console.warn('[WaterTracker] Attempted to add invalid cans:', cansNum);
      return;
    }

    try {
      const added = await this.waterService.addEntry(
        cansNum,
        priceNum || DEFAULT_WATER_CAN_PRICE,
        this.newNote?.trim() || undefined
      );

      await this.showToast(`${added.cans} Can(s) added successfully!`, 'success');
      
      this.zone.run(() => {
        // Reset form
        this.newCans = 1;
        this.newPrice = DEFAULT_WATER_CAN_PRICE;
        this.newNote = '';
        this.refreshAll();
      });
    } catch (err) {
      console.error('[WaterTracker] Error adding entry:', err);
      this.showToast('Failed to add purchase. Please try again.', 'danger');
    }
  }

  /**
   * Show confirmation alert before deleting an entry.
   */
  async deleteEntry(id: string): Promise<void> {
    const entries = this.waterService.getAllEntries();
    const entry = entries.find(e => e.id === id);
    if (!entry) return;

    const alert = await this.alertCtrl.create({
      header: 'Delete Purchase?',
      subHeader: `${entry.cans} Can(s) - ${new Date(entry.date).toLocaleDateString()}`,
      message: entry.note ? `Existing Note: "${entry.note}"` : 'Are you sure you want to remove this entry?',
      inputs: [
        {
          name: 'reason',
          type: 'text',
          placeholder: 'Reason for deletion (optional)',
        }
      ],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Permanently Delete',
          role: 'destructive',
          handler: async (data) => {
            try {
              await this.waterService.deleteEntry(id);
              this.showToast('Purchase entry deleted.', 'medium');
              this.refreshAll();
            } catch (err) {
              this.showToast('Failed to delete entry.', 'danger');
            }
          }
        }
      ]
    });

    await alert.present();
  }

  /**
   * Global refresh for all visual metrics.
   */
  private refreshAll(): void {
    this.totalCans = this.waterService.getTotalCans();
    this.totalSpent = this.waterService.getTotalSpent();
    this.usageSummaries = [...this.waterService.getUsageData(this.usageType)];
    this.updateHeroStats();
  }

  private updateHeroStats(): void {
    this.heroLiters = this.usageType === 'weekly' 
      ? this.waterService.getWeeklyLiters()
      : this.waterService.getMonthlyLiters();
  }

  private async showToast(message: string, color: 'success' | 'danger' | 'medium'): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color,
      position: 'bottom',
      cssClass: 'custom-toast'
    });
    await toast.present();
  }
}
