import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HeaderComponent } from '../../shared/components/header/header.component';
import { AppCurrencyPipe } from '../../shared/pipes/currency.pipe';
import { WaterHistoryComponent } from './components/water-history.component';
import { UsageToggleComponent } from './components/usage-toggle.component';
import { UsageListComponent } from './components/usage-list.component';
import { WaterTrackerService } from './services/water-tracker.service';
import { WaterEntry, UsageSummary, UsageType } from './models/water-entry.model';
import { DEFAULT_WATER_CAN_PRICE } from '../../core/constants/app.constants';

/**
 * Water Can Tracker — main page component.
 *
 * Allows users to:
 * - Add water can purchases with quantity, price, and optional note
 * - View summary stats (total cans, total spent)
 * - Toggle between weekly / monthly usage breakdowns
 * - Browse & delete purchase history
 */
@Component({
  selector: 'app-water-tracker',
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    HeaderComponent,
    AppCurrencyPipe,
    WaterHistoryComponent,
    UsageToggleComponent,
    UsageListComponent,
  ],
  templateUrl: './water-tracker.page.html',
  styleUrls: ['./water-tracker.page.scss'],
})
export class WaterTrackerPage implements OnInit {
  // Form fields
  newCans: number = 1;
  newPrice: number = DEFAULT_WATER_CAN_PRICE;
  newNote: string = '';

  // Data
  entries: WaterEntry[] = [];
  totalCans: number = 0;
  totalSpent: number = 0;

  // Usage toggle
  usageType: UsageType = 'weekly';
  usageSummaries: UsageSummary[] = [];

  constructor(private waterService: WaterTrackerService) {}

  ngOnInit(): void {
    this.loadData();
  }

  /**
   * Handle toggle change between weekly and monthly.
   */
  onUsageTypeChange(type: UsageType): void {
    this.usageType = type;
    this.usageSummaries = this.waterService.getUsageData(type);
  }

  /**
   * Add a new water can entry, then refresh the view.
   */
  addEntry(): void {
    if (!this.newCans || this.newCans < 1) return;

    this.waterService.addEntry(
      this.newCans,
      this.newPrice || DEFAULT_WATER_CAN_PRICE,
      this.newNote?.trim() || undefined
    );

    // Reset form
    this.newCans = 1;
    this.newPrice = DEFAULT_WATER_CAN_PRICE;
    this.newNote = '';

    this.loadData();
  }

  /**
   * Delete an entry by ID, then refresh the view.
   */
  deleteEntry(id: string): void {
    this.waterService.deleteEntry(id);
    this.loadData();
  }

  /**
   * Load all data from the service.
   */
  private loadData(): void {
    this.entries = this.waterService.getAllEntries();
    this.totalCans = this.waterService.getTotalCans();
    this.totalSpent = this.waterService.getTotalSpent();
    this.usageSummaries = this.waterService.getUsageData(this.usageType);
  }
}
