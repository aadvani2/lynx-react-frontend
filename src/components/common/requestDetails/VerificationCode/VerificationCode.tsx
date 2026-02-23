import React from 'react';
import styles from './VerificationCode.module.css';
import Swal from 'sweetalert2';
import CopyIcon from '../../../../assets/Icon/copy.svg';
import InfoIcon from '../../../../assets/Icon/Clip path group.svg';

interface VerificationCodeProps {
  verification_code: string;
}

const VerificationCode: React.FC<VerificationCodeProps> = ({
  verification_code,
}) => {
  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(verification_code);
      Swal.fire({
        icon: 'success',
        title: 'Copied!',
        text: 'Verification code copied to clipboard!',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error('Failed to copy: ', err);
      Swal.fire({
        icon: 'error',
        title: 'Copy Failed',
        text: 'Failed to copy verification code.',
      });
    }
  };

  return (
    <div className={styles.verificationCode}>
      <div className={styles.verificationCodeInner}>
        <div className={styles.frameWrapper}>
          <div className={styles.verificationCodeInner}>
            <b className={styles.b}>Verification Code</b>
          </div>
        </div>
      </div>
      <div className={styles.frameParent}>
        <div className={styles.frameGroup}>
          <div className={styles.frameContainer}>
            <div className={styles.provideThisVerificationCodeWrapper}>
              <div className={styles.provideThisVerification}>Provide this verification code to the service partner upon arrival at your location</div>
            </div>
          </div>
          <div className={styles.frameDiv}>
            <div className={styles.wrapper}>
              <b className={styles.b}>{verification_code}</b>
            </div>
            <img
              className={`${styles.iconcopy} ${styles.copyIconHover}`}
              alt="Copy"
              src={CopyIcon}
              onClick={handleCopyClick}
            />
            <div className={styles.button} />
          </div>
        </div>
        <div className={styles.verificationCodeFrameWrapper}>
          <div className={styles.iconinfoParent}>
            <img className={styles.iconinfo} alt="" src={InfoIcon} />
            <div className={styles.howDoesThis}>How does this work?</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationCode;
