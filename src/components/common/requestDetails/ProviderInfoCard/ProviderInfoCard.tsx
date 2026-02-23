
import React from 'react';
import styles from './ProviderInfoCard.module.css';
import BackendImage from '../../BackendImage/BackendImage';
import PhoneIcon from "../../../../assets/Icon/phone.svg";
import MailIcon from "../../../../assets/Icon/mail.svg";

interface ProviderInfoCardProps {
  sub_category_name: string;
  handshake_provider_name: string;
  status_message: string;
  email?: string;
  phone?: string;
  dial_code?: string;
  showContactInfo?: boolean;
  providerImage?: string;
}

const ProviderInfoCard: React.FC<ProviderInfoCardProps> = ({
  sub_category_name,
  handshake_provider_name,
  status_message,
  email,
  phone,
  dial_code,
  showContactInfo = false,
  providerImage,
}) => {

  return (
    <div className={styles.provider}>
      <BackendImage
        src={providerImage}
        alt={handshake_provider_name || 'Provider'}
        className={styles.providerChild}
        placeholderText="No Image"
      />
      <div className={styles.proListing}>
        <div className={styles.plumbingWrapper}>
          <b className={styles.bodyPlumbing}>{sub_category_name || 'N/A'}</b>
        </div>
        <b className={styles.blueStarConstruction}>{handshake_provider_name || 'N/A'}</b>
        <div className={styles.bodyYourRequestHas}>{status_message || ""}</div>
        {showContactInfo && (
          <>
            <div className={styles.frameParent}>
              <div className={styles.iconmailParent}>
                <img className={styles.iconmail} alt="" src={MailIcon} />
                <div className={styles.lynxProvidergmailcom}>{email || 'N/A'}</div>
              </div>
              <div className={styles.iconmailParent}>
                <img className={styles.iconmail} alt="" src={PhoneIcon} />
                <div className={styles.lynxProvidergmailcom}>
                  {dial_code && <span className={styles.phoneNumber}>{dial_code}{" "}{phone || 'N/A'}</span>}
                  {!dial_code && phone && <span className={styles.phoneNumber}>{phone}</span>}
                  {!dial_code && !phone && 'N/A'}
                </div>
              </div>
            </div>
            <div className={styles.proListingButton}>
              <b className={styles.button2}>Message Provider</b>
            </div>
          </>
        )}
        <div className={styles.button6} />
      </div>
    </div>
  );
};

export default ProviderInfoCard;
