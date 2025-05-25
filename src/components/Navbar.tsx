import React, { useState, useEffect } from 'react';
import { Dumbbell, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-lg' : 'bg-white dark:bg-gray-900 shadow-sm'}`}>
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center group"
              onClick={() => setIsOpen(false)}
            >
              <Dumbbell className="w-6 h-6 mr-2 text-blue-500 group-hover:rotate-45 transition-transform duration-300" />
              <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent dark:from-blue-400 dark:to-blue-300">
                Workout Planner
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="relative text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-300 group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              to="/blog" 
              className="relative text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-300 group"
            >
              Blog
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              to="/about" 
              className="relative text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-300 group"
            >
              About Us
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              to="/generate" 
              className="relative inline-flex items-center justify-center px-4 py-2 overflow-hidden font-medium text-white transition-all duration-300 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg group hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-blue-500/30"
            >
              <span className="relative z-10">Generate Plan</span>
              <span className="absolute bottom-0 right-0 w-8 h-8 -mb-2 -mr-2 transition-all duration-300 ease-out transform translate-x-0 translate-y-0 bg-blue-700 rounded-full group-hover:translate-x-1 group-hover:translate-y-1"></span>
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <button 
            className="md:hidden p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-gray-700 dark:text-gray-300 transition-transform duration-300 transform rotate-180" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300 transition-transform duration-300" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 mt-4' : 'max-h-0'}`}>
          <div className="flex flex-col space-y-4 py-4 px-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg">
            <Link 
              to="/" 
              className="px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300 flex items-center"
              onClick={() => setIsOpen(false)}
            >
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              Home
            </Link>
            <Link 
              to="/blog" 
              className="px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300 flex items-center"
              onClick={() => setIsOpen(false)}
            >
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              Blog
            </Link>
            <Link 
              to="/about" 
              className="px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300 flex items-center"
              onClick={() => setIsOpen(false)}
            >
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              About Us
            </Link>
            <Link 
              to="/generate" 
              className="px-4 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium text-center shadow-md hover:shadow-blue-500/30 transition-all duration-300"
              onClick={() => setIsOpen(false)}
            >
              Generate Plan
            </Link>
            

          </div>
        </div>
      </div>
    </nav>
  );
}