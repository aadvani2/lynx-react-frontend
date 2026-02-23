import React from 'react';
import { useChatButton } from '../../../../hooks/useChatButton';
import { useAuthStore } from '../../../../store/authStore';
import type { Member } from '../types';
import BackendImage from '../../../common/BackendImage/BackendImage';

interface EmployeeInfoProps {
    member: Member | null;
    statusIcon: string;
    channelName: string;
    requestId?: number;
    friendlyName?: string;
    message: string;
}

const EmployeeInfo: React.FC<EmployeeInfoProps> = ({ member, statusIcon, channelName, requestId, friendlyName, message }) => {
    const { handleChatClick } = useChatButton();
    const { user } = useAuthStore();

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

    // Add null check for member
    if (!member) {
        return (
            <div className="card mb-3">
                <div className="card-body p-3">
                    <div className="text-center text-muted">
                        <i className="uil uil-user-circle fs-1"></i>
                        <p className="mt-2 mb-0">Employee information not available</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="card mb-3">
            <div className="card-body p-3">
                <div className="d-flex align-items-center">
                    <BackendImage
                        src={statusIcon}
                        alt="Status Icon"
                        className="img-fluid w-10 h-10`"
                    />
                    <div className="ms-3 me-2">
                        {message}
                    </div>
                </div>
                <hr className="mt-2 mb-2" />
                <div className="d-flex align-items-center flex-md-nowrap flex-wrap gap-2">
                    <div className="d-flex align-items-center">
                        <img
                            src={member.image || ''}
                            alt="Employee Image"
                            className="img-fluid rounded-circle rdtl-emp-img object-fit-cover"
                        />
                        <div className="ms-3">
                            <div className="fw-semibold">{member.name || 'N/A'}</div>
                            <div className="text-body fs-sm link-email">{member.email || 'N/A'}</div>
                            <div className="text-body fs-sm">
                                <i className="uil uil-phone"></i>
                                <a href={`tel:${member.dial_code || ''}${member.phone || ''}`}>
                                    {member.dial_code || ''} ({member.phone?.slice(0, 3) || ''}) {member.phone?.slice(3, 6) || ''}-{member.phone?.slice(6) || ''}
                                </a>
                            </div>
                            {member.phone2 && (
                                <div className="text-body fs-sm">
                                    <i className="uil uil-phone"></i>
                                    <a href={`tel:${member.dial_code2 || ''}${member.phone2}`}>
                                        {member.dial_code2 || ''} ({member.phone2.slice(0, 3)}) {member.phone2.slice(3, 6)}-{member.phone2.slice(6)}
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="d-flex ms-auto">
                        <button
                            className="btn btn-sm btn-primary rounded-pill d-flex m-auto gap-2 mt-3 mb-3 viewchat"
                            id="viewchat"
                            onClick={handleChatButtonClick}
                        >
                            Chat<i className="uil uil-comment-alt-lines" style={{ fontSize: '15px' }}></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeInfo;
