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
      console.log(joint1.x, joint2.x);

      handleLeftsideBodyCoords(
        { x: joint1.x, y: joint1.y },
        { x: joint2.x, y: joint2.y }
      );
    }
  }, [indexRef, peers]);

  const onRightsideResults = useCallback((results: HandsResults) => {
    console.log("onRightsideResults");
    console.log(results);
    if (indexRef.current === 1 && results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      const hand = results.multiHandLandmarks[0];
      const joint1 = hand[0];
      const joint2 = hand[9];
      const joint3 = hand[12];
      console.log(joint1.x, joint2.x, joint3.x);

      handleRightsideBodyCoords(
        { x: joint1.x, y: joint1.y },
        { x: joint2.x, y: joint2.y },
        { x: joint3.x, y: joint3.y }
      );
    }
  }, [indexRef, peers]);

  // Hands 초기화 및 설정 함수
  const initializeHands = (onResults: (results: HandsResults) => void) => {
    const hands = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });



    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    hands.onResults(onResults);

    return hands;
  };

  // Pose 초기화 및 설정 함수
  const initializePose = (onResults: (results: PoseResults) => void) => {
    const pose = new Pose({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });

    console.log("Pose:", pose);

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    pose.onResults(onResults);

    return pose;
  };

  // useEffect for initializing and using Mediapipe Hands
  useEffect(() => {
    if (indexRef.current === 1) {
    const hands = initializeHands(onRightsideResults);
    // console.log("Is hands!")
    console.log(webcamRef.current);
    if (webcamRef.current) {
      const camera = new Camera(webcamRef.current, {
        onFrame: async () => {
          try {
            await hands.send({ image: webcamRef.current! });
          } catch (error) {
            console.error("Error sending frame to Mediapipe Hands:", error);
          }
        },
        width: 800,
        height: 600,
      });
      camera.start();

      return () => {
        camera.stop();
      };
    }
  }
  }, [onRightsideResults, webcamRef]);

  // useEffect for initializing and using Mediapipe Pose
  useEffect(() => {
      if (indexRef.current === 0) {
      const pose = initializePose(onLeftsideResults);
      console.log(webcamRef.current);
      if (webcamRef.current) {
        const camera = new Camera(webcamRef.current, {
          onFrame: async () => {
            try {
              await pose.send({ image: webcamRef.current! });
            } catch (error) {
              console.error("Error sending frame to Mediapipe Pose:", error);
            }
          },
          width: 800,
          height: 600,
        });
        camera.start();

        return () => {
          camera.stop();
        };
      }
  }
  }, [onLeftsideResults, webcamRef]);

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
