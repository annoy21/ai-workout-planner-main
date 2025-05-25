import React from 'react';
import { motion } from 'framer-motion';
import { Dumbbell } from 'lucide-react';
import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-20 text-center"
    >
      <div className="inline-block bg-gradient-to-br from-blue-600 to-purple-600 rounded-full p-6 shadow-lg">
        <Dumbbell className="w-16 h-16 text-white" />
      </div>
      <motion.h1
        className="text-4xl font-bold text-gray-900 dark:text-white mt-6 tracking-tight"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Welcome to AI Workout Planner
      </motion.h1>
      <motion.p
        className="text-xl text-gray-600 dark:text-gray-300 mt-4 max-w-lg mx-auto"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Generate personalized workout plans tailored to your fitness goals, equipment, and available time. Let AI be your personal trainer!
      </motion.p>
      <motion.div
        className="mt-8"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, type: 'spring', stiffness: 100 }}
      >
        <Link
          to="/generate"
          className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Get Started <Dumbbell className="w-5 h-5 ml-2" />
        </Link>
      </motion.div>
    </motion.div>
  );
}