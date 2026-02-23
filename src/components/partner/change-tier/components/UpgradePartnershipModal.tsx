import React from 'react';
import Swal from 'sweetalert2';

interface UpgradePartnershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const UpgradePartnershipModal: React.FC<UpgradePartnershipModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const showModal = () => {
    Swal.fire({
      title: "Upgrade Partnership Level",
      html: "If you want to upgrade your partnership level, please contact your account manager or Lynx support at<br/><strong>hello@connectwithlynx.com</strong> or call <strong>+1 (877) 411-5969 | +1 (877) 411-(LYNX)</strong>.",
      icon: "warning",
      confirmButtonText: "OK",
      confirmButtonColor: "#007bff",
      customClass: {
        popup: "swal2-popup swal2-modal swal2-icon-warning swal2-show",
        container: "swal2-container swal2-center swal2-backdrop-show",
        confirmButton: "btn btn-primary rounded-pill",
      },
      buttonsStyling: false,
      allowOutsideClick: false,
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
  }, [isOpen]);

  return null; // This component doesn't render anything in the DOM, it handles the modal via SweetAlert2
};

export default UpgradePartnershipModal;
