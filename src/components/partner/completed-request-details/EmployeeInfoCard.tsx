import React from 'react';
import { useChatButton } from '../../../hooks/useChatButton';
import { useAuthStore } from '../../../store/authStore';
import { getBackendImageUrl } from '../../../utils/urlUtils';

interface EmployeeInfoCardProps {
  statusIcon: string;
  contactPerson: string;
  customerEmail: string;
  customerPhone: string;
  customerDialCode: string;
  phone: string;
  dialCode: string;
  channelName: string;
  requestId?: number;
  friendlyName?: string;
}

const EmployeeInfoCard: React.FC<EmployeeInfoCardProps> = ({
  statusIcon,
  contactPerson,
  customerEmail,
  customerPhone,
  customerDialCode,
  phone,
  dialCode,
  channelName,
  requestId,
  friendlyName,
}) => {
  const { handleChatClick } = useChatButton();
  const { user } = useAuthStore();

  const formatPhoneNumber = (phone: string) => {
    // Ensure phone number has at least 7 digits for formatting
    if (phone.length < 7) {
      return phone; 
    }
    return `(${phone.slice(0,3)}) ${phone.slice(3,6)}-${phone.slice(6)}`;
  };

  const handleChatButtonClick = () => {
    handleChatClick({
      channel_name: channelName,
      identity_name: `P_${user?.id || ''}`,
      au_id: String(user?.id || ''),
      user_type: 'provider',
      friendly_name: friendlyName || `#${requestId || ''}`,
      request_id: requestId,
      request_status: 0, // Completed requests have status 0
      url: '/professional/join-channel'
    });
  };

  return (
    <div className="card mb-3">
      <div className="card-body p-3">
        <div className="d-flex align-items-center">
          <img 
            src={statusIcon}
            alt="Status Icon" 
            width="32" 
            height="32"
          />
          <div className="ms-3 me-2">
            Job has been successfully completed.
          </div>
        </div>
        <hr className="mt-2 mb-2" />
        <div className="d-flex align-items-center flex-md-nowrap flex-wrap gap-2">
          <div className="d-flex align-items-center">
            <img 
              src={getBackendImageUrl("/storage/images/members/46/m9ENbc61qORYG6F1kNAv.webp")} // This should probably be dynamic
              className="img-fluid rounded-circle rdtl-emp-img object-fit-cover" 
              alt="Employee Image"
            />
            <div className="ms-3">
              <div className="fw-semibold">{contactPerson}</div>
              <div className="text-body fs-sm link-email">{customerEmail}</div>
              <div className="text-body fs-sm">
                <i className="uil uil-phone"></i>
                <a href={`tel:${customerDialCode}${customerPhone}`}>
                  {customerDialCode} {formatPhoneNumber(customerPhone)}
                </a>
              </div>
              <div className="text-body fs-sm">
                <i className="uil uil-phone"></i>
                <a href={`tel:${dialCode}${phone}`}>
                  {dialCode} {formatPhoneNumber(phone)}
                </a>
              </div>
            </div>
          </div>

          <div className="d-flex ms-auto">
            <button
              className="btn btn-sm btn-primary rounded-pill d-flex m-auto gap-2 mt-3 mb-3 viewchat"
              id="viewchat"
              onClick={handleChatButtonClick}
            >
              Chat<i className="uil uil-comment-alt-lines" style={{fontSize: '15px'}}></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeInfoCard;
