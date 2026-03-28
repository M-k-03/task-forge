/**
 * App-wide constants and configuration.
 */

// localStorage key registry — all keys must be listed here
export const STORAGE_KEYS = {
  WATER_ENTRIES: 'utility_app_water_entries',
  BMI_HISTORY: 'utility_app_bmi_history',
  EXPENSES: 'utility_app_expenses',
  NOTES: 'utility_app_notes',
  GYM_ENTRIES: 'utility_app_gym_entries',
  GYM_PLAN: 'utility_app_gym_plan',
} as const;

// Default water can price (in your local currency)
export const DEFAULT_WATER_CAN_PRICE = 30;

// App metadata
export const APP_NAME = 'Utility App';
export const APP_VERSION = '1.0.0';
