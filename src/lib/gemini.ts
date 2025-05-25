

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI("AIzaSyBPiwXSbNhHAobNayoCNUDherCfUZbGz9w");

export async function generateWorkoutPlan(
  goal: string,
  fitnessLevel: string,
  timeAvailable: string,
  equipment: string[],
  location: string
): Promise<string> {
 
  const prompt = `Create a detailed workout plan with the following parameters:
    Goal: ${goal}
    Location: ${location}
    Fitness Level: ${fitnessLevel}
    Time Available: ${timeAvailable}
    Equipment Available: ${equipment.join(', ')}

    Provide the workout plan in plain text, structured as follows.  Follow this structure *exactly*.

    1.  Warm-up (${timeAvailable}):
        - Exercise 1: (Description of warm-up exercise)
        - Exercise 2: (Description of warm-up exercise)
        - Exercise 3: (Description of warm-up exercise)

          Include at least 1-2 warm-up workout exercises. like cardio 

    2.  Main Workout (${timeAvailable}):
        For each exercise, provide:
        - Exercise Name (with target muscle group):
            - Sets: #
            - Reps: #-#
            - Rest: # seconds
            - Description: (Detailed description of how to perform the exercise, and modifications based on equipment and location)
        Example:
        - Banded Chest Press (Chest, Shoulders):
            - Sets: 3
            - Reps: 10-12
            - Rest: 60 seconds
            - Description: Secure the resistance band around your back and hold the ends in your hands. Lie on your back and press the band upwards, as if doing a chest press. Focus on controlled movements.  If at a gym, a bench press machine can be used for stability.

        Include at least 3-5 main workout exercises.

    3.  Cool-down (${timeAvailable}):
        - Stretch 1: (Description of cool-down stretch)
        - Stretch 2: (Description of cool-down stretch)
        - Stretch 3: (Description of cool-down stretch)


          Include at least 1-2 cooldown  workout exercises.
    Total workout duration: Approximately ${timeAvailable}

    Notes:
    -   Provide detailed descriptions for each exercise and stretch.
    -   Tailor the exercises to the specified equipment and location.  If location is a gym, include machine exercises where appropriate.
    -   Specify sets, reps, and rest times for each main workout exercise.
    -   Focus on proper form and technique in the descriptions.
    -   The response should be plain text and easily parsable by a program. Do not include any extra formatting.
    -   The time in the heading (e.g., Warm-up (5 minutes)) should be approximate.
    `;


  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}