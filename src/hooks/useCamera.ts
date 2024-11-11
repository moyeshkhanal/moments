// src/hooks/useCamera.ts

import { useRef, useState, useEffect } from 'react';
import logger from '@/lib/logger';

interface CameraOptions {
  facingMode?: 'user' | 'environment';
  idealWidth?: number;
  idealHeight?: number;
}

const useCamera = (options: CameraOptions = {}) => {
  const { facingMode = 'environment', idealWidth = 1280, idealHeight = 720 } = options;

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraError, setCameraError] = useState<string>('');

  const startCamera = async () => {
    setCameraError('');

    const constraints = {
      video: {
        facingMode: { ideal: facingMode },
        width: { ideal: idealWidth, max: 1920 },
        height: { ideal: idealHeight, max: 1080 },
        frameRate: { ideal: 30, max: 60 },
      },
      audio: false,
    };

    try {
      if (
        typeof navigator !== 'undefined' &&
        navigator.mediaDevices &&
        typeof navigator.mediaDevices.getUserMedia === 'function'
      ) {
        logger.info("Navigator", navigator.mediaDevices.getUserMedia);
        const stream = await navigator.mediaDevices.getUserMedia(constraints);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } else {
        setCameraError('Camera not supported on this device or browser.');
      }
    } catch (error: unknown) { // Type is now unknown
        if (error instanceof DOMException) {
          if (error.name === 'NotAllowedError') {
            setCameraError('Permission denied. Please allow camera access.');
          } else if (error.name === 'NotFoundError') {
            setCameraError('No camera device found.');
          } else {
            setCameraError('Error accessing camera.');
          }
          console.error('Camera error:', error.message);
        } else {
          // Handle or log unexpected errors
          setCameraError('An unexpected error occurred.');
          console.error('Unexpected error:', error);
        }
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return { videoRef, startCamera, stopCamera, cameraError };
};

export default useCamera;
