import type { FunctionComponent } from 'react';
import styles from './ContactCard.module.css';
import MailIcon from '../../../assets/Icon/mail.svg';
import PhoneIcon from '../../../assets/Icon/phone.svg';

export interface ContactCardProps {
  phone?: string;
  email?: string;
}

const ContactCard: FunctionComponent<ContactCardProps> = ({
  phone = "+18774115969",
  email = "hello@connectwithlynx.com",
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.contactTitle}>Need help? We've got your back!</div>
      <div className={styles.contactInfo}>
        <span className={styles.contactRow}>
          <img src={PhoneIcon} alt="" width={16} height={16} />
          {phone}
        </span>
        <span className={styles.contactRow}>
          <img src={MailIcon} alt="" width={16} height={16} />
          {email}
        </span>
      </div>
    </div>
  );
};

export default ContactCard;
