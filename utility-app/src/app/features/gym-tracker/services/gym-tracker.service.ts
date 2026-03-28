import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { StorageService } from '../../../core/services/storage.service';
import { STORAGE_KEYS } from '../../../core/constants/app.constants';
import { WorkoutDay, GymEntry, Exercise } from '../models/gym.model';

@Injectable({
  providedIn: 'root'
})
export class GymTrackerService {
  private http = inject(HttpClient);
  private storage = inject(StorageService);

  private _workoutPlan = new BehaviorSubject<WorkoutDay[]>([]);
  public workoutPlan$ = this._workoutPlan.asObservable();

  private _history = new BehaviorSubject<GymEntry[]>([]);
  public history$ = this._history.asObservable();

  constructor() {
    this.loadWorkoutPlan();
    this.loadHistory();
  }

  /**
   * Loads the static workout plan from assets.
   */
  private loadWorkoutPlan() {
    this.http.get<{ workout_plan: WorkoutDay[] }>('assets/workout.json').subscribe({
      next: (data) => {
        // Initialize completedSets array for each exercise
        const plan = data.workout_plan.map(day => ({
          ...day,
          exercises: day.exercises.map(ex => ({
            ...ex,
            completedSets: new Array(ex.sets).fill(false)
          }))
        }));
        this._workoutPlan.next(plan);
      },
      error: (err) => console.error('Error loading workout plan:', err)
    });
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
