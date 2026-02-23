import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAddressSelectionStore } from '../../../store/addressSelectionStore';
import AddressList from './AddressList';
import ProviderLoader from './ProviderLoader';
import NoProviderAlert from './NoProviderAlert';
import ProviderList from './ProviderList';
import ContactInformationSection from './ContactInformationSection';
import AddressEditor from './components/AddressEditor';
import { addModalCloseIconStyles } from '../../../utils/modalCloseIcon';
import { customerService } from '../../../services/customerServices/customerService';
import {
  shouldShowProviderList,
  shouldShowContactInformation,
  shouldShowProviderLoader,
  shouldShowNoProviderAlert,
  shouldShowPreviousButton
} from '../../../utils/addressSelectionVisibility';
import { type ProviderListVisibility, type ContactInformationVisibility, type ProviderLoaderVisibility, type NoProviderAlertVisibility, type PreviousButtonVisibility } from '../../../types/components';
import Swal from 'sweetalert2';

interface AddressSelectionSectionProps {
  onPrevious: () => void;
  service: string;
  category: string;
  fromSearch?: boolean;
  hasProviders?: boolean;
}

// mapContainerStyle moved to GoogleMapComponent

const AddressSelectionSection: React.FC<AddressSelectionSectionProps> = ({
  onPrevious,
  service,
  category,
  fromSearch = false,
}) => {
  const navigate = useNavigate();

  // Google Maps loader (now handled by individual components)

  // Local state for resetting service booking
  const [resetServiceBookingRef, setResetServiceBookingRef] = useState<(() => void) | null>(null);

  // Address editor state
  const [showAddressEditor, setShowAddressEditor] = useState(false);
  const [editorMode, setEditorMode] = useState<'add' | 'edit'>('add');
  const [editingAddress, setEditingAddress] = useState<{
    id: number;
    user_id: number;
    type: string;
    full_address: string;
    block_no: string | null;
    street: string | null;
    city: string;
    state: string;
    country: string;
    zip_code: string;
    latitude: number;
    longitude: number;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
  } | null>(null);

  // Old form state (kept for compatibility, but not used in new implementation)

  // Memoized callbacks to prevent infinite re-renders
  const handleResetServiceBooking = useCallback((resetFn: () => void) => {
    setResetServiceBookingRef(() => resetFn);
  }, []);

  // Old map and form handlers removed - now handled by AddressEditor component

  // Zustand store state and actions
  const {
    addresses,
    selectedAddress,
    providers,
    showProviderLoader,
    showNoProviderAlert,
    showProviderList,
    showContactInformation,
    contactApiResponse,
    isLoading,
    fetchAddresses,
    handleAddressChange: originalHandleAddressChange,
    handleBookService,
    handleProviderSearch,
    resetContactState,
    setNavigateToRequests,
    handleContactInformationFromSearch
  } = useAddressSelectionStore();

  const handleAddressChange = useCallback((address: number | object) => {
    setShowAddressEditor(false);
    setEditingAddress(null);
    useAddressSelectionStore.setState({ showProviderList: true });
    handleProviderSearch('');
    // Pass only the address ID to originalHandleAddressChange
    if (typeof originalHandleAddressChange === 'function') {
      const addressId = typeof address === 'object' && address !== null && 'id' in address
        ? (address as { id: number }).id
        : typeof address === 'number' ? address : 0;
      originalHandleAddressChange(addressId, service, category, fromSearch);
    }
  }, [handleProviderSearch, originalHandleAddressChange, service, category, fromSearch]);

  const handleBook = useCallback(async (providerId: number) => {
    return await handleBookService(providerId, service, category);
  }, [handleBookService, service, category]);

  // Call select-address API when component mounts and set up navigation
  useEffect(() => {
    useAddressSelectionStore.getState().resetAll(); // Reset all states when component mounts
    fetchAddresses();

    // Set up navigation to RequestsContent
    setNavigateToRequests(() => {
      navigate('/my-account?page=my_requests');
      // Scroll to top of the page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }, [fetchAddresses, setNavigateToRequests, navigate]);

  // Call contact information API when coming from search flow
  useEffect(() => {
    if (fromSearch && addresses.length > 0) {
      // Call the contact information API since provider was already selected
      handleContactInformationFromSearch(service, category);
    }
  }, [fromSearch, addresses.length, handleContactInformationFromSearch, service, category]);

  // Handle contact information previous button
  const handleContactPrevious = () => {
    resetContactState();
    // Also reset the service booking state in ProviderList
    if (resetServiceBookingRef) {
      resetServiceBookingRef();
    }
  };

  // Handle contact information next button
  const handleContactNext = () => {
    console.log('Contact information submitted, proceeding to next step');
  };

  // Handle provider search
  const handleSearch = useCallback((query: string) => {
    handleProviderSearch(query);
  }, [handleProviderSearch]);

  // Handle continue flow
  const handleContinue = useCallback(() => {
    console.log('Continue flow clicked');
  }, []);

  // Address editor handlers
  const handleEditAddress = useCallback((address: {
    id: number;
    user_id: number;
    type: string;
    full_address: string;
    block_no: string | null;
    street: string | null;
    city: string;
    state: string;
    country: string;
    zip_code: string;
    latitude: number;
    longitude: number;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
  }) => {
    setEditingAddress(address);
    setEditorMode('edit');
    setShowAddressEditor(true);
  }, []);

  const handleDeleteAddress = useCallback(async (addressId: number) => {
    // Add custom close icon styles
    const cleanupStyles = addModalCloseIconStyles({
      className: 'swal2-close',
      backgroundColor: 'rgba(0, 0, 0, 0.15)',
      hoverBackgroundColor: 'rgba(0, 0, 0, 0.25)',
      size: 1.8,
      fontSize: 1.2,
      top: '0.7rem',
      right: '0.7rem'
    });

    const result = await Swal.fire({
      title: 'Delete Address',
      html: 'Are you sure you want to delete this address? This action cannot be undone.',
      imageUrl: '',
      imageWidth: 77,
      imageHeight: 77,
      imageAlt: 'Lynx Logo',
      showCancelButton: false,
      showDenyButton: false,
      showCloseButton: true,
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#dc3545',
      customClass: {
        confirmButton: 'btn btn-primary rounded-pill w-20'
      }
    });

    // Cleanup styles after modal closes
    cleanupStyles();

    if (result.isConfirmed) {
      try {
        // Call the API to delete the address
        await customerService.deleteAddress(addressId);

        Swal.fire({
          icon: 'success',
          title: 'Address Deleted',
          text: 'Address has been deleted successfully',
          timer: 2000,
          showConfirmButton: false
        });

        // Refresh addresses list
        fetchAddresses();
      } catch (error) {
        console.error('Error deleting address:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to delete address. Please try again.',
          timer: 3000,
          showConfirmButton: false
        });
      }
    }
  }, [fetchAddresses]);

  const handleAddNewAddress = useCallback(() => {
    // To temporarily remove the address limit, comment out the validation block below.
    // Uncomment to restore limit:
    // if (addresses.length >= MAX_ADDRESSES) {
    //   Swal.fire({
    //     title: 'Limit Reached',
    //     text: 'You have reached the maximum number of addresses allowed',
    //     imageUrl: 'https://webstaging.connectwithlynx.com/frontend_assets/img/modal_logo.svg',
    //     imageWidth: 77,
    //     imageHeight: 77,
    //     showConfirmButton: true,
    //     confirmButtonText: 'OK',
    //     confirmButtonColor: '#0d6efd',
    //     customClass: {
    //       confirmButton: 'btn btn-primary rounded-pill w-20'
    //     }
    //   })
    //   return;
    // }
    setEditingAddress(null);
    setEditorMode('add');
    setShowAddressEditor(true);
  }, []);

  const prevSelectedAddressRef = React.useRef(selectedAddress);

  const handleCloseAddressEditor = useCallback(() => {
    setShowAddressEditor(false);
    setEditingAddress(null);

    // If user changed the selected address, show provider list again
    if (
      selectedAddress !== undefined &&
      prevSelectedAddressRef.current !== undefined &&
      selectedAddress !== prevSelectedAddressRef.current
    ) {
      useAddressSelectionStore.setState({ showProviderList: true });
      handleProviderSearch('');
    }
    prevSelectedAddressRef.current = selectedAddress;
  }, [selectedAddress, handleProviderSearch]);

  const handleSaveAddress = useCallback(async (addressData: {
    id?: number;
    user_id?: number;
    type: string;
    block_no: string | null;
    full_address: string;
    zip_code: string;
    city: string;
    state: string;
    country: string;
    latitude: number;
    longitude: number;
    street?: string | null;
    deleted_at?: string | null;
    created_at?: string;
    updated_at?: string;
  }) => {
    // To temporarily remove the address limit, comment out the validation block below.
    // Uncomment to restore limit:
    // if (addresses.length >= MAX_ADDRESSES) {
    //   Swal.fire({
    //     title: 'Limit Reached',
    //     text: 'You have reached the maximum number of addresses allowed',
    //     imageUrl: 'https://webstaging.connectwithlynx.com/frontend_assets/img/modal_logo.svg',
    //     imageWidth: 77,
    //     imageHeight: 77,
    //     showConfirmButton: true,
    //     confirmButtonText: 'OK',
    //     confirmButtonColor: '#0d6efd',
    //     customClass: {
    //       confirmButton: 'btn btn-primary rounded-pill w-20'
    //     }
    //   })
    //   return;
    // }
    try {
      // Prepare the payload for the API
      const payload = {
        latitude: addressData.latitude,
        longitude: addressData.longitude,
        country: addressData.country,
        type: addressData.type,
        block_no: addressData.block_no || '',
        full_address: addressData.full_address,
        zip_code: addressData.zip_code,
        city: addressData.city,
        state: addressData.state,
      };

      // Use addAddress for both create and update (backend handles based on ID presence)
      if (addressData.id) {
        // Update existing address - include ID in payload
        await customerService.addAddress({
          ...payload,
          id: addressData.id
        });
      } else {
        // Create new address
        await customerService.addAddress(payload);
      }

      // Refresh addresses list
      fetchAddresses();
      // After saving, close editor and check address change
      handleCloseAddressEditor();
    } catch (error) {
      console.error('Error saving address:', error);
      throw error;
    }
  }, [fetchAddresses, handleCloseAddressEditor]);

  const sectionVisibilityPropsForProviderList: ProviderListVisibility = {
    fromSearch,
    addresses,
    showAddressEditor,
    showProviderList,
  };

  const sectionVisibilityPropsForContactInformation: ContactInformationVisibility = {
    addresses,
    isLoading,
    showAddressEditor,
    showContactInformation,
    fromSearch,
    showNoProviderAlert,
  };

  const sectionVisibilityPropsForProviderLoader: ProviderLoaderVisibility = {
    showProviderLoader,
    showAddressEditor,
    fromSearch,
    showContactInformation,
  };

  const sectionVisibilityPropsForNoProviderAlert: NoProviderAlertVisibility = {
    showNoProviderAlert,
    showAddressEditor,
    fromSearch,
  };

  const sectionVisibilityPropsForPreviousButton: PreviousButtonVisibility = {
    showContactInformation,
    fromSearch,
  };

  return (
    <section className="wrapper bg-light">
      <div className="container pt-6 pb-10">
        <div id="form-div" className="gx-md-5 gy-3">
          <div id="loadData" style={{ minHeight: 200 }}>
            <div id="user-address">
              <section id="selection" className="wrapper bg-light">
                <div className="container text-center">
                  <AddressList
                    addresses={addresses}
                    selectedAddress={selectedAddress}
                    onAddressChange={handleAddressChange}
                    onEditAddress={handleEditAddress}
                    onDeleteAddress={handleDeleteAddress}
                    onAddNewAddress={handleAddNewAddress}
                  />
                  <AddressEditor
                    isVisible={showAddressEditor}
                    mode={editorMode}
                    initialData={editingAddress || undefined}
                    onSave={handleSaveAddress}
                    onClose={handleCloseAddressEditor}
                  />
                  {
                    addresses.length > 0 && (
                      <>

                        {/* Show ProviderList only if not coming from search */}
                        {shouldShowProviderList(sectionVisibilityPropsForProviderList) && (
                          <ProviderList
                            providers={providers}
                            onSearch={handleSearch}
                            onContinueFlow={handleContinue}
                            onBookService={handleBook}
                            onResetServiceBooking={handleResetServiceBooking}
                          />
                        )}

                        {/* Show ContactInformationSection if coming from search or normal flow */}
                        {shouldShowContactInformation(sectionVisibilityPropsForContactInformation) && (
                          <ContactInformationSection
                            onPrevious={handleContactPrevious}
                            onNext={handleContactNext}
                            apiResponse={contactApiResponse}
                            isLoading={isLoading} // Pass isLoading directly
                          />
                        )}

                        <div className="d-none" id="contactInformationDiv" />

                        {/* Show ProviderLoader only if not coming from search */}
                        {shouldShowProviderLoader(sectionVisibilityPropsForProviderLoader) && <ProviderLoader isVisible={true} />}

                        {/* Show NoProviderAlert if coming from search and no providers, or normal flow */}
                        {shouldShowNoProviderAlert(sectionVisibilityPropsForNoProviderAlert) && <NoProviderAlert isVisible={true} />}
                      </>
                    )}
                  {/* Previous Button and Additional Content */}
                  {shouldShowPreviousButton(sectionVisibilityPropsForPreviousButton) && (
                    <div className="row mt-4" id="historyBtn">
                      <div className="col-md-6 text-center mt-7 m-auto" id="addressBtn">
                        <div>
                          <button
                            onClick={onPrevious}
                            type="button"
                            id="backToPrevious"
                            data-previous="tier"
                            className="btn btn-outline-primary rounded-pill w-20"
                          >
                            <i className="uil uil-angle-double-left fs-30 lh-1" /> Previous
                          </button>
                        </div>
                      </div>
                    </div>
                  )}


                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AddressSelectionSection;
