import React from 'react';
import { useChatButton } from '../../../../hooks/useChatButton';
import BackendImage from '../../../common/BackendImage/BackendImage';

interface ChatButtonProps {
  rid: number;
  status: string;
  channel: string;
  url?: string;
  label?: string;
  identity_name?: string;
  au_id?: string;
  user_type?: string;
  friendly_name?: string;
  request_status?: string | number;
}

interface CommunicationCardProps {
  statusIconUrl: string;
  message: string;
  chatButton: ChatButtonProps;
}

const CommunicationCard: React.FC<CommunicationCardProps> = ({ statusIconUrl, message, chatButton }) => {
  const { handleChatClick } = useChatButton();

  const handleClick = () => {
    handleChatClick({
      channel_name: chatButton.channel,
      identity_name: chatButton.identity_name,
      au_id: chatButton.au_id,
      user_type: chatButton.user_type || 'provider',
      friendly_name: chatButton.friendly_name,
      request_id: chatButton.rid,
      request_status: chatButton.request_status || chatButton.status,
      url: chatButton.url
    });
  };

  return (
    <div className="d-flex align-items-center mb-3">
      <div className=" me-4 flex-shrink-0 d-flex align-items-center justify-content-center" >
        <BackendImage 
          src={statusIconUrl} 
          alt="Status Icon" 
          className=" w-10 h-10"
        />
      </div>
      <div className="me-2">
        {message}
      </div>
      <button
        className="btn btn-primary rounded-pill d-flex ms-auto gap-2 btn-sm viewchat"
        id="viewchat"
        onClick={handleClick}
      >
        {chatButton.label || 'Start Chat'} <i className="uil uil-comment-alt-lines" style={{ fontSize: '15px' }}></i>
      </button>
    </div>
  );
};

export default CommunicationCard;
