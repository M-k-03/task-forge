import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, take } from 'rxjs';
import { StorageService } from '../../../core/services/storage.service';
import { STORAGE_KEYS } from '../../../core/constants/app.constants';
import { WorkoutDay, GymEntry, Exercise, ExerciseSnapshot } from '../models/gym.model';
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

  private async loadWorkoutPlan() {
    // 1. Load from LocalStorage for instant UI
    const savedPlan = this.storage.get<WorkoutDay[]>(STORAGE_KEYS.GYM_PLAN);
    if (savedPlan && savedPlan.length > 0) {
      this._workoutPlan.next(this.sanitizePlan(savedPlan));
    }

    // 2. Load from Firebase to ensure sync
    this.firestore.getCollection<any>('workout_plans')
      .pipe(take(1))
      .subscribe({
        next: (docs: any[]) => {
          if (docs && docs.length > 0) {
            // Find the 'current_plan' doc
            const firebasePlan = docs.find(d => d.id === 'current_plan');
            if (firebasePlan?.days) {
              const sanitized = this.sanitizePlan(firebasePlan.days);
              this._workoutPlan.next(sanitized);
              this.storage.set(STORAGE_KEYS.GYM_PLAN, sanitized);
            }
          } else if (!savedPlan) {
            // 3. Fallback to Local JSON if nothing exists
            this.loadFromAssets();
          }
        },
        error: (err) => {
          console.error('[GymTracker] Firebase load failed:', err);
          if (!savedPlan) this.loadFromAssets();
        }
      });
  }

  private loadFromAssets() {
    this.http.get<{ workout_plan: WorkoutDay[] }>('assets/workout.json').subscribe({
      next: (data) => {
        const plan = this.sanitizePlan(data.workout_plan);
        this.saveWorkoutPlan(plan);
      },
      error: (err) => console.error('Error loading workout plan:', err)
    });
  }

  private sanitizePlan(plan: WorkoutDay[]): WorkoutDay[] {
    return plan.map(day => ({
      ...day,
      exercises: (day.exercises || []).map(ex => ({
        ...ex,
        id: ex.id || crypto.randomUUID(),
        type: ex.type || 'strength',
        duration: ex.duration || 0,
        reps: ex.reps || '10',
        completedSets: ex.completedSets || new Array(ex.sets || 3).fill(false)
      }))
    }));
  }

  async saveWorkoutPlan(plan: WorkoutDay[]) {
    this.storage.set(STORAGE_KEYS.GYM_PLAN, plan);
    this._workoutPlan.next(plan);
    
    try {
      await this.firestore.setDocument('workout_plans', 'current_plan', { 
        days: plan,
        updatedAt: new Date().toISOString() 
      });
    } catch (err) {
      console.error('[GymTrackerPlan] Firebase sync failed:', err);
    }
  }

  async syncManualPlan() {
    return this.saveWorkoutPlan(this._workoutPlan.value);
  }

  async addExercise(dayName: string, exercise: Partial<Exercise>) {
    const currentPlan = [...this._workoutPlan.value];
    const dayIndex = currentPlan.findIndex(d => d.day === dayName);
    
    if (dayIndex === -1) {
      currentPlan.push({ day: dayName, focus: 'Mixed Focus', exercises: [] });
    }

    const newEx: Exercise = {
      id: crypto.randomUUID(),
      name: exercise.name || 'New Exercise',
      type: exercise.type || 'strength',
      sets: Number(exercise.sets) || 3,
      reps: exercise.reps || '10',
      duration: exercise.duration || 0,
      icon: exercise.icon || 'barbell-outline',
      completedSets: new Array(Number(exercise.sets) || 3).fill(false)
    };

    const targetDay = dayIndex === -1 ? currentPlan[currentPlan.length-1] : currentPlan[dayIndex];
    targetDay.exercises.push(newEx);
    await this.saveWorkoutPlan(currentPlan);
  }

  async removeExercise(exerciseId: string) {
    const currentPlan = this._workoutPlan.value.map(day => ({
      ...day,
      exercises: day.exercises.filter(ex => ex.id !== exerciseId)
    }));
    await this.saveWorkoutPlan(currentPlan);
  }

  private loadHistory() {
    const history = this.storage.get<GymEntry[]>(STORAGE_KEYS.GYM_ENTRIES) || [];
    this._history.next(history);
  }

  private saveHistory(history: GymEntry[]) {
    this.storage.set(STORAGE_KEYS.GYM_ENTRIES, history);
    this._history.next(history);
  }

  /**
   * Records a workout session with detailed exercise snapshots.
   */
  recordWorkout(day: string, focus: string, snapshots: ExerciseSnapshot[], notes?: string) {
    const todayStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const currentHistory = [...this._history.value];
    
    // Check if an entry for today already exists
    const existingIndex = currentHistory.findIndex(entry => 
      entry.date.startsWith(todayStr)
    );

    if (existingIndex > -1) {
      // MERGE logic: Update history for the same day
      const existingEntry = currentHistory[existingIndex];
      
      snapshots.forEach(newSnap => {
        const idx = existingEntry.completedExercises.findIndex(ex => ex.id === newSnap.id);
        if (idx > -1) {
          // Update existing exercise snapshot
          existingEntry.completedExercises[idx] = newSnap;
        } else {
          // Add new exercise snapshot to today's workout
          existingEntry.completedExercises.push(newSnap);
        }
      });
      
      existingEntry.focus = focus; // Update focus if changed
      if (notes) existingEntry.notes = notes;
      
    } else {
      // CREATE logic: New day entry
      const entry: GymEntry = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        workoutDay: day,
        focus: focus,
        completedExercises: snapshots,
        notes
      };
      currentHistory.unshift(entry);
    }

    this.saveHistory(currentHistory.slice(0, 50));
  }

  getWorkoutForDay(dayName: string): Observable<WorkoutDay | undefined> {
    return this.workoutPlan$.pipe(
      map(plan => plan.find(d => d.day.toLowerCase() === dayName.toLowerCase()))
    );
  }
}
