// src/components/PolaroidCamera.tsx
"use client";

import React, { useRef, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import useCamera from '@/hooks/useCamera';
import PolaroidFrame from './PolaroidFrame';

interface PolaroidCameraProps {
  albumName: string;
}

const PolaroidCamera: React.FC<PolaroidCameraProps> = ({ albumName }) => {
  const { videoRef, startCamera, stopCamera, cameraError } = useCamera();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
  
      if (context) {
        // Get the displayed size of the video element
        const videoStyles = window.getComputedStyle(video);
        const videoDisplayWidth = parseFloat(videoStyles.getPropertyValue('width'));
        const videoDisplayHeight = parseFloat(videoStyles.getPropertyValue('height'));
  
        // Set canvas dimensions to match the video element's displayed size
        canvas.width = videoDisplayWidth;
        canvas.height = videoDisplayHeight;
  
        // Calculate the aspect ratios
        const videoAspectRatio = video.videoWidth / video.videoHeight;
        const displayAspectRatio = videoDisplayWidth / videoDisplayHeight;
  
        let sx = 0, sy = 0, sWidth = video.videoWidth, sHeight = video.videoHeight;
  
        if (videoAspectRatio > displayAspectRatio) {
          // Video is wider than display area
          sWidth = video.videoHeight * displayAspectRatio;
          sx = (video.videoWidth - sWidth) / 2;
        } else if (videoAspectRatio < displayAspectRatio) {
          // Video is taller than display area
          sHeight = video.videoWidth / displayAspectRatio;
          sy = (video.videoHeight - sHeight) / 2;
        }
  
        // Draw the video frame to the canvas
        context.drawImage(
          video,
          sx, sy, sWidth, sHeight, // Source rectangle
          0, 0, canvas.width, canvas.height // Destination rectangle
        );
  
        // Draw the polaroid frame
        const polaroidImage = new Image();
        polaroidImage.src = '/polaroid-frame.png';
        polaroidImage.onload = () => {
          context.drawImage(polaroidImage, 0, 0, canvas.width, canvas.height);
          const imageData = canvas.toDataURL('image/png');
          setCapturedImage(imageData);
          stopCamera();
        };
      }
    }
  };
  

  const retakePhoto = () => {
    setCapturedImage(null);

  };

  const handleUpload = async () => {
    if (capturedImage) {
      try {
        setIsUploading(true);
        const response = await fetch(capturedImage);
        const blob = await response.blob();
  
        const fileExt = 'png';
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `${albumName}/${fileName}`;
  
        const {error: uploadError } = await supabase.storage
          .from('albums')
          .upload(filePath, blob);
  
        if (uploadError) {
          throw uploadError;
        }
  
        const { data: publicUrlData} = supabase.storage
          .from('albums')
          .getPublicUrl(filePath);
  
  
        const publicURL = publicUrlData.publicUrl;
  
        if (publicURL) {
          const { error } = await supabase.from('album_photos').insert({
            url: publicURL,
            album_name: albumName,
          });
  
          if (error) {
            console.error('Supabase error:', error);
            alert('Photo uploaded but failed to save to database.');
            return;
          }
  
          alert('Photo uploaded successfully!');
          setCapturedImage(null);
        } else {
          throw new Error('Failed to get public URL');
        }
      } catch (error) {
        console.error('Upload failed:', error);
        alert('Failed to upload photo.');
      } finally {
        setIsUploading(false);
      }
    }
  };

  useEffect(() => {
    if (!capturedImage) {
      startCamera();
    }

    return () => {
      stopCamera();
    };
  }, [capturedImage]);

  return (
    <div className="relative">
      {cameraError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {cameraError}
        </div>
      )}
      
      {!capturedImage ? (
        <div className="camera-container flex flex-col items-center">
          <PolaroidFrame>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="object-cover w-full h-full"

            />
          </PolaroidFrame>
          <canvas 
            ref={canvasRef} 
            width="310" 
            height="420" 
            style={{ display: 'none' }} 
          />
          <button 
            onClick={capturePhoto}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            disabled={!!cameraError}
          >
            Capture
          </button>
        </div>
      ) : (
        <div className="captured-image-container flex flex-col items-center">
          <img 
            src={capturedImage} 
            alt="Captured" 
            width="300" 
            height="400"
            style={{ maxWidth: '100%', maxHeight: '100vh' }} 
          />
          <div className="flex gap-2 mt-4">
            <button 
              onClick={handleUpload} 
              disabled={isUploading}
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              {isUploading ? 'Uploading...' : 'Upload'}
            </button>
            <button 
              onClick={retakePhoto}
              className="px-4 py-2 bg-gray-500 text-white rounded"
            >
              Retake
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PolaroidCamera;
