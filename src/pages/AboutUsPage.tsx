import React from 'react';
import { motion } from 'framer-motion';

export function AboutUsPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-16 text-gray-700 dark:text-gray-300"
    >
      <motion.h1
        className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6 tracking-tight"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        About AI Workout Planner
      </motion.h1>
      <motion.div
        className="max-w-2xl mx-auto space-y-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, type: 'spring', stiffness: 100 }}
      >
        <p>
          AI Workout Planner is designed to help you achieve your fitness goals by providing personalized workout plans. We leverage the power of artificial intelligence to create routines tailored to your specific needs and preferences.
        </p>
        <p>
          Our mission is to make fitness accessible and effective for everyone, regardless of their experience level or available resources. By considering your goals, fitness level, available time, equipment, and preferred workout location, we aim to generate plans that are both challenging and sustainable.
        </p>
        <p>
          The workout plans are generated using advanced AI models that have been trained on a vast dataset of exercise information and best practices. We are constantly working to improve our algorithms and provide you with the most effective and engaging workout experiences.
        </p>
        <p>
          Thank you for choosing AI Workout Planner on your fitness journey!
        </p>
      </motion.div>
    </motion.div>
  );
}