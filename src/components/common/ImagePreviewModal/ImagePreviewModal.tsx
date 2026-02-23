import React, { useEffect, useRef } from 'react';
import styles from './ImagePreviewModal.module.css';

interface ImagePreviewModalProps {
  images: string[];
  currentIndex: number | null;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({ images, currentIndex, onClose, onNavigate }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (currentIndex !== null) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [currentIndex, onClose]);

  if (currentIndex === null || images.length === 0) return null;

  const currentImageUrl = images[currentIndex];
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < images.length - 1;

  const handlePrev = () => {
    if (hasPrev) {
      onNavigate(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      onNavigate(currentIndex + 1);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent} ref={modalRef}>
        <button className={styles.closeButton} onClick={onClose}>&times;</button>
        <img src={currentImageUrl} alt="Preview" className={styles.modalImage} />
        {hasPrev && (
          <button className={`${styles.navButton} ${styles.prevButton}`} onClick={handlePrev}>&larr;</button>
        )}
        {hasNext && (
          <button className={`${styles.navButton} ${styles.nextButton}`} onClick={handleNext}>&rarr;</button>
        )}
      </div>
    </div>
  );
};

export default ImagePreviewModal;
