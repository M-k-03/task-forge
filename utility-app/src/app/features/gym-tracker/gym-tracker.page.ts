import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonHeader, 
  IonToolbar, 
  IonButtons, 
  IonBackButton, 
  IonTitle, 
  IonContent, 
  IonIcon, 
  IonGrid, 
  IonRow, 
  IonCol, 
  IonButton, 
  IonBadge, 
  IonProgressBar,
  IonSegment,
  IonSegmentButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonFab,
  IonFabButton,
  IonModal,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  barbellOutline, 
  fitnessOutline, 
  trendingDownOutline, 
  expandOutline, 
  bodyOutline, 
  arrowDownOutline, 
  footstepsOutline, 
  trendingUpOutline, 
  stopwatchOutline, 
  infiniteOutline,
  checkmarkCircle,
  checkmarkCircleOutline,
  saveOutline,
  calendarOutline,
  refreshOutline,
  addOutline,
  closeOutline,
  trashOutline,
  bicycleOutline
} from 'ionicons/icons';
import { GymTrackerService } from './services/gym-tracker.service';
import { WorkoutDay, Exercise } from './models/gym.model';
import { Observable, take } from 'rxjs';

@Component({
  selector: 'app-gym-tracker',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    IonHeader, 
    IonToolbar, 
    IonButtons, 
    IonBackButton, 
    IonTitle, 
    IonContent, 
    IonIcon, 
    IonGrid, 
    IonRow, 
    IonCol, 
    IonButton, 
    IonBadge, 
    IonProgressBar,
    IonSegment, 
    IonSegmentButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonFab,
    IonFabButton,
    IonModal,
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption
  ],
  templateUrl: './gym-tracker.page.html',
  styleUrls: ['./gym-tracker.page.scss'],
})
export class GymTrackerPage implements OnInit {
  private service = inject(GymTrackerService);
  private toastCtrl = inject(ToastController);

  workoutPlan$ = this.service.workoutPlan$;
  selectedDay = signal<string>(this.getTodayName());
  currentWorkout = signal<WorkoutDay | undefined>(undefined);
  
  progress = signal<number>(0);

  // Custom Exercise Form
  isModalOpen = false;
  newExercise = {
    name: '',
    sets: 3,
    reps: '10',
    icon: 'barbell-outline'
  };

  constructor() {
    addIcons({
      'barbell-outline': barbellOutline,
      'fitness-outline': fitnessOutline,
      'trending-down-outline': trendingDownOutline,
      'expand-outline': expandOutline,
      'body-outline': bodyOutline,
      'arrow-down-outline': arrowDownOutline,
      'footsteps-outline': footstepsOutline,
      'trending-up-outline': trendingUpOutline,
      'stopwatch-outline': stopwatchOutline,
      'infinite-outline': infiniteOutline,
      'checkmark-circle': checkmarkCircle,
      'checkmark-circle-outline': checkmarkCircleOutline,
      'save-outline': saveOutline,
      'calendar-outline': calendarOutline,
      'refresh-outline': refreshOutline,
      'add-outline': addOutline,
      'close-outline': closeOutline,
      'trash-outline': trashOutline,
      'bicycle-outline': bicycleOutline
    });
  }

  ngOnInit() {
    this.workoutPlan$.subscribe(plan => {
      if (plan.length > 0) {
        this.updateCurrentWorkout(this.selectedDay());
      }
    });
  }

  private getTodayName(): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date().getDay()];
  }

  onDayChange(event: any) {
    const day = event.detail.value;
    this.selectedDay.set(day);
    this.updateCurrentWorkout(day);
  }

  private updateCurrentWorkout(dayName: string) {
    this.workoutPlan$.pipe(take(1)).subscribe(plan => {
      const day = plan.find(d => d.day === dayName);
      if (day) {
        // Deep copy to avoid mutating the source BehaviorSubject directly if not needed
        // but here we want local state for completion tracking.
        this.currentWorkout.set(JSON.parse(JSON.stringify(day)));
        this.calculateProgress();
      } else {
        this.currentWorkout.set(undefined);
        this.progress.set(0);
      }
    });
  }

  toggleSet(exercise: Exercise, setIndex: number) {
    if (exercise.completedSets) {
      exercise.completedSets[setIndex] = !exercise.completedSets[setIndex];
      this.calculateProgress();
    }
  }

  private calculateProgress() {
    const workout = this.currentWorkout();
    if (!workout) return;

    let totalSets = 0;
    let completedSets = 0;

    workout.exercises.forEach(ex => {
      totalSets += ex.sets;
      completedSets += (ex.completedSets?.filter(s => s).length || 0);
    });

    this.progress.set(totalSets > 0 ? completedSets / totalSets : 0);
  }

  async saveWorkout() {
    const workout = this.currentWorkout();
    if (!workout) return;

    // 1. Sync the current custom Plan to Cloud (Exercises data)
    await this.service.syncManualPlan();

    // 2. Record the history entry
    const completedExerciseIds = workout.exercises
      .filter(ex => ex.completedSets?.every(s => s))
      .map(ex => ex.id);

    this.service.recordWorkout(workout.day, completedExerciseIds);
    
    this.showToast('Workout & Exercises saved successfully!', 'success');
  }

  resetWorkout() {
    this.updateCurrentWorkout(this.selectedDay());
  }

  // --- Custom Plan Methods ---

  openAddModal() {
    this.isModalOpen = true;
  }

  async addExerciseToPlan() {
    if (!this.newExercise.name.trim()) return;

    await this.service.addExercise(this.selectedDay(), {
      name: this.newExercise.name,
      sets: Number(this.newExercise.sets),
      reps: this.newExercise.reps,
      icon: this.newExercise.icon
    });

    this.isModalOpen = false;
    this.newExercise = { name: '', sets: 3, reps: '10', icon: 'barbell-outline' };
    
    // Refresh
    this.updateCurrentWorkout(this.selectedDay());
    this.showToast('Exercise added successfully!', 'success');
  }

  async removeExercise(id: string) {
    await this.service.removeExercise(id);
    this.updateCurrentWorkout(this.selectedDay());
    this.showToast('Exercise removed.', 'warning');
  }

  private async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color,
      position: 'bottom'
    });
    await toast.present();
  }
}
