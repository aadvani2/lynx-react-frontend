
import React, { useState } from 'react';
import styles from './RequestSummaryCard.module.css';
import { format } from 'date-fns';
import { getBackendImageUrl } from '../../../../utils/urlUtils';
import ImagePreviewModal from '../../ImagePreviewModal/ImagePreviewModal';
import CheckmarkIcon from '../../../../assets/Icon/checkmark.svg';

interface RequestSummaryCardProps {
  schedule_msg: string;
  request_id: string;
  updated_at: string;
  services_name: string;
  description: string;
  city: string;
  state: string;
  zip_code: string;
  contact_person: string;
  phone: string;
  dial_code: string;
  full_address: string;
  files: string;
  RequestSummaryHeader: string;
}

const RequestSummaryCard: React.FC<RequestSummaryCardProps> = ({
  schedule_msg,
  request_id,
  updated_at,
  services_name,
  description,
  city,
  state,
  zip_code,
  contact_person,
  phone,
  dial_code,
  full_address,
  files,
  RequestSummaryHeader,
}) => {

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'dd MMM yyyy hh:mm a');
  };

  let parsedFiles: string[] = [];
  if (Array.isArray(files)) {
    parsedFiles = files;
  } else if (typeof files === "string" && files.trim() !== "") {
    try {
      const parsed = JSON.parse(files);
      if (Array.isArray(parsed)) {
        parsedFiles = parsed;
      }
    } catch (e) {
      console.error("Error parsing files JSON:", e);
    }
  }

  const [currentImageIndex, setCurrentImageIndex] = useState<number | null>(null);

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handleCloseModal = () => {
    setCurrentImageIndex(null);
  };

  const handleNavigate = (newIndex: number) => {
    setCurrentImageIndex(newIndex);
  };

  const backendImageUrls = parsedFiles.map(file => getBackendImageUrl(file));

  return (
    <div className={styles.frameWrapper}>
      <div className={styles.bodyFrameParent}>
        <div className={styles.bodyFrameWrapper}>
          <div className={styles.frameParent2}>
            <div className={styles.iconcheckmarkGroup}>
              <img className={styles.bodyIconcheckmark} alt="" src={CheckmarkIcon} />
              <b className={styles.bodyRequestSent}>{RequestSummaryHeader}</b>
            </div>
            <div className={styles.yourRequestHasBeenReceivedWrapper}>
              <div className={styles.yourRequestHas}>{schedule_msg}</div>
            </div>
            <div className={styles.request25101503864}>
              Request #{request_id} - Last updated on {formatDate(updated_at || '')}
            </div>
          </div>
        </div>
        <div className={styles.frameInner} />
        <div className={styles.frameWrapper2}>
          <div className={styles.serviceDetailsParent}>
            <b className={styles.bodyRequestSent}>Service Details</b>
            <div className={styles.frameParent3}>
              <div className={styles.requestedServicesParent}>
                <b className={styles.bodyButton}>Requested services</b>
                <div className={styles.plumbing}>{services_name || 'N/A'}</div>
              </div>
              <div className={styles.requestedServicesParent}>
                <b className={styles.bodyButton}>Additional details</b>
                <div className={styles.plumbing}>{description || 'N/A'}</div>
              </div>
              <div className={styles.requestedServicesParent}>
                <b className={styles.bodyButton}>Location</b>
                <div className={styles.plumbing}>{`${city || 'N/A'}, ${state || 'N/A'} ${zip_code || 'N/A'}, USA`}</div>
              </div>
              <div className={styles.requestedServicesParent}>
                <b className={styles.bodyButton}>Contact</b>
                <div className={styles.plumbing}>
                  {contact_person || 'N/A'}{' '}
                  {phone && (
                    <a className={styles.a} href={`tel:+${dial_code}${phone}`} target="_blank">
                      <span className={styles.span}> {dial_code}{phone}</span>
                    </a>
                  )}
                </div>
              </div>
              <div className={styles.requestedServicesParent}>
                <b className={styles.bodyButton}>Address</b>
                <div className={styles.plumbing}>{full_address || 'N/A'}</div>
              </div>
            </div>
          </div>
        </div>
        {backendImageUrls.length > 0 &&
          <>
            <div className={styles.frameInner} />
            <div className={styles.frameWrapper3}>
              <div className={styles.serviceDetailsParent}>
                <b className={styles.bodyRequestSent}>Attachments</b>
                <div className={styles.rectangleParent}>
                  {/* Render attachments dynamically if available */}
                  {backendImageUrls.map((imageUrl: string, index: number) => (
                    <img
                      className={styles.rectangleIcon}
                      alt=""
                      src={imageUrl}
                      key={index}
                      onClick={() => handleImageClick(index)}
                    />
                  ))}
                  {parsedFiles.length === 0 && <p>No attachments</p>}
                </div>
              </div>
            </div>
          </>
        }
      </div>
      <ImagePreviewModal
        images={backendImageUrls}
        currentIndex={currentImageIndex}
        onClose={handleCloseModal}
        onNavigate={handleNavigate}
      />
    </div>
  );
};

export default RequestSummaryCard;
