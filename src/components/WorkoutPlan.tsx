import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Activity, AlertCircle, Dumbbell } from 'lucide-react';

interface WorkoutPlanProps {
  plan: string;
}

function parsePlan(plan: string) {
  const lines = plan.trim().split('\n');
  const sections: { title: string; exercises: { name: string; details: string[] }[] }[] = [];

  let currentSection = { title: '', exercises: [] as any[] };
  let currentExercise: { name: string; details: string[] } | null = null;

  for (let line of lines) {
    line = line.trim();
    if (/^\d+\.\s/.test(line)) {
      // Section title like "1. Warm-up"
      if (currentSection.title) sections.push(currentSection);
      currentSection = { title: line, exercises: [] };
    } else if (line.endsWith(':')) {
      // New exercise title
      if (currentExercise) currentSection.exercises.push(currentExercise);
      currentExercise = { name: line.slice(0, -1), details: [] };
    } else if (line.length > 0) {
      // Exercise detail (sets, reps, rest)
      if (currentExercise) currentExercise.details.push(line);
    }
  }

  if (currentExercise) currentSection.exercises.push(currentExercise);
  if (currentSection.title) sections.push(currentSection);

  return sections;
}

export function WorkoutPlan({ plan }: WorkoutPlanProps) {
  const sections = parsePlan(plan);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black text-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] p-8 max-w-3xl w-full border border-gray-800 space-y-6"
    >
      <div>
        <h2 className="text-3xl font-bold mb-4 flex items-center gap-3 text-blue-400">
          <Activity className="w-7 h-7" />
          Your Personalized Workout Plan
        </h2>

        <div className="flex items-center gap-2 text-gray-400 mb-6 text-sm">
          <Clock className="w-4 h-4" />
          <span>Generated just now</span>
        </div>

        <div className="bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-lg mb-8">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-300 mt-0.5" />
            <p className="text-sm text-blue-200">
              Always warm up before starting your workout and listen to your body. If you experience pain, stop and consult a healthcare professional.
            </p>
          </div>
        </div>
      </div>

      {sections.map((section, idx) => (
        <div key={idx} className="space-y-4">
          <h3 className="text-xl font-semibold text-purple-300">{section.title}</h3>
          <div className="grid gap-4">
            {section.exercises.map((exercise, exIdx) => (
              <div
                key={exIdx}
                className="bg-gray-900/70 p-4 rounded-xl border border-gray-700 shadow-inner transition-all"
              >
                <div className="flex items-center gap-2 text-lg font-medium text-white mb-2">
                  <Dumbbell className="w-4 h-4 text-blue-400" />
                  {exercise.name}
                </div>
                <ul className="list-disc list-inside text-sm text-gray-300 space-y-1 pl-2">
                  {exercise.details.map((detail, i) => (
                    <li key={i}>{detail}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ))}
    </motion.div>
  );
}
