export interface Exercise {
  id: string;
  name: string;
  type?: 'strength' | 'cardio';
  sets: number;
  reps: string;
  duration?: number; 
  icon: string;
  completedSets?: boolean[]; 
}

export interface WorkoutDay {
  day: string;
  focus: string;
  exercises: Exercise[];
}

export interface ExerciseSnapshot {
  id: string;
  name: string;
  type: string;
  sets: number;
  completedSetsCount: number;
}

export interface GymEntry {
  id: string;
  date: string;
  workoutDay: string;
  focus: string;
  completedExercises: ExerciseSnapshot[];
  notes?: string;
}
