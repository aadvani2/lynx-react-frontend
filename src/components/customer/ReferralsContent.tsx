import React, { useState, useEffect } from 'react';
import { customerService } from '../../services/customerServices/customerService';

interface ReferralsContentProps {
    setActivePage: (page: string) => void;
}

interface ReferralData {
    id: number;
    status: 'pending' | 'converted' | 'canceled';
    converted_at: string | null;
    created_at: string;
    Referee: {
        id: number;
        name: string;
        email: string;
        referral_code: string;
    } | null;
}

const ReferralsContent: React.FC<ReferralsContentProps> = ({ setActivePage }) => {
    const [referralCode, setReferralCode] = useState('');
    const [referrals, setReferrals] = useState<ReferralData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [copySuccess, setCopySuccess] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
 
    const handleBackToDashboard = () => {
        setActivePage("dashboard");
    };

    const fetchReferrals = async (page: number = 1) => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await customerService.getMyReferrals({
                page: page,
                user_timezone: -new Date().getTimezoneOffset() / 60
            });

            if (response.success) {
                setReferrals(response.data.my_referral);
                setReferralCode(response.data.referral_code);
                setCurrentPage(response.data.current_page);
                setTotalPages(response.data.last_page);
            } else {
                setError('Failed to fetch referrals');
            }
        } catch (err) {
            console.error('Error fetching referrals:', err);
            setError('Failed to fetch referrals');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReferrals(1);
    }, []);

    const handleCopyReferralCode = async () => {
        try {
            const frontendBaseUrl = import.meta.env.VITE_FRONTEND_BASE_URL || window.location.origin;
            const fullReferralLink = `${frontendBaseUrl}/signup/customer?ref=${referralCode}`;
            
            await navigator.clipboard.writeText(fullReferralLink);
            
            setCopySuccess(true);
            
            // Reset success message after 2 seconds
            setTimeout(() => {
                setCopySuccess(false);
            }, 2000);
            
        } catch (err) {
            console.error('Failed to copy referral code:', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            const frontendBaseUrl = import.meta.env.VITE_FRONTEND_BASE_URL || window.location.origin;
            const fullReferralLink = `${frontendBaseUrl}/signup/customer?ref=${referralCode}`;
            textArea.value = fullReferralLink;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            setCopySuccess(true);
            setTimeout(() => {
                setCopySuccess(false);
            }, 2000);
        }
    };

    const formatDateTime = (dateString: string | null) => {
        if (!dateString) return '--';
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'pending':
                return 'badge-pending';
            case 'converted':
                return 'badge-completed';
            case 'canceled':
                return 'badge-cancelled';
            default:
                return 'badge-pending';
        }
    };

    const handlePageChange = (page: number) => {
        fetchReferrals(page);
    };

    if (loading) {
        return (
            <div className="card my-account-dashboard">
                <div className="card-header p-3 d-flex align-items-center">
                    <button className="btn btn-primary btn-sm rounded-pill" onClick={handleBackToDashboard}>
                        <i className="uil uil-arrow-left" /> Back
                    </button>
                    &nbsp;&nbsp;
                    <h4 className="card-title mb-0">My Referrals</h4>
                </div>
                <div className="card-body">
                    <div className="text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-2">Loading referrals...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="card my-account-dashboard">
            <div className="card-header p-3 d-flex flex-wrap justify-content-between align-items-center gap-2">
                <div className="d-flex align-items-center justify-content-between">
                    <button className="btn btn-primary btn-sm rounded-pill" onClick={handleBackToDashboard}>
                        <i className="uil uil-arrow-left" /> Back
                    </button>
                    &nbsp;&nbsp;
                    <h4 className="card-title mb-0">My Referrals</h4>
                </div>
            </div>
            <div className="card-body">
                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}
                
                <div className="row">
                    <div className="col-12">
                        <div id="referralBar" className="referral-bar" data-signup-base="" data-ref={referralCode}>
                            <span className="ref-label">Invite a Friend · Code</span>
                            <span className="ref-code" id="refCodeText">{referralCode}</span>
                            <span className="spacer" />
                            <button 
                                type="button" 
                                className={`btn btn-primary share-btn`} 
                                id="copyReferralBtn" 
                                title="Copy referral code" 
                                aria-label="Copy referral code"
                                onClick={handleCopyReferralCode}
                            >
                                <i className={`uil ${copySuccess ? 'uil uil-check-circle' : 'uil-share-alt'}`} />
                                &nbsp; {copySuccess ? 'Copied!' : 'Copy & Share'}
                            </button>
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="table-responsive">
                            <div className="table-card">
                                <table className="table table-modern">
                                    <thead className="fs-14">
                                        <tr>
                                            <th>Referee Customer</th>
                                            <th>Status</th>
                                            <th>Converted Time</th>
                                            <th>Created At</th>
                                        </tr>
                                    </thead>
                                    <tbody id="my_referral_table">
                                        {referrals.length > 0 ? (
                                            referrals.map((referral) => (
                                                <tr key={referral.id}>
                                                    <td>{referral.Referee ? referral.Referee.name : 'Unknown'}</td>
                                                    <td>
                                                        <span className={`p-2 badge ${getStatusBadgeClass(referral.status)}`}>
                                                            {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
                                                        </span>
                                                    </td>
                                                    <td>{formatDateTime(referral.converted_at)}</td>
                                                    <td>{formatDateTime(referral.created_at)}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={4} className="text-center">No referrals found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="d-flex justify-content-center mt-3">
                                    <nav aria-label="Referrals pagination">
                                        <ul className="pagination">
                                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                                <button 
                                                    className="page-link" 
                                                    onClick={() => handlePageChange(currentPage - 1)}
                                                    disabled={currentPage === 1}
                                                >
                                                    Previous
                                                </button>
                                            </li>
                                            
                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                                <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                                                    <button 
                                                        className="page-link" 
                                                        onClick={() => handlePageChange(page)}
                                                    >
                                                        {page}
                                                    </button>
                                                </li>
                                            ))}
                                            
                                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                                <button 
                                                    className="page-link" 
                                                    onClick={() => handlePageChange(currentPage + 1)}
                                                    disabled={currentPage === totalPages}
                                                >
                                                    Next
                                                </button>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReferralsContent;
