import React, { useState, useEffect } from 'react';
import BobcatPartnerInfoModal from '../change-tier/components/BobcatPartnerInfoModal';
import IberianLynxInfoModal from '../change-tier/components/IberianLynxInfoModal';
import EurasianLynxInfoModal from '../change-tier/components/EurasianLynxInfoModal';

interface PartnershipLevelSelectorProps {
  defaultSelectedLevel?: number;
}

const PartnershipLevelSelector: React.FC<PartnershipLevelSelectorProps> = ({ defaultSelectedLevel = 8 }) => {
  const [showBobcatModal, setShowBobcatModal] = useState(false);
  const [showIberianModal, setShowIberianModal] = useState(false);
  const [showEurasianModal, setShowEurasianModal] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<number | undefined>(defaultSelectedLevel);
  
  // Update selected level when defaultSelectedLevel changes
  useEffect(() => {
    if (defaultSelectedLevel !== undefined) {
      setSelectedLevel(defaultSelectedLevel);
      // Also update the radio button checked state
      const radioId = `service_partner_tier${defaultSelectedLevel}`;
      const radio = document.getElementById(radioId) as HTMLInputElement;
      if (radio) {
        radio.checked = true;
      }
    }
  }, [defaultSelectedLevel]);

  const handleOpenBobcatModal = () => setShowBobcatModal(true);
  const handleCloseBobcatModal = () => setShowBobcatModal(false);

  const handleOpenIberianModal = () => setShowIberianModal(true);
  const handleCloseIberianModal = () => setShowIberianModal(false);

  const handleOpenEurasianModal = () => setShowEurasianModal(true);
  const handleCloseEurasianModal = () => setShowEurasianModal(false);

  return (
    <>
      <div className="col-md-12">
        <p className="lead mb-1 text-start">Choose Your Level - How Busy Do You Want to Be?</p>
        <p>We offer three partnership levels so you can choose how much work and how quickly you want to take on</p>
      </div>
      <div className="col-md-12">
        <div className="form-floating mb-4">
          <div className="form-check text-start">
            <input 
              className="form-check-input" 
              defaultValue={8} 
              type="radio" 
              data-description={8} 
              name="service_partner_tier" 
              id="service_partner_tier8" 
              checked={selectedLevel === 8}
              onChange={() => setSelectedLevel(8)}
            />
            <label className="form-check-label" htmlFor="service_partner_tier8">
              Level 1 Bobcat Partner
            </label>
            <i 
              className="uil uil-info-circle" 
              onClick={handleOpenBobcatModal}
            />
          </div>
          <div className="form-check text-start">
            <input 
              className="form-check-input" 
              defaultValue={10} 
              type="radio" 
              data-description={10} 
              name="service_partner_tier" 
              id="service_partner_tier10" 
              checked={selectedLevel === 10}
              onChange={() => setSelectedLevel(10)}
            />
            <label className="form-check-label" htmlFor="service_partner_tier10">
              Level 2 Iberian Lynx Partner
            </label>
            <i 
              className="uil uil-info-circle" 
              onClick={handleOpenIberianModal}
            />
          </div>
          <div className="form-check text-start">
            <input 
              className="form-check-input" 
              defaultValue={9} 
              type="radio" 
              data-description={9} 
              name="service_partner_tier" 
              id="service_partner_tier9" 
              checked={selectedLevel === 9}
              onChange={() => setSelectedLevel(9)}
            />
            <label className="form-check-label" htmlFor="service_partner_tier9">
              Level 3 Eurasian Lynx Partner
            </label>
            <i 
              className="uil uil-info-circle" 
              onClick={handleOpenEurasianModal}
            />
          </div>
          <p className="pt-1">➡️ <span className="underline-2 blue">Need help deciding?</span> No worries - you can always adjust later.</p>
        </div>
      </div>

      <BobcatPartnerInfoModal isOpen={showBobcatModal} onClose={handleCloseBobcatModal} />
      <IberianLynxInfoModal isOpen={showIberianModal} onClose={handleCloseIberianModal} />
      <EurasianLynxInfoModal isOpen={showEurasianModal} onClose={handleCloseEurasianModal} />
    </>
  );
};

export default PartnershipLevelSelector;
