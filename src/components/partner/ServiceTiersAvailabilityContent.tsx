import React, { useState, useEffect } from 'react';
import { partnerService } from '../../services/partnerService/partnerService';
import ScheduleModal from './ScheduleModals/ScheduleModal';
import NotificationModal from './ScheduleModals/NotificationModal';
import Swal from 'sweetalert2';

interface ServiceTiersAvailabilityContentProps {
  setActivePage: (page: string) => void;
}

interface ServiceTier {
  id: number;
  title: string;
  radius: number;
  is_available: boolean;
}

interface ApiServiceTier {
  tier_id: number;
  tier_title: string;
  radius: number;
  is_available: number;
}

const ServiceTiersAvailabilityContent: React.FC<ServiceTiersAvailabilityContentProps> = ({ setActivePage }) => {
  const [serviceTiers, setServiceTiers] = useState<ServiceTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<{ id: number; title: string } | null>(null);
  const [isModalClosing, setIsModalClosing] = useState(false);
  const [isNotificationModalClosing, setIsNotificationModalClosing] = useState(false);

  const handleBackToDashboard = () => {
    setActivePage("dashboard");
  };

  // Fetch availability data when component mounts
  useEffect(() => {
    const fetchAvailabilityData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const userTimezone = 5.5; // You might want to get this from user context or settings
        const response = await partnerService.getManageAvailabilityInfo(userTimezone);
        
        if (response?.success) {
          const data = response.data;
          
          // Handle the API response structure you provided
          if (data.service_tiers && Array.isArray(data.service_tiers)) {
            // Map the API response to our component interface
            const mappedTiers = data.service_tiers.map((tier: ApiServiceTier) => ({
              id: tier.tier_id,
              title: tier.tier_title,
              radius: tier.radius,
              is_available: tier.is_available === 1
            }));
            
            setServiceTiers(mappedTiers);
          } else {
            // Fallback to default data if API doesn't return service_tiers
            setServiceTiers([
              {
                id: 1,
                title: "Emergency Service (1-4 Hrs)",
                radius: 20,
                is_available: true
              },
              {
                id: 3,
                title: "Scheduled Service",
                radius: 30,
                is_available: true
              }
            ]);
          }
        } else {
          setError('Failed to load availability data. Please try again.');
        }
      } catch (err) {
        console.error('Failed to fetch availability data:', err);
        setError('Failed to load availability data. Please try again.');
        // Fallback to default data on error
        setServiceTiers([
          {
            id: 1,
            title: "Emergency Service (1-4 Hrs)",
            radius: 20,
            is_available: true
          },
          {
            id: 3,
            title: "Scheduled Service",
            radius: 30,
            is_available: true
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailabilityData();
  }, []);

  const handleTierAvailabilityChange = (index: number, isAvailable: boolean) => {
    setServiceTiers(prev => prev.map((tier, i) => 
      i === index ? { ...tier, is_available: isAvailable } : tier
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      
      // Format payload according to the structure you specified
      const payload: Record<string, string | number> = {};
      
      // Add service radius data in the format: service_radius[0][tier_title]: "Scheduled Service", etc.
      serviceTiers.forEach((tier, index) => {
        payload[`service_radius[${index}][tier_title]`] = tier.title;
        payload[`service_radius[${index}][radius]`] = tier.radius;
        payload[`service_radius[${index}][tier_id]`] = tier.id;
        payload[`service_radius[${index}][is_available]`] = tier.is_available ? 1 : 0;
      });
      
      const response = await partnerService.updateServiceTiers(payload);
      
      if (response?.success) {
        
        // Show success message
        await Swal.fire({
          title: 'Success!',
          text: 'Your settings successfully saved.',
          icon: 'success',
          showConfirmButton: false,
          timer: 2000,
        });
      } else {
        setError(response?.message || 'Failed to save service tiers');
      }
    } catch (err) {
      console.error('Error saving service tiers:', err);
      setError('Failed to save service tiers');
      
      // Show error message
      await Swal.fire({
        title: 'Error',
        text: 'Failed to save service tier availability. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#dc3545',
        customClass: {
          confirmButton: 'btn btn-primary rounded-pill'
        }
      });
    } finally {
      setSaving(false);
    }
  };

  const handleOpenSchedule = (tierId: number, title: string, type: 'schedule' | 'notify') => {
    if (type === 'schedule') {
      setSelectedTier({ id: tierId, title });
      setIsScheduleModalOpen(true);
    } else {
      setSelectedTier({ id: tierId, title });
      setIsNotificationModalOpen(true);
    }
  };

  const handleCloseScheduleModal = () => {
    setIsModalClosing(true);
    // Wait for animation to complete before closing
    setTimeout(() => {
      setIsScheduleModalOpen(false);
      setSelectedTier(null);
      setIsModalClosing(false);
    }, 300); // Match animation duration
  };

  const handleCloseNotificationModal = () => {
    setIsNotificationModalClosing(true);
    // Wait for animation to complete before closing
    setTimeout(() => {
      setIsNotificationModalOpen(false);
      setSelectedTier(null);
      setIsNotificationModalClosing(false);
    }, 300); // Match animation duration
  };

  if (loading) {
    return (
      <div className="card">
        <div className="card-header p-3 d-flex align-items-center">
          <div className="d-flex align-items-center justify-content-between">
            <button 
              className="btn btn-primary btn-sm rounded-pill" 
              onClick={handleBackToDashboard}
            >
              <i className="uil uil-arrow-left" /> Back
            </button>
            &nbsp;&nbsp;
            <h4 className="card-title mb-0">Manage Availability Schedule</h4>
          </div>
        </div>
        <div className="card-body">
          <div className="w-100 text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading availability data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header p-3 d-flex align-items-center">
        <div className="d-flex align-items-center justify-content-between">
          <button 
            className="btn btn-primary btn-sm rounded-pill" 
            onClick={handleBackToDashboard}
          >
            <i className="uil uil-arrow-left" /> Back
          </button>
          &nbsp;&nbsp;
          <h4 className="card-title mb-0">Manage Availability Schedule</h4>
        </div>
      </div>
      <div className="card-body">
        {error && (
          <div className="alert alert-danger mb-3" role="alert">
            {error}
          </div>
        )}
        
        <form className="text-start" id="form-availability-schedule" onSubmit={handleSubmit}>
          <input 
            type="hidden" 
            name="_token" 
            defaultValue="dNXnicfTxifDUFolCVSVYUUotEc6a34UBXKQNjUL" 
            autoComplete="off" 
          />
          <div className="row">
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead className="fs-14">
                  <tr>
                    <th>Service Tiers</th>
                    <th style={{ width: '15%' }}>
                      Availability
                    </th>
                  </tr>
                </thead>
                <tbody id="tier_pricing_table">
                  {serviceTiers.map((tier, index) => (
                    <tr key={tier.id} id={`tier_pricing_row_${index}`}>
                      <td style={{ width: '50%' }}>
                        {tier.title}<br />
                        <span 
                          className="badge bg-blue rounded-pill openSchedule" 
                          data-id={tier.id} 
                          data-title={tier.title} 
                          data-type="schedule"
                          onClick={() => handleOpenSchedule(tier.id, tier.title, 'schedule')}
                          style={{ cursor: 'pointer' }}
                        >
                          Availability Schedule
                        </span>
                        <span 
                          className="badge bg-aqua text-dark rounded-pill openSchedule" 
                          data-id={tier.id} 
                          data-title={tier.title} 
                          data-type="notify"
                          onClick={() => handleOpenSchedule(tier.id, tier.title, 'notify')}
                          style={{ cursor: 'pointer' }}
                        >
                          Notification Schedule
                        </span>
                      </td>
                      <td style={{ width: '15%' }}>
                        <input 
                          type="hidden" 
                          className="form-control" 
                          name={`service_radius[${index}][tier_title]`} 
                          defaultValue={tier.title} 
                        />
                        <input 
                          type="hidden" 
                          name={`service_radius[${index}][radius]`} 
                          defaultValue={tier.radius} 
                        />
                        <input 
                          type="hidden" 
                          name={`service_radius[${index}][tier_id]`} 
                          defaultValue={tier.id} 
                        />
                        <input 
                          type="hidden" 
                          name={`service_radius[${index}][is_available]`} 
                          defaultValue={0} 
                        />
                        <div className="form-check form-switch form-switch-md">
                          <label className="form-check-label" htmlFor={`switchTier${index}`} />
                          <input 
                            className="form-check-input" 
                            type="checkbox" 
                            id={`switchTier${index}`} 
                            name={`service_radius[${index}][is_available]`} 
                            defaultValue={1} 
                            defaultChecked={tier.is_available}
                            onChange={(e) => handleTierAvailabilityChange(index, e.target.checked)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="text-center">
              <button 
                type="submit" 
                className="btn btn-primary rounded-pill btn-login" 
                id="submit-availability-schedule"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
      
      {/* Schedule Modal */}
      {selectedTier && (
        <ScheduleModal
          isOpen={isScheduleModalOpen}
          onClose={handleCloseScheduleModal}
          serviceTierId={selectedTier.id}
          serviceTierTitle={selectedTier.title}
          isClosing={isModalClosing}
        />
      )}

      {/* Notification Modal */}
      {selectedTier && (
        <NotificationModal
          isOpen={isNotificationModalOpen}
          onClose={handleCloseNotificationModal}
          serviceTierId={selectedTier.id}
          serviceTierTitle={selectedTier.title}
          isClosing={isNotificationModalClosing}
        />
      )}
    </div>
  );
};

export default ServiceTiersAvailabilityContent; 