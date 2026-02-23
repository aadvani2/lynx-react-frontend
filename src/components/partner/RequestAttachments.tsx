import React, { useState } from 'react';
import { getBackendImageUrl } from '../../utils/urlUtils';
import ImagePreviewModal from '../common/ImagePreviewModal/ImagePreviewModal';

interface RequestAttachmentsProps {
  files?: string[];
}

const RequestAttachments: React.FC<RequestAttachmentsProps> = ({ files = [] }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState<number | null>(null);

  if (!files || files.length === 0) return null;

  const backendImageUrls = files.map(file => getBackendImageUrl(file));

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
        {files.map((file, idx) => (
          <img
            key={file + idx}
            src={getBackendImageUrl(file)}
            alt={`Attachment ${idx + 1}`}
            className="img-fluid rounded"
            style={{ 
              width: 100, 
              height: 100, 
              objectFit: 'cover', 
              objectPosition: 'center',
              cursor: 'pointer'
            }}
            onClick={() => handleImageClick(idx)}
          />
        ))}
      </div>
      <ImagePreviewModal
        images={backendImageUrls}
        currentIndex={currentImageIndex}
        onClose={handleCloseModal}
        onNavigate={handleNavigate}
      />
    </>
  );
};

export default RequestAttachments;
