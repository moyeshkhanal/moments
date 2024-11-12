// src/components/Polaroid.tsx

import React from 'react';
import styles from './PolaroidGallery.module.css';

interface ImageData {
  url: string;
  name: string;
}

interface PolaroidProps {
  image: ImageData;
}

const Polaroid: React.FC<PolaroidProps> = ({ image }) => {
  return (
    <div className={styles.polaroid}>
      <img src={image.url} alt={image.name} />
      <div className={styles.caption}>{image.name}</div>
    </div>
  );
};

export default Polaroid;
