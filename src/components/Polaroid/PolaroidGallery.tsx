// src/components/PolaroidGallery.tsx

'use client';

import React, { useRef } from 'react';
import { useSwipeable } from 'react-swipeable';
import { useAlbumImages } from '@/hooks/useAlbumImages';
import Polaroid from '@/components/Polaroid/Polaroid';
import styles from './PolaroidGallery.module.css';

interface PolaroidGalleryProps {
  albumName?: string;
}

const PolaroidGallery: React.FC<PolaroidGalleryProps> = ({ albumName = '' }) => {
  const { images, loading } = useAlbumImages(albumName);
  const containerRef = useRef<HTMLDivElement>(null);

  // Swipe handlers for mobile carousel
  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (containerRef.current) {
        containerRef.current.scrollBy({ left: containerRef.current.clientWidth, behavior: 'smooth' });
      }
    },
    onSwipedRight: () => {
      if (containerRef.current) {
        containerRef.current.scrollBy({ left: -containerRef.current.clientWidth, behavior: 'smooth' });
      }
    },
    trackMouse: true,
  });

  if (loading) {
    return <div>Loading images...</div>;
  }

  if (images.length === 0) {
    return <div>No images found.</div>;
  }

  return (
    <div className={styles.galleryContainer} ref={containerRef} {...handlers}>
      {images.map((image, index) => (
        <Polaroid key={image.url} image={image} />
      ))}
    </div>
  );
};

export default PolaroidGallery;
