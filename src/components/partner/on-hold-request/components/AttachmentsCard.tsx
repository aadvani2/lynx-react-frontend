import React, { useState } from 'react';
import ImagePreviewModal from '../../../common/ImagePreviewModal/ImagePreviewModal';

interface AttachmentsCardProps {
  files?: Array<{ url: string; thumb?: string }>;
}

const AttachmentsCard: React.FC<AttachmentsCardProps> = ({ files }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState<number | null>(null);

  if (!files || files.length === 0) {
    return <p className="text-muted">No attachments found.</p>;
  }

  const imageUrls = files.map(file => file.url);

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handleCloseModal = () => {
    setCurrentImageIndex(null);
  };

  const handleNavigate = (newIndex: number) => {
    setCurrentImageIndex(newIndex);
  };

  return (
    <>
      <div className="d-flex flex-row flex-wrap justify-content-start gap-3">
        {files.map((file, index) => (
          <img
            key={index}
            src={file.thumb || file.url}
            alt="Attachment"
            className="img-fluid rounded"
            style={{ 
              width: '100px', 
              height: '100px', 
              objectFit: 'cover', 
              objectPosition: 'center',
              cursor: 'pointer'
            }}
            onClick={() => handleImageClick(index)}
          />
        ))}
      </div>
      <ImagePreviewModal
        images={imageUrls}
        currentIndex={currentImageIndex}
        onClose={handleCloseModal}
        onNavigate={handleNavigate}
      />
    </>
  );
};

export default AttachmentsCard;
