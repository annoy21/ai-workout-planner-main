import React, { useState } from 'react';
import { Dumbbell, Clock, Target, Package, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

interface WorkoutFormProps {
  onSubmit: (data: {
    goal: string;
    fitnessLevel: string;
    timeAvailable: string;
    equipment: string[];
    location: string;
  }) => void;
  isLoading: boolean;
}

export function WorkoutForm({ onSubmit, isLoading }: WorkoutFormProps) {
  const [goal, setGoal] = useState('');
  const [fitnessLevel, setFitnessLevel] = useState('');
  const [timeAvailable, setTimeAvailable] = useState('');
  const [equipment, setEquipment] = useState<string[]>([]);
  const [location, setLocation] = useState('');

  const equipmentOptions = [
    'Dumbbells',
    'Barbell',
    'Resistance Bands',
    'Pull-up Bar',
    'Bench',
    'None (Bodyweight only)',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ goal, fitnessLevel, timeAvailable, equipment, location });
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="w-full max-w-xl mx-auto bg-black p-10 rounded-3xl border border-gray-800 shadow-[0_20px_50px_rgba(0,0,0,0.8)] space-y-8 backdrop-blur-md"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <h2 className="text-3xl font-bold text-center text-white mb-6 tracking-wide">
        🏋️ Build Your Plan
      </h2>

      <FormSection label="Fitness Goal" icon={<Target className="w-5 h-5 text-white" />}>
        <SelectField value={goal} onChange={setGoal} placeholder="Select a goal" options={['Weight Loss', 'Muscle Gain', 'Strength', 'Endurance']} />
      </FormSection>

      <FormSection label="Workout Location" icon={<MapPin className="w-5 h-5 text-white" />}>
        <SelectField value={location} onChange={setLocation} placeholder="Select location" options={['Gym', 'Home']} />
      </FormSection>

      <FormSection label="Fitness Level" icon={<Dumbbell className="w-5 h-5 text-white" />}>
        <SelectField value={fitnessLevel} onChange={setFitnessLevel} placeholder="Select your level" options={['Beginner', 'Intermediate', 'Advanced']} />
      </FormSection>

      <FormSection label="Time Available" icon={<Clock className="w-5 h-5 text-white" />}>
        <SelectField value={timeAvailable} onChange={setTimeAvailable} placeholder="Select time" options={['15 minutes', '30 minutes', '45 minutes', '60 minutes', '90 minutes']} />
      </FormSection>

      <FormSection label="Available Equipment" icon={<Package className="w-5 h-5 text-white" />}>
        <div className="grid grid-cols-2 gap-3">
          {equipmentOptions.map((item) => (
            <motion.label
              key={item}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 text-gray-200 bg-gray-900 px-4 py-2 rounded-xl border border-gray-700 cursor-pointer hover:shadow-md transition-all"
            >
              <input
                type="checkbox"
                checked={equipment.includes(item)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setEquipment([...equipment, item]);
                  } else {
                    setEquipment(equipment.filter((eq) => eq !== item));
                  }
                }}
                className="accent-blue-500 scale-110"
              />
              <span className="text-sm">{item}</span>
            </motion.label>
          ))}
        </div>
      </FormSection>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="submit"
        disabled={isLoading}
        className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 disabled:opacity-60"
      >
        <span className="relative w-full text-center px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-black rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent text-black dark:text-white">
          {isLoading ? 'Generating Plan...' : 'Generate Workout Plan'}
        </span>
      </motion.button>
    </motion.form>
  );
}

function FormSection({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <label className="flex items-center gap-2 text-lg font-semibold text-white mb-3">
        {icon}
        {label}
      </label>
      {children}
    </div>
  );
}

function SelectField({
  value,
  onChange,
  placeholder,
  options,
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  options: string[];
}) {
  return (
    <motion.select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required
      whileFocus={{ scale: 1.02 }}
      className="w-full p-3 rounded-xl border border-gray-700 bg-gray-900 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </motion.select>
  );
}
