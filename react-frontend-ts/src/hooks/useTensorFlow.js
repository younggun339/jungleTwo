// useTensorFlow.js
import { useEffect, useCallback } from 'react';
import * as posenet from '@tensorflow-models/posenet';
import * as tf from '@tensorflow/tfjs';
// import * as tf from '@tensorflow/tfjs';
// import '@tensorflow/tfjs-backend-webgl';
import { updateLsideSkeleton } from "../utils/updateSkeleton";
import { updateRsideSkeleton } from "../utils/updateRsideSkeleton";

const useTensorFlow = (
  userVideo,
  indexRef,
  peers,
  sendLeftHandJoint,
  sendRightHandJoint,
  leftArmLeftRef,
  rightHand1RightRef,
  canvasSize,
  isMyCamLoaded,
) => {

  const onLeftsideResults = useCallback((pose) => {
    if (indexRef.current === 0 && pose && pose.keypoints) {
      const keypoints = pose.keypoints;
      const joint1 = keypoints.find(point => point.part === 'rightWrist');
      const joint2 = keypoints.find(point => point.part === 'leftWrist');

      if (joint1 && joint2) {
        handleLeftsideBodyCoords(joint1.position, joint2.position);
      }
    }
  }, [indexRef, peers]);

  const onRightsideResults = useCallback((pose) => {
    if (indexRef.current === 1 && pose && pose.keypoints) {
      const keypoints = pose.keypoints;
      const joint1 = keypoints.find(point => point.part === 'rightWrist');
      const joint2 = keypoints.find(point => point.part === 'leftWrist');

      if (joint1 && joint2) {
        handleRightsideBodyCoords(
          { x: joint1.position.x, y: joint1.position.y },
          { x: joint2.position.x, y: joint2.position.y }
        );
      }
    }
  }, [indexRef, peers]);

  useEffect(() => {
    const initializeBackendAndModels = async () => {
      const loadPoseNetModel = async () => {
        const net = await posenet.load({
          inputResolution: { width: canvasSize.x / 2, height: canvasSize.y },
          outputStride: 16,
          scale: 1.0,
        });
        const camera = userVideo.current;
        camera.width = canvasSize.x / 2;
        camera.height = canvasSize.y;

        const detectPose = async () => {
          if (camera && net) {
            try {
              if (camera.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA) {
                const pose = await net.estimateSinglePose(camera, {
                  flipHorizontal: false,
                });
                if (indexRef.current === 0) {
                  onLeftsideResults(pose);
                } else if (indexRef.current === 1) {
                  onRightsideResults(pose);
                }
              } else {
                console.error("Camera not ready", camera.readyState);
              }
            } catch (error) {
              console.error("Error detecting pose:", error);
            }
          }
        };

        // Set interval to call detectPose every 1000 milliseconds (1 second)
        const intervalId = setInterval(detectPose, 200);

        // Cleanup function to clear the interval
        return () => clearInterval(intervalId);
      };

      loadPoseNetModel();
    };

    if (isMyCamLoaded && userVideo.current) {
      initializeBackendAndModels();
    }
  }, [isMyCamLoaded, indexRef]);

  const handleLeftsideBodyCoords = (joint1Start, joint1End) => {
    if (indexRef.current === 0) {
      updateLsideSkeleton(leftArmLeftRef, joint1Start, joint1End, canvasSize);
      sendLeftHandJoint({ joint1Start, joint1End });
    }
  };

  const handleRightsideBodyCoords = (joint1Start, joint1End) => {
    if (indexRef.current === 1) {
      updateRsideSkeleton(rightHand1RightRef, joint1Start, joint1End, canvasSize);
      sendRightHandJoint({ joint1Start, joint1End });
    }
  };
};

export default useTensorFlow;
