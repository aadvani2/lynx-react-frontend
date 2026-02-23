import React, { useEffect, useState } from 'react';

const LoadingComponent: React.FC = () => {
  const [viewportHeight, setViewportHeight] = useState('90vh');

  useEffect(() => {
    // Calculate 80% of viewport height on component mount
    const height = window.innerHeight * 0.8;
    setViewportHeight(`${height}px`);

    // Update height on window resize
    const handleResize = () => {
      const newHeight = window.innerHeight * 0.8;
      setViewportHeight(`${newHeight}px`);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      className="d-flex justify-content-center align-items-center w-100"
      style={{
        minHeight: viewportHeight,
        position: 'relative',
        margin: '0 auto'
      }}
    >
      <div className=" text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
        <span className="loader" />
      </div>
    </div>
  );
};

export default LoadingComponent;
