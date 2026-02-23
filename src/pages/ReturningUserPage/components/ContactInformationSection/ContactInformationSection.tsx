import React from 'react';
import CheckmarkIcon from '../../../../assets/Icon/checkmark.svg';
import styles from './ContactInformationSection.module.css';

interface ContactInformationSectionProps {
  email: string;
  fullName: string;
  phoneNumber: string;
  onEmailChange: (email: string) => void;
  onFullNameChange: (fullName: string) => void;
  onPhoneNumberChange: (phoneNumber: string) => void;
}

const ContactInformationSection: React.FC<ContactInformationSectionProps> = ({
  email,
  fullName,
  phoneNumber,
  onEmailChange,
  onFullNameChange,
  onPhoneNumberChange
}) => {
  return (
    <section className={styles.infoSection}>
      <h2 className={styles.sectionTitle}>Contact Information</h2>
      <div className={`${styles.formGroup} ${styles.formGroupFloating}`}>
        <label htmlFor="contact_email">Email</label>
        <div className={styles.inputWithCheckmark}>
          <input
            type="email"
            id="contact_email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
          />
          <span className={styles.checkmarkIcon}>
            <img src={CheckmarkIcon} alt="checkmark" />
          </span>
        </div>
      </div>
      <div className={`${styles.formGroup} ${styles.formGroupFloating}`}>
        <label htmlFor="contact_fullName">Full name</label>
        <div className={styles.inputWithCheckmark}>
          <input
            type="text"
            id="contact_fullName"
            value={fullName}
            onChange={(e) => onFullNameChange(e.target.value)}
          />
          <span className={styles.checkmarkIcon}>
            <img src={CheckmarkIcon} alt="checkmark" />
          </span>
        </div>
      </div>
      <div className={`${styles.formGroup} ${styles.formGroupFloating}`}>
        <label htmlFor="contact_phoneNumber">Phone number</label>
        <div className={styles.inputWithCheckmark}>
          <input
            type="tel"
            id="contact_phoneNumber"
            value={phoneNumber}
            onChange={(e) => onPhoneNumberChange(e.target.value)}
          />
          <span className={styles.checkmarkIcon}>
            <img src={CheckmarkIcon} alt="checkmark" />
          </span>
        </div>
      </div>
    </section>
  );
};

export default ContactInformationSection;
