import * as tf from '@tensorflow/tfjs';
import * as poseDetection from '@tensorflow-models/pose-detection';
import { movenet } from '@tensorflow-models/pose-detection';

export async function setupPoseDetection() {
  await tf.ready();
  const detector = await poseDetection.createDetector(
    poseDetection.SupportedModels.MoveNet,
    {
      modelType: movenet.modelType.SINGLEPOSE_THUNDER,
      enableSmoothing: true
    }
  );
  return detector;
}