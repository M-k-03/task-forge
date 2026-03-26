import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, map, tap, of } from 'rxjs';
import { StorageService } from '../../../core/services/storage.service';
import { STORAGE_KEYS } from '../../../core/constants/app.constants';
import { WorkoutPlan, GymSession, DayPlan } from '../models/gym.model';

@Injectable({ providedIn: 'root' })
export class GymTrackerService {
  private http = inject(HttpClient);
  private storage = inject(StorageService);

  private planSubject = new BehaviorSubject<WorkoutPlan | null>(null);
  plan$ = this.planSubject.asObservable();

  constructor() {
    this.loadPlan();
  }

  /**
   * Load the workout plan from the static JSON file.
   */
  loadPlan(): void {
    this.http.get<WorkoutPlan>('/assets/workout.json').subscribe({
      next: (plan) => this.planSubject.next(plan),
      error: (err) => console.error('[GymService] Failed to load plan', err),
    });
  }

  /**
   * Retrieve session data for a specific date (YYYY-MM-DD).
   */
  getSession(date: string): GymSession | null {
    const allSessions = this.getAllSessions();
    return allSessions.find((s) => s.date === date) || null;
  }

  /**
   * Toggle a set's completion for a specific exercise in a session.
   */
  saveProgress(date: string, day: string, exerciseId: string, setIndex: number, completed: boolean): void {
    const allSessions = this.getAllSessions();
    let session = allSessions.find((s: GymSession) => s.date === date);

    if (!session) {
      session = { date, day, exerciseProgress: {} };
      allSessions.push(session);
    }

    if (!session.exerciseProgress[exerciseId]) {
      session.exerciseProgress[exerciseId] = [];
    }

    session.exerciseProgress[exerciseId][setIndex] = completed;

    // Limit stored sessions to last 30 entries to prevent bloat
    const limitedSessions = allSessions.slice(-30);
    this.storage.set<GymSession[]>(STORAGE_KEYS.GYM_ENTRIES, limitedSessions);
  }

  /**
   * Get all workout sessions from storage.
   */
  private getAllSessions(): GymSession[] {
    return this.storage.get<GymSession[]>(STORAGE_KEYS.GYM_ENTRIES) || [];
  }
}
