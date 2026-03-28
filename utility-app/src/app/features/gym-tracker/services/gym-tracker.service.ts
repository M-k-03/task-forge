import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { StorageService } from '../../../core/services/storage.service';
import { STORAGE_KEYS } from '../../../core/constants/app.constants';
import { WorkoutDay, GymEntry, Exercise } from '../models/gym.model';
import { FirestoreService } from '../../../core/services/firestore.service';

@Injectable({
  providedIn: 'root'
})
export class GymTrackerService {
  private http = inject(HttpClient);
  private storage = inject(StorageService);
  private firestore = inject(FirestoreService);

  private _workoutPlan = new BehaviorSubject<WorkoutDay[]>([]);
  public workoutPlan$ = this._workoutPlan.asObservable();

  private _history = new BehaviorSubject<GymEntry[]>([]);
  public history$ = this._history.asObservable();

  constructor() {
    this.loadWorkoutPlan();
    this.loadHistory();
  }

  /**
   * Loads the workout plan from storage or fallback to assets.
   */
  private async loadWorkoutPlan() {
    // 1. Try Local Storage
    const savedPlan = this.storage.get<WorkoutDay[]>(STORAGE_KEYS.GYM_PLAN);
    if (savedPlan && savedPlan.length > 0) {
      this._workoutPlan.next(savedPlan);
      return;
    }

    // 2. Fallback to assets
    this.http.get<{ workout_plan: WorkoutDay[] }>('assets/workout.json').subscribe({
      next: (data) => {
        const plan = data.workout_plan.map(day => ({
          ...day,
          exercises: day.exercises.map(ex => ({
            ...ex,
            id: ex.id || crypto.randomUUID(),
            completedSets: new Array(ex.sets).fill(false)
          }))
        }));
        this.saveWorkoutPlan(plan);
      },
      error: (err) => console.error('Error loading workout plan:', err)
    });
  }

  /**
   * Saves the workout plan to storage and Firestore.
   */
  async saveWorkoutPlan(plan: WorkoutDay[]) {
    this.storage.set(STORAGE_KEYS.GYM_PLAN, plan);
    this._workoutPlan.next(plan);
    console.log('[GymTrackerPlan] Plan saved locally. Attempting cloud sync...');
    
    // Cloud Sync (Async)
    try {
      // Structure the document with an explicit "days" property for clearer querying
      await this.firestore.setDocument('workout_plans', 'current_plan', { 
        days: plan,
        updatedAt: new Date().toISOString() 
      });
      console.log('[GymTrackerPlan] Plan successfully synced to Firebase Cloud.');
    } catch (err) {
      console.error('[GymTrackerPlan] Firebase sync failed:', err);
    }
  }

  /**
   * Manual trigger to ensure the current plan is synced.
   */
  async syncManualPlan() {
    return this.saveWorkoutPlan(this._workoutPlan.value);
  }

  /**
   * Add a new exercise to a specific day.
   */
  async addExercise(dayName: string, exercise: Partial<Exercise>) {
    const currentPlan = [...this._workoutPlan.value];
    const dayIndex = currentPlan.findIndex(d => d.day === dayName);
    
    if (dayIndex === -1) {
      currentPlan.push({ day: dayName, focus: 'Mixed Focus', exercises: [] });
    }

    const newEx: Exercise = {
      id: crypto.randomUUID(),
      name: exercise.name || 'New Exercise',
      sets: exercise.sets || 3,
      reps: exercise.reps || '10',
      icon: exercise.icon || 'barbell-outline',
      completedSets: new Array(exercise.sets || 3).fill(false)
    };

    const targetDay = dayIndex === -1 ? currentPlan[currentPlan.length-1] : currentPlan[dayIndex];
    targetDay.exercises.push(newEx);
    
    await this.saveWorkoutPlan(currentPlan);
  }

  /**
   * Remove an exercise from the plan.
   */
  async removeExercise(exerciseId: string) {
    const currentPlan = this._workoutPlan.value.map(day => ({
      ...day,
      exercises: day.exercises.filter(ex => ex.id !== exerciseId)
    }));
    await this.saveWorkoutPlan(currentPlan);
  }

  /**
   * Loads workout history from storage.
   */
  private loadHistory() {
    const history = this.storage.get<GymEntry[]>(STORAGE_KEYS.GYM_ENTRIES) || [];
    this._history.next(history);
  }

  /**
   * Saves history to storage.
   */
  private saveHistory(history: GymEntry[]) {
    this.storage.set(STORAGE_KEYS.GYM_ENTRIES, history);
    this._history.next(history);
  }

  /**
   * Records a workout session.
   */
  recordWorkout(day: string, completedExercises: string[], notes?: string) {
    const entry: GymEntry = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      workoutDay: day,
      completedExercises,
      notes
    };

    const currentHistory = this._history.value;
    this.saveHistory([entry, ...currentHistory].slice(0, 50)); // Keep last 50
  }

  /**
   * Get workout for a specific day.
   */
  getWorkoutForDay(dayName: string): Observable<WorkoutDay | undefined> {
    return this.workoutPlan$.pipe(
      map(plan => plan.find(d => d.day.toLowerCase() === dayName.toLowerCase()))
    );
  }

  /**
   * Get today's recommended workout based on current day of the week.
   */
  getTodaysWorkout(): Observable<WorkoutDay | undefined> {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = days[new Date().getDay()];
    return this.getWorkoutForDay(today);
  }
}
