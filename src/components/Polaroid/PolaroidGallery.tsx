'use client';

import React, { useRef } from 'react';
import { useSwipeable } from 'react-swipeable';
import { useAlbumImages } from '@/hooks/useAlbumImages';
import Polaroid from './Polaroid';
import styles from './PolaroidGallery.module.css';

interface PolaroidGalleryProps {
  albumName?: string;
}

const PolaroidGallery: React.FC<PolaroidGalleryProps> = ({ albumName = '' }) => {
  const { images, loading } = useAlbumImages(albumName);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (containerRef.current) {
        containerRef.current.scrollBy({
          left: containerRef.current.clientWidth,
          behavior: 'smooth',
        });
      }
    },
    onSwipedRight: () => {
      if (containerRef.current) {
        containerRef.current.scrollBy({
          left: -containerRef.current.clientWidth,
          behavior: 'smooth',
        });
      }
    },
    trackMouse: true,
  });

  const { ref: swipeableRef, ...restHandlers } = handlers;

  const combinedRef = (el: HTMLDivElement | null) => {
    containerRef.current = el;
    if (typeof swipeableRef === 'function') {
      swipeableRef(el);
    } else if (swipeableRef && 'current' in swipeableRef) {
      (swipeableRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
    }
  };

  if (loading) {
    return <div>Loading images...</div>;
  }

  if (images.length === 0) {
    return <div>No images found.</div>;
  }

  return (
    <div
      className={styles.galleryContainer}
      ref={combinedRef}
      {...restHandlers}
    >
      {images.map((image) => (
        <Polaroid key={image.url} image={image} />
      ))}
    </div>
  );
};

export default PolaroidGallery;
