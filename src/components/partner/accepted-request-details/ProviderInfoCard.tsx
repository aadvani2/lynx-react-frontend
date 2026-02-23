import React from 'react';
import BackendImage from '../../common/BackendImage/BackendImage';
import { useChatButton } from '../../../hooks/useChatButton';
import { useAuthStore } from '../../../store/authStore';

interface ProviderInfoCardProps {
  statusIcon: string;

  // Provider info
  providerName: string;
  providerEmail: string;
  providerPhone: string;
  providerDialCode: string;
  providerImage: string;

  // Optional: provider might have another phone
  providerAltPhone?: string;
  providerAltDialCode?: string;

  channelName: string;
  requestId?: number;
  friendlyName?: string;
  message: string;
}

const ProviderInfoCard: React.FC<ProviderInfoCardProps> = ({
  statusIcon,
  providerName,
  providerEmail,
  providerPhone,
  providerDialCode,
  providerImage,
  // providerAltPhone,
  // providerAltDialCode,
  channelName,
  requestId,
  friendlyName,
  message,
}) => {
  const { handleChatClick } = useChatButton();
  const { user } = useAuthStore();

  const formatPhoneNumber = (phone: string) => {
    if (!phone) return '';
    // basic US-style formatting, adjust if you need country-specific
    if (phone.length === 10) {
      return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`;
    }
    // fallback: just return raw phone
    return phone;
  };

  const handleChatButtonClick = () => {
    handleChatClick({
      channel_name: channelName,
      identity_name: `P_${user?.id || ''}`,
      au_id: String(user?.id || ''),
      user_type: 'provider',
      friendly_name: friendlyName || `#${requestId || ''}`,
      request_id: requestId,
      request_status: 1,
      url: '/professional/join-channel'
    });
  };

  return (
    <div className="card mb-3">
      <div className="card-body p-3">
        <div className="d-flex align-items-center">
          <div className="  flex-shrink-0 d-flex align-items-center justify-content-center" >
            <BackendImage
              src={statusIcon}
              alt="Status Icon"
              className="w-10 h-10"
            />
          </div>
          <div className="ms-3 me-2">
            {message}
          </div>
        </div>

        <hr className="mt-2 mb-2" />

        <div className="d-flex align-items-center flex-md-nowrap flex-wrap gap-2">
          <div className="d-flex align-items-center">
            <BackendImage
              src={providerImage}
              className="h-12 w-12 object-fit-cover rounded-circle"
              alt="Provider"
            />

            <div className="ms-3">
              <div className="fw-semibold">
                {providerName}
              </div>

              <div className="text-body fs-sm link-email">
                {providerEmail}
              </div>

              {/* Primary provider phone */}
              {providerPhone && (
                <div className="text-body fs-sm">
                  <i className="uil uil-phone" />
                  <a href={`tel:${providerDialCode}${providerPhone}`}>
                    {providerDialCode}{' '}
                    {formatPhoneNumber(providerPhone)}
                  </a>
                </div>
              )}

              {/* Optional secondary provider phone */}
              {/* {providerAltPhone && (
                <div className="text-body fs-sm">
                  <i className="uil uil-phone" />
                  <a
                    href={`tel:${providerAltDialCode || providerDialCode}${providerAltPhone}`}
                  >
                    {(providerAltDialCode || providerDialCode)}{' '}
                    {formatPhoneNumber(providerAltPhone)}
                  </a>
                </div>
              )} */}
            </div>
          </div>

          <div className="d-flex ms-auto">
            <button
              className="btn btn-sm btn-primary rounded-pill d-flex m-auto gap-2 mt-3 mb-3 viewchat"
              id="viewchat"
              onClick={handleChatButtonClick}
            >
              Chat
              <i
                className="uil uil-comment-alt-lines"
                style={{ fontSize: '15px' }}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderInfoCard;
