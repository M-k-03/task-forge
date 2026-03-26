import { Injectable } from '@angular/core';

/**
 * Centralized localStorage service.
 * All features must use this service for persistence — never access localStorage directly.
 */
@Injectable({ providedIn: 'root' })
export class StorageService {
  /**
   * Retrieve a value from localStorage.
   * @param key - The storage key (should be prefixed with 'utility_app_')
   * @returns Parsed value or null if not found
   */
  get<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch (error) {
      console.error(`[StorageService] Error reading key "${key}":`, error);
      return null;
    }
  }

  /**
   * Save a value to localStorage.
   * @param key - The storage key
   * @param value - The value to store (will be JSON-stringified)
   */
  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`[StorageService] Error writing key "${key}":`, error);
    }
  }

  /**
   * Remove a key from localStorage.
   */
  remove(key: string): void {
    localStorage.removeItem(key);
  }

  /**
   * Clear all app-related keys from localStorage.
   */
  clearAll(): void {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('utility_app_')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
  }
}
