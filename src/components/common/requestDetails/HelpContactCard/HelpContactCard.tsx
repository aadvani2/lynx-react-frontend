
import React from 'react';
import styles from './HelpContactCard.module.css';
import PhoneIcon from "../../../../assets/Icon/phone.svg";
import MailIcon from "../../../../assets/Icon/mail.svg";

const HelpContactCard: React.FC = () => {
  return (
    <div className={styles.help}>
      <div className={styles.requestAcceptedWrapper}>
        <div className={styles.frameWrapper4}>
          <div className={styles.requestAcceptedWrapper}>
            <b className={styles.needHelpWeve}>Need help? We’ve got your back!</b>
          </div>
        </div>
      </div>
      <div className={styles.frameParent4}>
        <div className={styles.frameParent7}>
          <div className={styles.frameWrapper7}>
            <div className={styles.iconcalendarParent}>
              <img className={styles.iconcalendar} alt="" src={PhoneIcon} />
              <div className={styles.bodyButton}>+18774115969</div>
            </div>
          </div>
          <div className={styles.frameWrapper7}>
            <div className={styles.iconcalendarParent}>
              <img className={styles.iconcalendar} alt="" src={MailIcon} />
              <a className={styles.helloconnectwithlynxcom} href="mailto:hello@connectwithlynx.com" target="_blank">hello@connectwithlynx.com</a>
            </div>
          </div>
        </div>
        <div className={styles.button7} />
      </div>
    </div>
  );
};

export default HelpContactCard;
