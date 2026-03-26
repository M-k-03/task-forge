import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService } from '../../../core/services/storage.service';
import { STORAGE_KEYS, DEFAULT_WATER_CAN_PRICE } from '../../../core/constants/app.constants';
import {
  WaterEntry,
  WeeklySummary,
  MonthlySummary,
  UsageSummary,
  UsageType,
} from '../models/water-entry.model';

/**
 * Service handling all business logic for the Water Can Tracker feature.
 * Manages CRUD operations and weekly/monthly summary calculations.
 * Uses BehaviorSubjects for reactive updates.
 */
@Injectable({ providedIn: 'root' })
export class WaterTrackerService {
  /** Reactive stream of entries */
  private entriesSubject = new BehaviorSubject<WaterEntry[]>([]);
  entries$ = this.entriesSubject.asObservable();

  /** Cache for computed summaries to avoid unnecessary recalculations */
  private weeklyCache: WeeklySummary[] | null = null;
  private monthlyCache: MonthlySummary[] | null = null;

  constructor(private storage: StorageService) {
    this.refreshEntries();
  }

  /**
   * Refresh entries from storage and invalidate caches.
   */
  private refreshEntries(): void {
    const entries = this.storage.get<WaterEntry[]>(STORAGE_KEYS.WATER_ENTRIES) || [];
    const sorted = entries.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    this.entriesSubject.next(sorted);
    this.weeklyCache = null;
    this.monthlyCache = null;
  }

  /**
   * Get all water entries, sorted by date (newest first).
   */
  getAllEntries(): WaterEntry[] {
    return this.entriesSubject.getValue();
  }

  /**
   * Add a new water can purchase entry, then refresh the view.
   */
  addEntry(
    cans: number,
    pricePerCan: number = DEFAULT_WATER_CAN_PRICE,
    note?: string
  ): WaterEntry {
    const entry: WaterEntry = {
      id: this.generateId(),
      cans,
      pricePerCan,
      totalCost: cans * pricePerCan,
      date: new Date().toISOString(),
      note,
    };

    const entries = this.getAllEntries();
    entries.push(entry);
    this.storage.set(STORAGE_KEYS.WATER_ENTRIES, entries);
    this.refreshEntries();

    return entry;
  }

  /**
   * Delete an entry by its ID, then refresh the view.
   */
  deleteEntry(id: string): void {
    const entries = this.getAllEntries().filter((e) => e.id !== id);
    this.storage.set(STORAGE_KEYS.WATER_ENTRIES, entries);
    this.refreshEntries();
  }

  /**
   * Get the total amount spent across all entries.
   */
  getTotalSpent(): number {
    return this.getAllEntries().reduce((sum, entry) => sum + entry.totalCost, 0);
  }

  /**
   * Get the total number of cans purchased.
   */
  getTotalCans(): number {
    return this.getAllEntries().reduce((sum, entry) => sum + entry.cans, 0);
  }

  // ──────────────────────────────────────────
  // Usage Data (Weekly / Monthly toggle)
  // ──────────────────────────────────────────

  /**
   * Get usage data grouped by the selected type.
   * Returns a normalized UsageSummary[] used by the UI.
   */
  getUsageData(type: UsageType): UsageSummary[] {
    if (type === 'monthly') {
      return this.getMonthlySummaries().map((m) => ({
        label: m.monthLabel,
        totalCans: m.totalCans,
        totalSpent: m.totalSpent,
        entryCount: m.entryCount,
      }));
    }

    return this.getWeeklySummaries().map((w) => ({
      label: w.weekLabel,
      totalCans: w.totalCans,
      totalSpent: w.totalSpent,
      entryCount: w.entryCount,
    }));
  }

  /**
   * Get weekly summaries of water purchases.
   * Uses memoization — cache is cleared when entries change.
   */
  getWeeklySummaries(weeksCount: number = 8): WeeklySummary[] {
    if (this.weeklyCache) return this.weeklyCache;

    const entries = this.getAllEntries();
    const summaryMap = new Map<string, WeeklySummary>();

    entries.forEach((entry) => {
      const entryDate = new Date(entry.date);
      const weekStart = this.getWeekStart(entryDate);
      const weekKey = weekStart.toISOString().split('T')[0];

      if (summaryMap.has(weekKey)) {
        const summary = summaryMap.get(weekKey)!;
        summary.totalCans += entry.cans;
        summary.totalSpent += entry.totalCost;
        summary.entryCount += 1;
      } else {
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);

        summaryMap.set(weekKey, {
          weekLabel: this.formatWeekLabel(weekStart, weekEnd),
          weekStart: weekStart.toISOString(),
          totalCans: entry.cans,
          totalSpent: entry.totalCost,
          entryCount: 1,
        });
      }
    });

    this.weeklyCache = Array.from(summaryMap.values())
      .sort(
        (a, b) =>
          new Date(b.weekStart).getTime() - new Date(a.weekStart).getTime()
      )
      .slice(0, weeksCount);

    return this.weeklyCache;
  }

  /**
   * Get monthly summaries of water purchases.
   * Uses memoization — cache is cleared when entries change.
   */
  getMonthlySummaries(monthsCount: number = 12): MonthlySummary[] {
    if (this.monthlyCache) return this.monthlyCache;

    const entries = this.getAllEntries();
    const summaryMap = new Map<string, MonthlySummary>();

    entries.forEach((entry) => {
      const entryDate = new Date(entry.date);
      const year = entryDate.getFullYear();
      const month = entryDate.getMonth(); // 0-indexed
      const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;

      if (summaryMap.has(monthKey)) {
        const summary = summaryMap.get(monthKey)!;
        summary.totalCans += entry.cans;
        summary.totalSpent += entry.totalCost;
        summary.entryCount += 1;
      } else {
        const monthStart = new Date(year, month, 1);
        summaryMap.set(monthKey, {
          monthLabel: this.formatMonthLabel(monthStart),
          monthStart: monthStart.toISOString(),
          totalCans: entry.cans,
          totalSpent: entry.totalCost,
          entryCount: 1,
        });
      }
    });

    this.monthlyCache = Array.from(summaryMap.values())
      .sort(
        (a, b) =>
          new Date(b.monthStart).getTime() - new Date(a.monthStart).getTime()
      )
      .slice(0, monthsCount);

    return this.monthlyCache;
  }

  // ──────────────────────────────────────────
  // Private Helpers
  // ──────────────────────────────────────────

  /**
   * Get the Monday of the week for a given date.
   */
  private getWeekStart(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  /**
   * Format a week range label (e.g., "Mar 23 – Mar 29").
   */
  private formatWeekLabel(start: Date, end: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
    };
    const startStr = start.toLocaleDateString('en-US', options);
    const endStr = end.toLocaleDateString('en-US', options);
    return `${startStr} – ${endStr}`;
  }

  /**
   * Format a month label (e.g., "March 2026").
   */
  private formatMonthLabel(date: Date): string {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  }

  /**
   * Generate a simple unique ID.
   */
  private generateId(): string {
    return (
      Date.now().toString(36) + Math.random().toString(36).substring(2)
    );
  }
}
