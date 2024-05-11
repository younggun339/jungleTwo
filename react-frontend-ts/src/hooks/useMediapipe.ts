import { useEffect, useCallback } from 'react';
import { MutableRefObject } from 'react';
import { Body } from 'matter-js';
import { Camera } from "@mediapipe/camera_utils";
import { Hands, Results as HandsResults } from '@mediapipe/hands';
import { Pose, Results as PoseResults } from '@mediapipe/pose';
import { updateLsideSkeleton } from "../utils/updateLsideSkeleton";
import { updateRsideSkeleton } from "../utils/updateRsideSkeleton";
import { WebRTCResult } from './useWebRTC';


interface UseMediapipeProps {
  webcamRef: MutableRefObject<HTMLVideoElement | null>;
  indexRef: MutableRefObject<number>;
  peers: WebRTCResult["peers"];
  sendLeftHandJoint: WebRTCResult["sendLeftHandJoint"];
  sendRightHandJoint: WebRTCResult["sendRightHandJoint"];
  leftArmLeftRef: MutableRefObject<Body | null>;
  rightHand1RightRef: MutableRefObject<Body | null>;
  rightHand2RightRef: MutableRefObject<Body | null>;
  canvasSize: { x: number; y: number };
}

const useMediapipe = ({
  webcamRef,
  indexRef,
  peers,
  sendLeftHandJoint,
  sendRightHandJoint,
  leftArmLeftRef,
  rightHand1RightRef,
  rightHand2RightRef,
  canvasSize,
}: UseMediapipeProps) => {
  const onLeftsideResults = useCallback((results: PoseResults) => {
    if (indexRef.current === 0 && results.poseLandmarks && results.poseLandmarks.length > 0) {
      const landmarks = results.poseLandmarks;
      const joint1 = landmarks[15];
      const joint2 = landmarks[13];

      handleLeftsideBodyCoords(
        { x: joint1.x, y: joint1.y },
        { x: joint2.x, y: joint2.y }
      );
    }
  }, [indexRef, peers]);

  const onRightsideResults = useCallback((results: HandsResults) => {
    if (indexRef.current === 1 && results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      const hand = results.multiHandLandmarks[0];
      const joint1 = hand[0];
      const joint2 = hand[9];
      const joint3 = hand[12];

      handleRightsideBodyCoords(
        { x: joint1.x, y: joint1.y },
        { x: joint2.x, y: joint2.y },
        { x: joint3.x, y: joint3.y }
      );
    }
  }, [indexRef, peers]);

  useEffect(() => {
    let hands: Hands;
    let pose: Pose;
    let camera: Camera;

    try {
      hands = new Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
      });
      console.log(hands)
      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      hands.onResults(onRightsideResults);

      pose = new Pose({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
      });
      console.log(pose)
      pose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: false,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      pose.onResults(onLeftsideResults);

      if (webcamRef.current) {
        console.log(webcamRef.current.srcObject)
        console.log(webcamRef.current)
        camera = new Camera(webcamRef.current, {
          onFrame: async () => {
            // try {
            //   await hands.send({ image: webcamRef.current! });
            //   await pose.send({ image: webcamRef.current! });
            // } catch (error) {
            //   console.error("Error sending frame to Mediapipe:", error);
            // }
          },
          width: 800,
          height: 600,
        });
        camera.start();
      }
    } catch (error) {
      console.error("Error initializing Mediapipe:", error);
    }

    return () => {
      camera?.stop();
    };
  }, [onRightsideResults, onLeftsideResults]);

  const handleLeftsideBodyCoords = (joint1Start: any, joint1End: any) => {
    if (indexRef.current === 0) {
      updateLsideSkeleton(leftArmLeftRef, joint1Start, joint1End, canvasSize);
      sendLeftHandJoint({ joint1Start, joint1End });
    }
  };

  const handleRightsideBodyCoords = (joint1: any, joint2: any, joint3: any) => {
    if (indexRef.current === 1) {
      updateRsideSkeleton(rightHand1RightRef, joint1, joint2, canvasSize);
      updateRsideSkeleton(rightHand2RightRef, joint2, joint3, canvasSize);
      sendRightHandJoint({ joint1, joint2, joint3 });
    }
  };
};

export default useMediapipe;
