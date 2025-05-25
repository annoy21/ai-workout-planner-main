import React, { useState } from 'react';
import { Dumbbell } from 'lucide-react';
import { WorkoutForm } from './WorkoutForm';
import { WorkoutPlan } from './WorkoutPlan';
import { generateWorkoutPlan } from '../lib/gemini';
import { motion } from 'framer-motion';

export function WorkoutGenerator() {
  const [workoutPlan, setWorkoutPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: {
    goal: string;
    fitnessLevel: string;
    timeAvailable: string;
    equipment: string[];
    location: string;
  }) => {
    try {
      setIsLoading(true);
      const plan = await generateWorkoutPlan(
        data.goal,
        data.fitnessLevel,
        data.timeAvailable,
        data.equipment,
        data.location
      );
      setWorkoutPlan(plan);
    } catch (error) {
      console.error('Error generating workout plan:', error);
      alert('Failed to generate workout plan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
      <div className="">
        <WorkoutForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>

      <div className="md:mt-0 mt-8">
        {workoutPlan && <WorkoutPlan plan={workoutPlan} />}
      </div>
    </div>
  );
}