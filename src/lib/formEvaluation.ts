// src/lib/formEvaluation.ts
export function evaluateForm(poses, exerciseName) {
    const currentExercise = EXERCISE_LIBRARY[exerciseName];
    const userAngles = calculateJointAngles(poses[0].keypoints);
    
    const feedback = currentExercise.idealAngles.map((ideal, i) => {
      const tolerance = 15; // Degrees
      const current = userAngles[i];
      
      if (Math.abs(current - ideal) > tolerance) {
        return `Adjust ${currentExercise.keypoints[i]} angle: ${current}° → ${ideal}°`;
      }
      return null;
    }).filter(Boolean);
  
    return feedback;
  }
  
  function calculateJointAngles(keypoints) {
    // Vector math to calculate angles between joints
    // Example: Knee angle = angle between hip-knee-ankle vectors
  }