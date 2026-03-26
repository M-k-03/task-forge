import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { GymTrackerService } from './services/gym-tracker.service';
import { DayPlan, WorkoutPlan, Exercise, GymSession } from './models/gym.model';

@Component({
  selector: 'app-gym-tracker',
  template: `
    <app-header title="Gym Tracker"></app-header>

    <ion-content class="ion-padding">
      <!-- View Picker -->
      <div class="view-picker-wrapper">
        <ion-segment [(ngModel)]="viewMode" mode="ios">
          <ion-segment-button value="today">
            <ion-label>Today's Focus</ion-label>
          </ion-segment-button>
          <ion-segment-button value="plan">
            <ion-label>Weekly Plan</ion-label>
          </ion-segment-button>
        </ion-segment>
      </div>

      <!-- PAGE CONTENT: TODAY -->
      <div *ngIf="viewMode === 'today'" class="animate__animated animate__fadeIn">
        <!-- Day Selector (Current Week Tracking) -->
        <div class="day-selector-container">
          <ion-segment [(ngModel)]="selectedDayIndex" (ionChange)="onDayChange()" mode="md" scrollable>
            <ion-segment-button *ngFor="let plan of workoutPlan?.workout_plan; let i = index; trackBy: trackByDay" [value]="i">
              <ion-label>{{ plan.day.substring(0, 3) }}</ion-label>
            </ion-segment-button>
          </ion-segment>
        </div>

        <div *ngIf="currentDayPlan" class="day-header">
          <div class="focus-badge">{{ currentDayPlan.day }} Focus</div>
          <h2 class="focus-title">{{ currentDayPlan.focus }}</h2>
          
          <!-- Progress Bar -->
          <div class="progress-section">
            <div class="progress-stats">
              <span>Sets Completed</span>
              <span>{{ completedStats.completed }} / {{ completedStats.total }}</span>
            </div>
            <div class="progress-bar-bg">
              <div class="progress-bar-fill" [style.width.%]="completedStats.percent"></div>
            </div>
            <p *ngIf="completedStats.percent === 100" class="celebration-text">🎉 You crushed it today!</p>
          </div>
        </div>

        <!-- Exercise List -->
        <div *ngIf="currentDayPlan" class="exercise-list">
          <ion-card *ngFor="let ex of currentDayPlan.exercises; trackBy: trackByEx" class="exercise-card">
            <ion-card-header>
              <div class="card-header-main">
                <div class="icon-orb" [class.done]="isExerciseDone(ex.id)">
                  <ion-icon [name]="ex.icon"></ion-icon>
                </div>
                <div class="title-meta">
                  <ion-card-title>{{ ex.name }}</ion-card-title>
                  <ion-card-subtitle>{{ ex.sets }} sets × {{ ex.reps }} reps</ion-card-subtitle>
                </div>
              </div>
            </ion-card-header>

            <ion-card-content>
              <div class="sets-tracker">
                <div 
                  *ngFor="let set of [].constructor(ex.sets); let i = index" 
                  class="set-bubble"
                  [class.completed]="progressMap[ex.id]?.[i]"
                  (click)="toggleSet(ex.id, i)"
                >
                  <ion-icon *ngIf="progressMap[ex.id]?.[i]" name="checkmark"></ion-icon>
                  <span *ngIf="!progressMap[ex.id]?.[i]">{{ i + 1 }}</span>
                </div>
              </div>
            </ion-card-content>
          </ion-card>
        </div>
      </div>

      <!-- PAGE CONTENT: WEEKLY PLAN OVERVIEW -->
      <div *ngIf="viewMode === 'plan'" class="animate__animated animate__fadeIn">
        <div class="plan-overview">
          <ion-list lines="none">
            <ion-item *ngFor="let plan of workoutPlan?.workout_plan; trackBy: trackByDay" class="plan-item">
              <ion-card class="full-width-card">
                <ion-card-header>
                  <ion-card-subtitle>{{ plan.day }}</ion-card-subtitle>
                  <ion-card-title>{{ plan.focus }}</ion-card-title>
                </ion-card-header>
                <ion-card-content>
                  <div class="tag-container">
                    <ion-badge *ngFor="let ex of plan.exercises; trackBy: trackByEx" color="light" class="ex-tag">
                      {{ ex.name }}
                    </ion-badge>
                  </div>
                </ion-card-content>
              </ion-card>
            </ion-item>
          </ion-list>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="!workoutPlan" class="empty-state">
        <ion-spinner name="circles"></ion-spinner>
        <p>Prepping your training session...</p>
      </div>
    </ion-content>
  `,
  styles: [`
    .view-picker-wrapper {
      margin-bottom: 20px;
      padding: 0 4px;
    }
    .day-selector-container {
      background: var(--ion-color-light);
      border-radius: 12px;
      padding: 4px;
      margin-bottom: 24px;
    }
    .day-header {
      margin: 24px 0;
      text-align: center;
      padding: 0 10px;
    }
    .focus-badge {
      display: inline-block;
      padding: 4px 12px;
      background: var(--ion-color-primary-tint);
      color: var(--ion-color-primary);
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 12px;
    }
    .focus-title {
      font-size: 1.6rem;
      font-weight: 800;
      color: var(--ion-text-color);
      margin: 0 0 20px 0;
    }
    
    /* Progress Bar */
    .progress-section {
      width: 100%;
      max-width: 400px;
      margin: 0 auto;
    }
    .progress-stats {
      display: flex;
      justify-content: space-between;
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--ion-color-medium);
      margin-bottom: 8px;
    }
    .progress-bar-bg {
      height: 10px;
      background: var(--ion-color-light-shade);
      border-radius: 10px;
      overflow: hidden;
    }
    .progress-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--ion-color-primary), var(--ion-color-secondary));
      border-radius: 10px;
      transition: width 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .celebration-text {
      margin-top: 10px;
      font-weight: 700;
      color: var(--ion-color-success);
      font-size: 0.9rem;
    }

    /* Exercise Card */
    .exercise-card {
      margin: 16px 0;
      border-radius: 20px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.06);
      border: 1px solid rgba(var(--ion-color-primary-rgb), 0.05);
    }
    .card-header-main {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .icon-orb {
      width: 48px;
      height: 48px;
      background: var(--ion-color-light-shade);
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.6rem;
      color: var(--ion-color-primary);
      transition: all 0.3s ease;
    }
    .icon-orb.done {
      background: var(--ion-color-success-tint);
      color: var(--ion-color-success);
    }
    .title-meta ion-card-title {
      font-weight: 700;
      font-size: 1.15rem;
      color: var(--ion-text-color);
    }
    .title-meta ion-card-subtitle {
      font-weight: 500;
      color: var(--ion-color-medium);
      margin-top: 2px;
    }

    .sets-tracker {
      display: flex;
      gap: 12px;
      overflow-x: auto;
      padding: 4px 2px;
      scrollbar-width: none;
    }
    .sets-tracker::-webkit-scrollbar { display: none; }

    .set-bubble {
      min-width: 44px;
      height: 44px;
      border-radius: 12px;
      background: var(--ion-color-light);
      border: 2px solid transparent;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      color: var(--ion-color-medium);
      cursor: pointer;
      transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .set-bubble.completed {
      background: var(--ion-color-success);
      color: white;
      transform: translateY(-4px);
      box-shadow: 0 4px 12px rgba(45, 211, 111, 0.4);
    }
    .set-bubble ion-icon {
      font-size: 1.2rem;
    }

    /* Plan Overview */
    .plan-item {
      padding: 0;
      margin-bottom: 12px;
    }
    .full-width-card {
      width: 100%;
      margin: 0;
      border-radius: 16px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.04);
    }
    .tag-container {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 8px;
    }
    .ex-tag {
      padding: 6px 10px;
      border-radius: 8px;
      font-weight: 500;
      font-size: 0.75rem;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 50vh;
      color: var(--ion-color-medium);
      text-align: center;
    }
  `],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HeaderComponent, RouterLink],
})
export class GymTrackerPage implements OnInit {
  private gymService = inject(GymTrackerService);
  
