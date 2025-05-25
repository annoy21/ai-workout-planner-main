export interface WorkoutPlan {
  exercises: Exercise[];
  duration: string;
  difficulty: string;
  notes: string;
}

export interface Exercise {
  name: string;
  sets: number;
  reps: number;
  description: string;
  muscleGroup: string;
  restPeriod: string;
}