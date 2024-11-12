import React from 'react';

interface PolaroidFrameProps {
  children: React.ReactNode;
}

const PolaroidFrame: React.FC<PolaroidFrameProps> = ({ children }) => {
  return (
    <div className="relative w-[300px] h-[400px] overflow-hidden">
      {children}
      <img 
        src="/polaroid-frame.png" 
        alt="Polaroid Frame" 
        className="absolute inset-0 w-full h-full pointer-events-none"
    
      />
    </div>
  );
};

export default PolaroidFrame;