  viewMode: 'today' | 'plan' = 'today';
  workoutPlan: WorkoutPlan | null = null;
  selectedDayIndex: number = 0;
  currentDayPlan: DayPlan | null = null;
  today: string = new Date().toISOString().split('T')[0];
  
  progressMap: { [exId: string]: boolean[] } = {};

  calculatedStats = { completed: 0, total: 0, percent: 0 };

  get completedStats() {
    return this.calculatedStats;
  }

  ngOnInit() {
    this.gymService.plan$.subscribe(plan => {
      if (plan) {
        this.workoutPlan = plan;
        this.setInitialDay();
        this.loadTodayProgress();
        this.calculateProgress();
      }
    });
  }

  setInitialDay() {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayName = dayNames[new Date().getDay()];
    
    // Default to the first entry if today (like Sunday) isn't in the plan
    const index = this.workoutPlan?.workout_plan.findIndex(p => p.day === todayName);
    this.selectedDayIndex = index !== -1 ? (index ?? 0) : 0;
    this.onDayChange();
  }

  onDayChange() {
    this.currentDayPlan = this.workoutPlan?.workout_plan[this.selectedDayIndex] || null;
    this.calculateProgress();
  }

  loadTodayProgress() {
    const session = this.gymService.getSession(this.today);
    if (session) {
      this.progressMap = session.exerciseProgress;
    } else {
      this.progressMap = {};
    }
  }

  calculateProgress() {
    if (!this.currentDayPlan) return;
    
    let completed = 0;
    let total = 0;

    this.currentDayPlan.exercises.forEach(ex => {
      total += ex.sets;
      const progress = this.progressMap[ex.id];
      if (progress) {
        completed += progress.filter(done => !!done).length;
      }
    });

    this.calculatedStats = {
      completed,
      total,
      percent: total > 0 ? (completed / total) * 100 : 0
    };
  }

  isExerciseDone(exId: string): boolean {
    const ex = this.currentDayPlan?.exercises.find(e => e.id === exId);
    if (!ex) return false;
    
    const progress = this.progressMap[exId];
    if (!progress) return false;
    
    return progress.filter(done => !!done).length === ex.sets;
  }

  toggleSet(exerciseId: string, setIndex: number) {
    if (!this.progressMap[exerciseId]) {
      this.progressMap[exerciseId] = [];
    }
    
    const currentState = !!this.progressMap[exerciseId][setIndex];
    const newState = !currentState;
    
    this.progressMap[exerciseId][setIndex] = newState;
    
    if (this.currentDayPlan) {
      this.gymService.saveProgress(
        this.today,
        this.currentDayPlan.day,
        exerciseId,
        setIndex,
        newState
      );
    }

    this.calculateProgress();
  }

  // Performance Trackers
  trackByDay(index: number, plan: DayPlan): string {
    return plan.day;
  }

  trackByEx(index: number, ex: Exercise): string {
    return ex.id;
  }
}
