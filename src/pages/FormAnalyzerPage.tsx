import React from 'react';
import { FormAnalyzer } from '../components/FormAnalyzer';
import { useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FormAnalyzerPage = () => {
  const { exercise } = useParams<{ exercise?: string }>();
  const exerciseName = exercise || 'Squat';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link 
        to="/generate" 
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <ArrowLeft className="mr-2" /> Back to Workout Generator
      </Link>
      
      <h1 className="text-3xl font-bold mb-6">Form Analyzer: {exerciseName}</h1>
      <p className="mb-6">Position yourself 2-3 meters from the camera</p>
      
      <FormAnalyzer 
        exerciseName={exerciseName} 
        onAnalysisComplete={(feedback) => console.log(feedback)} 
      />
    </div>
  );
};