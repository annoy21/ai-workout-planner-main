import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Dumbbell } from 'lucide-react';
import { WorkoutGenerator } from './components/WorkoutGenerator';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { AboutUsPage } from './pages/AboutUsPage';
import { AnimatedTooltip } from './components/ui/animated-tooltip';
import BlogPage from './pages/BlogPage';
import GifSearchPage from './pages/GifSearchPage'; // ✅ Import the GIF search page
import { FormAnalyzerPage } from './pages/FormAnalyzerPage';


import { useEffect, useRef } from 'react'; 

// Sample data for AnimatedTooltip
const teamMembers = [
  {
    id: 1,
    name: 'Aryan Acharya',
    designation: 'Founder & CEO',
    image: '../src/images/annoy_pic (1) (1)-2 2.JPG',
    socials: {
      linkedin: '#',
      github: '#',
      twitter: '#',
    }
  },
  // ... other team members
];

const FloatingDumbbells = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 50, damping: 10 });
  const springY = useSpring(y, { stiffness: 50, damping: 10 });

  return (
    <div className="fixed inset-0 overflow-hidden -z-10">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-blue-400/20 dark:text-blue-600/20"
          style={{
            x: springX,
            y: springY,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            fontSize: `${Math.random() * 3 + 1}rem`,
            rotate: Math.random() * 360,
          }}
          onMouseMove={(e) => {
            x.set(e.clientX * 0.02);
            y.set(e.clientY * 0.02);
          }}
          animate={{
            y: [0, Math.random() * 40 - 20, 0],
            x: [0, Math.random() * 40 - 20, 0],
            rotate: [0, Math.random() * 360],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
        >
          <Dumbbell className="w-full h-full" />
        </motion.div>
      ))}
    </div>
  );
};

const AnimatedGradientBackground = () => {
  return (
    <motion.div
      className="fixed inset-0 -z-20"
      animate={{
        background: [
          'radial-gradient(circle at 10% 20%, rgba(56,182,255,0.1) 0%, rgba(255,255,255,0) 20%)',
          'radial-gradient(circle at 90% 30%, rgba(236,72,153,0.1) 0%, rgba(255,255,255,0) 30%)',
          'radial-gradient(circle at 50% 80%, rgba(139,92,246,0.1) 0%, rgba(255,255,255,0) 25%)',
        ],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut',
      }}
    />
  );
};

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 flex flex-col relative overflow-hidden">
        {/* Background Elements */}
        <AnimatedGradientBackground />
        <FloatingDumbbells />
        
        {/* Animated grid pattern */}
        <div className="fixed inset-0 -z-10 opacity-10 dark:opacity-5">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        </div>

        <Navbar />
        
        {/* Main Content with 3D Tilt Effect */}
        <motion.div
          className="container mx-auto px-4 py-8 flex-grow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Enhanced Header with more spacing */}
          <div className="text-center mb-16 mt-12">
            <motion.div
              className="flex items-center justify-center gap-3 mb-6"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Dumbbell className="w-12 h-12 text-blue-600 dark:text-blue-400" />
              </motion.div>
              <motion.h1
                className="text-5xl font-bold text-gray-900 dark:text-white"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Workout Planner
              </motion.h1>
            </motion.div>
            <motion.p
              className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Get <span className="font-semibold text-blue-600 dark:text-blue-400">personalized</span> workout plans tailored to your goals and equipment
            </motion.p>
          </div>

          <Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/generate" element={<WorkoutGenerator />} />
  <Route path="/about" element={<AboutUsPage />} />
  <Route path="/blog" element={<BlogPage />} />
  <Route path="/gif-search" element={<GifSearchPage />} /> {/* ✅ NEW route */}
  <Route path="/form-analyzer" element={<FormAnalyzerPage />} />
  // Add to your existing routes
<Route path="/analyze/:exercise?" element={<FormAnalyzerPage />} />
</Routes>

        </motion.div>

        {/* Animated Footer with Team */}
        <motion.div
          className="flex justify-center py-12 border-t border-gray-200 dark:border-gray-700 bg-white/30 dark:bg-black/30 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <AnimatedTooltip items={teamMembers} />
        </motion.div>
      </div>
    </Router>
  );
}
