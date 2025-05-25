import React, { useRef, useEffect, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import * as poseDetection from '@tensorflow-models/pose-detection';
import '@tensorflow/tfjs-backend-webgl';
import { motion } from 'framer-motion';

interface FormAnalyzerProps {
  exerciseName: string;
  onAnalysisComplete: (feedback: string) => void;
}

const videoConstraints = {
  width: 640,
  height: 480,
  facingMode: 'user',
};

type ExerciseType = 'pushup' | 'bicep-curl';

export const FormAnalyzer: React.FC<FormAnalyzerProps> = ({
  exerciseName,
  onAnalysisComplete,
}) => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const detectorRef = useRef<poseDetection.PoseDetector | null>(null);
  const animationFrameIdRef = useRef<number>();

  const [isModelLoading, setIsModelLoading] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('Align yourself in the frame');
  const [repCount, setRepCount] = useState(0);
  const [exerciseState, setExerciseState] = useState<'up' | 'down'>('up');
  const [selectedExercise, setSelectedExercise] = useState<ExerciseType>('pushup');
  const [lastRepTime, setLastRepTime] = useState<number>(0);

  // Load TensorFlow model
  useEffect(() => {
    const loadModel = async () => {
      await tf.setBackend('webgl');
      await tf.ready();
      detectorRef.current = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet,
        {
          modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER,
        }
      );
      setIsModelLoading(false);
    };

    loadModel().catch(err => console.error('Model loading error:', err));

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      if (detectorRef.current) {
        detectorRef.current.dispose();
      }
    };
  }, []);

  // Angle calculation
  const getAngle = (a: poseDetection.Keypoint, b: poseDetection.Keypoint, c: poseDetection.Keypoint): number => {
    const ab = { x: b.x - a.x, y: b.y - a.y };
    const cb = { x: b.x - c.x, y: b.y - c.y };
    const dot = ab.x * cb.x + ab.y * cb.y;
    const magAB = Math.sqrt(ab.x ** 2 + ab.y ** 2);
    const magCB = Math.sqrt(cb.x ** 2 + cb.y ** 2);
    const angle = Math.acos(dot / (magAB * magCB));
    return (angle * 180) / Math.PI;
  };

  // Draw lines between keypoints
  const drawLines = (
    ctx: CanvasRenderingContext2D,
    keypoints: Record<string, poseDetection.Keypoint>,
    connections: [string, string][]
  ) => {
    ctx.strokeStyle = '#00FF00';
    ctx.lineWidth = 2;

    connections.forEach(([start, end]) => {
      if (keypoints[start] && keypoints[end] && 
          keypoints[start].score && keypoints[start].score > 0.3 &&
          keypoints[end].score && keypoints[end].score > 0.3) {
        ctx.beginPath();
        ctx.moveTo(keypoints[start].x, keypoints[start].y);
        ctx.lineTo(keypoints[end].x, keypoints[end].y);
        ctx.stroke();
      }
    });
  };

  // Push-up analysis
  const analyzePushup = (keypoints: Record<string, poseDetection.Keypoint>) => {
    if (!keypoints['left_shoulder'] || !keypoints['right_shoulder'] || 
        !keypoints['left_wrist'] || !keypoints['right_wrist']) {
      setFeedback('Ensure your arms and shoulders are visible');
      return;
    }

    const leftArmAngle = getAngle(
      keypoints['left_elbow'],
      keypoints['left_shoulder'],
      keypoints['left_wrist']
    );

    const rightArmAngle = getAngle(
      keypoints['right_elbow'],
      keypoints['right_shoulder'],
      keypoints['right_wrist']
    );

    const avgArmAngle = (leftArmAngle + rightArmAngle) / 2;

    if (avgArmAngle > 160) {
      setFeedback('Top position - lower yourself slowly');
    } else if (avgArmAngle < 90) {
      setFeedback('Bottom position - push up!');
    } else {
      setFeedback('Good form - keep going!');
    }

    if (avgArmAngle > 160 && exerciseState === 'down') {
      setExerciseState('up');
      setRepCount(prev => {
        const newCount = prev + 1;
        onAnalysisComplete(`Push-up ${newCount} complete!`);
        return newCount;
      });
    }

    if (avgArmAngle < 90 && exerciseState === 'up') {
      setExerciseState('down');
    }
  };

  // Bicep curl analysis with debounce
  const analyzeBicepCurl = (keypoints: Record<string, poseDetection.Keypoint>) => {
    if (!keypoints['left_shoulder'] || !keypoints['left_elbow'] || !keypoints['left_wrist']) {
      setFeedback('Ensure your left arm is fully visible');
      return;
    }

    const angle = getAngle(
      keypoints['left_shoulder'],
      keypoints['left_elbow'],
      keypoints['left_wrist']
    );

    if (angle > 160) {
      setFeedback('Arm extended - curl up!');
      setExerciseState('down');
    } else if (angle < 30) {
      setFeedback('Arm curled - lower slowly');
      
      // Only count if we were previously in the extended position
      // and enough time has passed since last rep (debounce)
      const now = Date.now();
      if (exerciseState === 'down' && now - lastRepTime > 1000) {
        setExerciseState('up');
        setRepCount(prev => {
          const newCount = prev + 1;
          onAnalysisComplete(`Bicep curl ${newCount} complete!`);
          return newCount;
        });
        setLastRepTime(now);
      }
    } else {
      setFeedback('Good form - keep going!');
    }
  };

  // Form analysis router
  const analyzeForm = (poses: poseDetection.Pose[], exercise: string) => {
    if (poses.length === 0) {
      setFeedback('No person detected - move into frame');
      return;
    }

    const pose = poses[0];
    const keypoints = pose.keypoints.reduce((acc, k) => {
      if (k.name) acc[k.name] = k;
      return acc;
    }, {} as Record<string, poseDetection.Keypoint>);

    const visibleKeypoints = pose.keypoints.filter(k => k.score && k.score > 0.3);
    if (visibleKeypoints.length < 10) {
      setFeedback('More of your body needs to be visible');
      return;
    }

    switch(selectedExercise) {
      case 'pushup':
        analyzePushup(keypoints);
        break;
      case 'bicep-curl':
        analyzeBicepCurl(keypoints);
        break;
      default:
        setFeedback(`Exercise ${exercise} not supported`);
    }

    return keypoints;
  };

  // Pose detection loop
  const detectPose = useCallback(async () => {
    if (!webcamRef.current || !canvasRef.current || isModelLoading) return;

    const video = webcamRef.current.video;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!video || !ctx || !detectorRef.current) return;

    try {
      const poses = await detectorRef.current.estimatePoses(video);
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      if (poses.length > 0) {
        const pose = poses[0];
        const keypoints = pose.keypoints.reduce((acc, k) => {
          if (k.name) acc[k.name] = k;
          return acc;
        }, {} as Record<string, poseDetection.Keypoint>);

        // Draw keypoints
        pose.keypoints.forEach(kp => {
          if (kp.score && kp.score > 0.3) {
            ctx.beginPath();
            ctx.arc(kp.x, kp.y, 5, 0, 2 * Math.PI);
            ctx.fillStyle = '#FF0000';
            ctx.fill();
          }
        });

        // Draw lines for arms
        drawLines(ctx, keypoints, [
          ['left_shoulder', 'left_elbow'],
          ['left_elbow', 'left_wrist'],
          ['right_shoulder', 'right_elbow'],
          ['right_elbow', 'right_wrist']
        ]);

        analyzeForm(poses, exerciseName);
      }
      
      animationFrameIdRef.current = requestAnimationFrame(detectPose);
    } catch (error) {
      console.error('Pose detection error:', error);
    }
  }, [isModelLoading, exerciseName, selectedExercise, lastRepTime]);

  // Start detection when model is ready
  useEffect(() => {
    if (!isModelLoading) {
      detectPose();
    }
  }, [isModelLoading, detectPose]);

  const handleExerciseChange = (exercise: ExerciseType) => {
    setSelectedExercise(exercise);
    setRepCount(0);
    setExerciseState('up');
    setLastRepTime(0);
    setFeedback(`Ready for ${exercise === 'pushup' ? 'push-up' : 'bicep curl'}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative max-w-3xl mx-auto"
    >
      {cameraError ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {cameraError}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Exercise selector fixed at top */}
          <div className="bg-gray-50 p-4 border-b">
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => handleExerciseChange('pushup')}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  selectedExercise === 'pushup'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                Push-ups
              </button>
              <button
                onClick={() => handleExerciseChange('bicep-curl')}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  selectedExercise === 'bicep-curl'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                Bicep Curls
              </button>
            </div>
          </div>

          {/* Camera feed and analysis */}
          <div className="p-4">
            <div className="relative">
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                onUserMediaError={(err) =>
                  setCameraError(typeof err === 'string' ? err : err.message)
                }
                className="w-full h-auto rounded-lg border border-gray-200"
              />
              <canvas
                ref={canvasRef}
                width={videoConstraints.width}
                height={videoConstraints.height}
                className="absolute top-0 left-0 w-full h-auto pointer-events-none"
              />
            </div>

            {/* Feedback panel */}
            <div className="mt-4 bg-blue-50 rounded-lg p-4">
              <div className="text-center">
                <div className="text-lg font-semibold text-blue-800 mb-2">
                  {isModelLoading ? 'Loading pose detection...' : feedback}
                </div>
                <div className="text-2xl font-bold text-green-700">
                  Reps: {repCount}
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  Current exercise: {selectedExercise === 'pushup' ? 'Push-ups' : 'Bicep Curls'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};