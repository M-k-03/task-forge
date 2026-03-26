/**
 * Data model for a water can purchase entry.
 */
export interface WaterEntry {
  /** Unique identifier */
  id: string;

  /** Number of cans purchased */
  cans: number;

  /** Price per can at the time of purchase */
  pricePerCan: number;

  /** Total cost (cans × pricePerCan) */
  totalCost: number;

  /** Date of purchase (ISO string) */
  date: string;

  /** Optional note about the purchase */
  note?: string;
}

/**
 * Weekly summary of water can purchases.
 */
export interface WeeklySummary {
  /** Week label (e.g., "Mar 18 – Mar 24") */
  weekLabel: string;

  /** Start date of the week (ISO string) */
  weekStart: string;

  /** Total cans purchased that week */
  totalCans: number;

  /** Total money spent that week */
  totalSpent: number;

  /** Number of individual purchase entries */
  entryCount: number;
}

/**
 * Monthly summary of water can purchases.
 */
export interface MonthlySummary {
  /** Month label (e.g., "March 2026") */
  monthLabel: string;

  /** Start date of the month (ISO string), used for sorting */
  monthStart: string;

  /** Total cans purchased that month */
  totalCans: number;

  /** Total money spent that month */
  totalSpent: number;

  /** Number of individual purchase entries */
  entryCount: number;
}

/**
 * Generic usage summary used by the UI toggle.
 */
export interface UsageSummary {
  /** Display label (week range or month name) */
  label: string;

  /** Total cans in this period */
  totalCans: number;

  /** Total money spent in this period */
  totalSpent: number;

  /** Number of individual purchase entries */
  entryCount: number;
}

/**
 * Type for the usage toggle selection.
 */
export type UsageType = 'weekly' | 'monthly';
