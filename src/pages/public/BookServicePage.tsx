import React, { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import AuthModal from '../../components/common/AuthModal';
import { 
  ServiceDetailsSection, 
  ServiceTierSection, 
  AddressSelectionSection,
  LoadingSection, 
  ErrorSection, 
  BookingHeader 
} from '../../components/public/booking';
import { useBookingStore } from '../../store/bookingStore';

const BookServicePage: React.FC = () => {
  const { subcategory } = useParams<{ subcategory: string }>();
  const location = useLocation();
  
  // Get navigation state to determine if user came from search
  const navigationState = location.state as {
    fromSearch?: boolean;
    selectedProviderId?: number;
  } | null;

  const {
    serviceData,
    selectedServices,
    selectedTier,
    serviceTierData,
    currentSection,
    loading,
    error,
    isLoadingServiceTier,
    isAuthModalOpen,
    subcategory: storeSubcategory,
    setSubcategory,
    setCurrentSection,
    fetchServiceData,
    handleServiceChange,
    handleTierChange,
    handleNext,
    handlePrevious,
    handleServiceTierNext,
    handleCloseAuthModal,
    getSubcategoryTitle,
    resetBookingState,
  } = useBookingStore();

  // Set subcategory when it changes
  useEffect(() => {
    if (subcategory && subcategory !== storeSubcategory) {
      setSubcategory(subcategory);
    }
  }, [subcategory, storeSubcategory, setSubcategory]);

  // Fetch service data when subcategory changes
  useEffect(() => {
    if (subcategory) {
      fetchServiceData(subcategory);
    }
  }, [subcategory, fetchServiceData]);

  // Handle navigation from search - skip to address selection
  useEffect(() => {
    if (navigationState?.fromSearch && subcategory) {
      // Skip directly to address selection when coming from search
      setCurrentSection('address-selection');
    }
  }, [navigationState?.fromSearch, subcategory, setCurrentSection]);

  // Reset booking state when component unmounts (user leaves the route)
  useEffect(() => {
    return () => {
      // This cleanup function runs when the component unmounts
      resetBookingState();
    };
  }, [resetBookingState]);


  const subcategoryTitle = getSubcategoryTitle();


  if (loading) {
    return <LoadingSection subcategoryTitle={subcategoryTitle} />;
  }

  if (error) {
    return <ErrorSection subcategoryTitle={subcategoryTitle} error={error} />;
  }

  return (
    <>
      <BookingHeader currentStep="selection" />

      {/* Service Details Section */}
      {currentSection === 'service-details' && (
        <ServiceDetailsSection
          serviceData={serviceData}
          selectedServices={selectedServices}
          onServiceChange={handleServiceChange}
          onNext={handleNext}
          isLoadingServiceTier={isLoadingServiceTier}
        />
      )}

      {/* Service Tier Selection Section */}
      {currentSection === 'service-tier' && serviceTierData && (
        <ServiceTierSection
          serviceTiers={serviceTierData.service_tiers}
          selectedTier={selectedTier}
          onTierChange={handleTierChange}
          onPrevious={handlePrevious}
          onNext={handleServiceTierNext}
        />
      )}

      {/* Address Selection Section */}
      {currentSection === 'address-selection' && (
        <AddressSelectionSection
          onPrevious={handlePrevious}
          service={subcategory || ''}
          category="indoor"
          fromSearch={navigationState?.fromSearch || false}
        />
      )}

      {/* Authentication Modal */}
      <AuthModal
        show={isAuthModalOpen}
        onClose={handleCloseAuthModal}
      />
    </>
  );
};

export default BookServicePage;
