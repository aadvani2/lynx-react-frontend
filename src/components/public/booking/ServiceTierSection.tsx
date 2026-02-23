import React, { useCallback, useEffect, useRef, useState } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';
import Swal from 'sweetalert2';
import { servicesService } from '../../../services/generalServices/servicesService';

interface ServiceTier {
  tier_id: number;
  tag: string;
  duration: number;
  description: string;
  payable_amount: number;
  refund_amount: number;
  status: string;
  is_schedulable: number;
}

interface ServiceTierSectionProps {
  serviceTiers: ServiceTier[];
  selectedTier: string;
  onTierChange: (tierTag: string) => void;
  onPrevious: () => void;
  onNext: () => void;
}

const ServiceTierSection: React.FC<ServiceTierSectionProps> = ({
  serviceTiers,
  selectedTier,
  onTierChange,
  onPrevious,
  onNext
}) => {
  const flatpickrRef = useRef<flatpickr.Instance | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState<string>('');
  const [scheduleTime, setScheduleTime] = useState<string>('');

  // Helper function to show error alerts with SweetAlert2
  const showErrorAlert = (title: string, text: string) => {
    Swal.fire({
      icon: 'error',
      title: title,
      text: text,
      timer: 4000,
      timerProgressBar: true,
      showConfirmButton: false,
      toast: true,
      position: 'top-end',
      background: '#fff',
      color: '#333',
      customClass: {
        popup: 'swal2-popup-custom'
      }
    });
  };

  // Helper function to format duration
  const formatDuration = (duration: number) => {
    if (duration === -1) return "1-4 Hrs";
    if (duration === 0) return "Scheduled";
    return `${duration} Hrs`;
  };

  // // Helper function to format price
  // const formatPrice = (amount: number) => {
  //   if (amount === 0) return "Free";
  //   return `$${amount.toFixed(2)}`;
  // };

  // Helper function to get tier title
  const getTierTitle = (tier: ServiceTier) => {
    if (tier.tag === "Emergency") {
      return `Emergency Service (${formatDuration(tier.duration)})`;
    }
    return `${tier.tag} Service`;
  };

  // Check if the selected tier is schedulable
  const isSchedulableTier = useCallback(() => {
    const selectedTierData = serviceTiers.find(tier => tier.tag === selectedTier);
    return selectedTierData?.is_schedulable === 1;
  }, [serviceTiers, selectedTier]);

  // Check if selected time is within next 4 hours
  const isWithinNext4Hours = (selectedDate: Date) => {
    const now = new Date();
    const fourHoursFromNow = new Date(now.getTime() + (4 * 60 * 60 * 1000));
    return selectedDate <= fourHoursFromNow;
  };

  // Format date for API (e.g., "11 Sep 2025 3:30 PM")
  const formatDateForAPI = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    };
    return date.toLocaleDateString('en-US', options);
  };

  // Handle service tier selection
  const handleTierSelection = async (tierId: number) => {
    try {
      // Find the tier object to get the tag
      const selectedTierData = serviceTiers.find(tier => tier.tier_id === tierId);
      if (!selectedTierData) {
        console.error('Tier not found for ID:', tierId);
        return;
      }

      // Call store_session_data API with selected tier ID
      await servicesService.storeSessionData({
        service_tier_id: tierId
      });
      
      // Call the original onTierChange function with the tag (not the ID)
      onTierChange(selectedTierData.tag);
    } catch (error) {
      console.error('Failed to store service tier:', error);
      showErrorAlert('Error', 'Failed to save service tier selection. Please try again.');
    }
  };

  // Handle confirm button click
  const handleConfirmDateTime = useCallback(async (selectedDate: Date) => {
    try {
      const formattedDate = formatDateForAPI(selectedDate);
      
      // Call store_session_data API
      await servicesService.storeSessionData({
        schedule_time: formattedDate
      });
      
      console.log('Schedule time stored successfully:', formattedDate);
      
      // Check if within next 4 hours
      if (isWithinNext4Hours(selectedDate)) {
        setSelectedDateTime(formattedDate);
        setShowEmergencyModal(true);
      } else {
        // Proceed normally if not within 4 hours
        console.log('Scheduled time is not within emergency window');
      }
    } catch (error) {
      console.error('Failed to store schedule time:', error);
      showErrorAlert('Error', 'Failed to save schedule time. Please try again.');
    }
  }, []);

  // Handle Next button click
  const handleNextClick = async () => {
    try {
      let apiResponse = null;
      
      // If Emergency service is selected, send Indian time
      if (selectedTier === 'Emergency') {
        const indianTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"});
        const formattedIndianTime = new Date(indianTime).toISOString().slice(0, 19).replace('T', ' ');
        
        // Call store_session_data API with Indian time
        apiResponse = await servicesService.storeSessionData({
          schedule_time: formattedIndianTime
        });
      } else {
        // For non-emergency services, use schedule time or input field value
        let timeToUse = scheduleTime;
        
        // If scheduleTime state is empty, use the input field value
        if (!timeToUse && inputRef.current?.value) {
          timeToUse = inputRef.current.value;
        }
        
        if (timeToUse) {
          const inputDate = new Date(timeToUse);
          const formattedDateTime = inputDate.toISOString().slice(0, 19).replace('T', ' ');
          
          // Call store_session_data API
          apiResponse = await servicesService.storeSessionData({
            schedule_time: formattedDateTime
          });
        } else {
          showErrorAlert('Required', 'Please select a date and time first.');
          return;
        }
      }
      
      // Check if API response is successful
      if (apiResponse && apiResponse.success) {
        // Call the original onNext function to navigate to address selection
        onNext();
      } else {
        showErrorAlert('Error', 'Failed to save schedule time. Please try again.');
      }
    } catch (error) {
      console.error('Failed to store schedule time on Next click:', error);
      showErrorAlert('Error', 'Failed to save schedule time. Please try again.');
    }
  };

  // Initialize Flatpickr when component mounts or when schedulable tier is selected
  useEffect(() => {
    if (isSchedulableTier() && inputRef.current) {
      // Destroy existing instance if it exists
      if (flatpickrRef.current) {
        flatpickrRef.current.destroy();
      }

      // Initialize new Flatpickr instance
      const selectedTierData = serviceTiers.find(tier => tier.tag === selectedTier);
      const isScheduledService = selectedTierData?.tag === 'Scheduled';
      
      // Set default date based on service type
      let defaultDate = new Date();
      if (isScheduledService) {
        // For Scheduled Service, set time 4 hours ahead from IST
        const istTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"});
        const istDate = new Date(istTime);
        istDate.setHours(istDate.getHours() + 4);
        defaultDate = istDate;
      }
      
      flatpickrRef.current = flatpickr(inputRef.current, {
        enableTime: true,
        dateFormat: "Y-m-d h:i K",
        time_24hr: false,
        minDate: "today",
        defaultDate: defaultDate,
        minuteIncrement: 15,
        onChange: (_, dateStr) => {
          console.log('Selected date:', dateStr);
          setScheduleTime(dateStr);
        },
        onClose: (_, dateStr) => {
          console.log('Date picker closed with:', dateStr);
        },
        onReady: (_, __, fp) => {
          // Add custom confirm button to the flatpickr modal
          const confirmButton = document.createElement('div');
          confirmButton.className = 'flatpickr-confirm lightTheme btn btn-primary rounded-pill btn-sm';
          confirmButton.tabIndex = -1;
          confirmButton.id = 'confirmBtn';
          
          // Create the SVG checkmark icon
          const svgIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          svgIcon.setAttribute('version', '1.1');
          svgIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
          svgIcon.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
          svgIcon.setAttribute('width', '17');
          svgIcon.setAttribute('height', '17');
          svgIcon.setAttribute('viewBox', '0 0 17 17');
          
          const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
          const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          path.setAttribute('d', 'M15.418 1.774l-8.833 13.485-4.918-4.386 0.666-0.746 4.051 3.614 8.198-12.515 0.836 0.548z');
          path.setAttribute('fill', '#000000');
          
          g.appendChild(path);
          svgIcon.appendChild(g);
          
          // Add text and icon to button
          confirmButton.textContent = 'Confirm';
          confirmButton.appendChild(svgIcon);
          
          confirmButton.addEventListener('click', () => {
            const selectedDate = fp.selectedDates[0];
            if (selectedDate) {
              handleConfirmDateTime(selectedDate);
              fp.close();
            } else {
              showErrorAlert('Required', 'Please select a date and time first');
            }
          });
          
          // Find the flatpickr buttons container and add our confirm button
          const buttonsContainer = fp.calendarContainer.querySelector('.flatpickr-buttons');
          if (buttonsContainer) {
            buttonsContainer.appendChild(confirmButton);
          } else {
            // If no buttons container exists, create one
            const buttonsDiv = document.createElement('div');
            buttonsDiv.className = 'flatpickr-buttons';
            buttonsDiv.style.cssText = 'text-align: center; padding: 10px; border-top: 1px solid #ddd;';
            buttonsDiv.appendChild(confirmButton);
            fp.calendarContainer.appendChild(buttonsDiv);
          }
        }
      });
    } else {
      // Destroy Flatpickr instance if schedulable tier is not selected
      if (flatpickrRef.current) {
        flatpickrRef.current.destroy();
        flatpickrRef.current = null;
      }
    }

    // Cleanup function
    return () => {
      if (flatpickrRef.current) {
        flatpickrRef.current.destroy();
        flatpickrRef.current = null;
      }
    };
  }, [selectedTier, serviceTiers, handleConfirmDateTime, isSchedulableTier]);

  return (
    <section className="wrapper bg-light">
      <div className="container pt-6 pb-10">
        <div id="form-div" className="gx-md-5 gy-3">
          <div id="loadData" style={{ minHeight: 200 }}>
            <div id="service-tier">
              <section id="selection" className="wrapper bg-light">
                <div className="row text-center">
                  <div className="position-relative">
                    <p className="lead px-xxl-10">I want to get service done within</p>
                    <div className="row text-start justify-content-center">
                      {serviceTiers.map((tier, index) => (
                        <div key={tier.tag} className="col-xl-4 col-md-12 col-sm-12 d-flex">
                          <div className="inputGroup d-flex w-100">
                            <input 
                              type="radio" 
                              className="tierType" 
                              data-description={tier.description}
                              data-price={tier.payable_amount}
                              data-is_schedulable={tier.is_schedulable}
                              data-tag={tier.tag}
                              name="selectTier" 
                              value={tier.tag}
                              id={`tier_${index + 1}`}
                              checked={selectedTier === tier.tag}
                              onChange={() => handleTierSelection(tier.tier_id)}
                            />
                            <label htmlFor={`tier_${index + 1}`}>
                              <img src="" className="icon-svg icon-svg-sm text-primary" alt="" />
                              <div>
                                <b>{getTierTitle(tier)}</b><br />
                                <span>Free</span>
                                {/* <span>{formatPrice(tier.payable_amount)}</span> */}
                              </div>
                            </label>
                          </div>
                        </div>
                      ))}
                      <input id="emergency_time" type="hidden" name="emergency_time" defaultValue="2025-09-10 18:07:31" />
                      
                      {/* Date and Time Selection Section - Show only for schedulable tiers */}
                      {isSchedulableTier() && (
                        <div className="col-12 mt-4" id="requestDateTime">
                          <div className="row">
                            <div className="col-md-8 col-lg-6 offset-md-2 offset-lg-3 border rounded-2 p-3 text-center">
                              <h4 className="px-xxl-10">Select your request date and time</h4>
                              <div className="row align-items-center">
                                <div className="col-xl-auto col-md-12 mb-1 mb-xl-0">
                                  <label htmlFor="schedule_date" className="form-label p-0 m-0">Schedule Date &amp; Time</label>
                                </div>
                                <div className="col-xl col-md-12">
                                  <input 
                                    ref={inputRef}
                                    type="text" 
                                    className="form-control flatpickr-input" 
                                    id="schedule_time" 
                                    name="schedule_time" 
                                    placeholder="Select Date & Time" 
                                    defaultValue="" 
                                    readOnly 
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className={`col-12 mt-4 ${showEmergencyModal ? '' : 'd-none'}`} id="userConfirmation">
                        <div className="not-search-result">
                          <div className="container">
                            <div className="not-search-result-inner bg-primary p-5 rounded-4">
                              <div className="not-search-result-inner-main bg-white rounded-4 overflow-hidden position-relative">
                                <div className="border-bottom border-soft-violet not-search-result-top text-center">
                                  <h2 className="font-bricolage">Emergency Window Triggered</h2>
                                  <p>
                                    Your scheduled time is within the next 4 hours. This is
                                    considered an emergency request.
                                    A $60.00 emergency matching fee will apply. Would you
                                    like to proceed?
                                  </p>
                                  <div className="d-flex flex-wrap justify-content-center gap-3">
                                    <button 
                                      type="button" 
                                      id="cancelled" 
                                      className="btn btn-danger rounded-pill"
                                      onClick={() => {
                                        setShowEmergencyModal(false);
                                        // Reopen the calendar
                                        if (flatpickrRef.current && inputRef.current) {
                                          flatpickrRef.current.open();
                                        }
                                      }}
                                    >
                                      Change Time
                                    </button>
                                    <button 
                                      type="button" 
                                      id="processedWithEmergency" 
                                      className="btn btn-primary rounded-pill"
                                      onClick={() => {
                                        setShowEmergencyModal(false);
                                        // Select Emergency service tier
                                        const emergencyTier = serviceTiers.find(tier => tier.tag === 'Emergency');
                                        if (emergencyTier) {
                                          handleTierSelection(emergencyTier.tier_id);
                                        }
                                        console.log('Proceeding with emergency fee for:', selectedDateTime);
                                      }}
                                    >
                                      Confirm
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="container">
                      <div className="row">
                        <div className="col-md-6 col-xl-6 col-xxl-6 d-flex justify-content-between m-auto text-center mt-4 gap-4">
                          <button 
                            type="button" 
                            id="backToPrevious" 
                            data-previous="service" 
                            className="btn btn-outline-primary rounded-pill w-20"
                            onClick={onPrevious}
                          >
                            <i className="uil uil-angle-double-left fs-30 lh-1" /> Previous
                          </button>
                          <button type="button" id="getAddress" className="btn btn-primary rounded-pill w-20" onClick={handleNextClick}>Next</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceTierSection; 