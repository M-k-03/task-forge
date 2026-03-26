export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  icon: string;
  targetWeight?: number;
  completedSets?: boolean[]; // Track session completion within the UI state
}

export interface DayPlan {
  day: string;
  focus: string;
  exercises: Exercise[];
}

export interface WorkoutPlan {
  workout_plan: DayPlan[];
}

/**
 * Interface for saving progress in localStorage
 * Key: date (YYYY-MM-DD)
 */
export interface GymSession {
  date: string;
  day: string;
  exerciseProgress: {
    [exerciseId: string]: boolean[]; // Array of booleans representing completed sets
  };
}
