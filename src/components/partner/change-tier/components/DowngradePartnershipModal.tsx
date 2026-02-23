import React from 'react';
import Swal from 'sweetalert2';

interface DowngradePartnershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  newTier: number;
  tierNames: { [key: number]: string };
}

const DowngradePartnershipModal: React.FC<DowngradePartnershipModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  newTier, 
  tierNames 
}) => {
  const showModal = () => {
   
    Swal.fire({
      title: "Downgrade partnership level",
      html: `Are you sure you want to downgrade your partnership level to<br/><strong>${
        tierNames[newTier]
      }</strong>?<br/><br/><strong>Note:</strong> This will change your service partner tier to ${
        tierNames[newTier]
      } and you will not be able to revert back to your previous level manually.`,
      icon: "question",
      showCancelButton: false,
      showDenyButton: false,
      confirmButtonText: "Yes, change it!",
      confirmButtonColor: "#007bff",
      customClass: {
        popup: "swal2-popup swal2-modal swal2-icon-question swal2-show",
        container: "swal2-container swal2-center swal2-backdrop-show",
        confirmButton: "btn btn-primary rounded-pill w-20",
      },
      buttonsStyling: false,
      showCloseButton: true,
      allowOutsideClick: true,
    }).then((result) => {
      if (result.isConfirmed) {
        onConfirm();
      }
      onClose();
    });
  };

  React.useEffect(() => {
    if (isOpen) {
      showModal();
    }
  }, [isOpen, newTier]);

  return null; // This component doesn't render anything in the DOM, it handles the modal via SweetAlert2
};

export default DowngradePartnershipModal;
