export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  icon: string;
  completedSets?: boolean[]; // track completion of each set
}

export interface WorkoutDay {
  day: string;
  focus: string;
  exercises: Exercise[];
}

export interface GymEntry {
  id: string;
  date: string;
  workoutDay: string;
  completedExercises: string[]; // IDs of exercises fully completed
  notes?: string;
}
