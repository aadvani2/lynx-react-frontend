import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJsApiLoader, type Libraries } from '@react-google-maps/api';
import { GOOGLE_MAPS_CONFIG } from '../../config/maps';
import { useOnboardingMap, useOnboardingMapStore } from '../../hooks/useOnboardingMap';
import Swal from 'sweetalert2';
import LocationSection from '../../components/partner/onboarding/LocationSection';
import MapSection from '../../components/partner/onboarding/MapSection';
import AddressSection from '../../components/partner/onboarding/AddressSection';
import RadiusSection from '../../components/partner/onboarding/RadiusSection';
import {
  OnboardingHeader,
  ContactPersonInfo,
  PartnershipLevelSelector,
  ServiceTypeSelector,
  DocumentUploader,
  BusinessInfo,
  SubmitButton
} from '../../components/partner/onboarding';
import ServiceSearchInput from '../../components/partner/onboarding/ServiceSearchInput';
import { partnerService } from '../../services/partnerService/partnerService';

const GOOGLE_MAPS_LIBRARIES: Libraries = ['places', 'marker'];

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [documents, setDocuments] = useState<Array<Record<string, unknown>>>([]);
  const [documentTypes, setDocumentTypes] = useState<Record<string, boolean>>({});
  const [isLoadingDocuments, setIsLoadingDocuments] = useState<boolean>(false);
  const [businessInfo, setBusinessInfo] = useState<{
    establishmentYear?: string | number;
    companySize?: string;
    bio?: string;
    description?: string;
  } | null>(null);
  const [contactPersonInfo, setContactPersonInfo] = useState<{
    name?: string;
    phone?: string;
    countryCode?: string;
    countryIso?: string;
  } | null>(null);
  const [servicePartnerTier, setServicePartnerTier] = useState<number | undefined>(undefined);
  const [serviceTypes, setServiceTypes] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<number[]>([]);

  // Get map functionality
  const { onLoadMap, onUnmountMap, onAutocompleteLoad, onPlaceChanged } = useOnboardingMap();

  // Get store functions and values
  const {
    country,
    latitude,
    longitude,
    setAddressData,
    setUnitNumber,
    setMarkerPos
  } = useOnboardingMapStore();

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_CONFIG.API_KEY,
    libraries: GOOGLE_MAPS_LIBRARIES
  });

  // Function to fetch documents
  const fetchDocuments = async () => {
    setIsLoadingDocuments(true);
    try {
      const response = await partnerService.getDocuments();
      // The service now returns a cleaned response with just the necessary data
      setDocuments(response.documents);

      // Store document types to determine which document inputs to show
      if (response.document_types) {
        setDocumentTypes(response.document_types);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setIsLoadingDocuments(false);
    }
  };

  // Function to fetch business profile info
  const fetchBusinessInfo = async () => {
    try {
      const response = await partnerService.getBusinessProfileInfo();

      if (response?.success && response.data?.provider) {
        const providerData = response.data.provider;

        // Check if profile is complete and documents are uploaded
        const isProfileComplete =
          providerData.zip_code &&
          providerData.company_size &&
          providerData.service_partner_tier &&
          (!providerData.remaining_documents || providerData.remaining_documents.length === 0);

        // Based on Laravel logic: onboarding page remains accessible even after documents are uploaded
        // The Laravel onboarding API doesn't restrict access based on document status
        // So we allow editing but could show a message if profile is complete
        if (isProfileComplete && providerData.approval_status === 'approved') {
          // Profile is complete and approved - show info message but allow editing
          Swal.fire({
            icon: 'info',
            title: 'Profile Complete',
            text: 'Your onboarding profile is complete and approved. You can still edit your information here.',
            confirmButtonText: 'OK',
            timer: 5000,
            timerProgressBar: true
          });
        }

        // Map business info
        const businessInfoData = {
          establishmentYear: providerData.exp || '',
          companySize: providerData.company_size || '',
          bio: providerData.bio || '',
          description: providerData.description || ''
        };
        setBusinessInfo(businessInfoData);

        // Map contact person info - set phone even if contact_person is null
        // Use cp_phone if available, otherwise fall back to phone
        const phone = providerData.cp_phone || providerData.phone || '';
        const countryCode = providerData.cp_dial_code?.replace('+', '') || providerData.dial_code?.replace('+', '') || '1';
        const countryIso = providerData.cp_country_code || providerData.country_code || 'US';

        if (phone || providerData.contact_person) {
          const contactInfo = {
            name: providerData.contact_person || '',
            phone: phone,
            countryCode: countryCode,
            countryIso: countryIso
          };
          setContactPersonInfo(contactInfo);
        }

        // Set service partner tier
        if (providerData.service_partner_tier) {
          setServicePartnerTier(providerData.service_partner_tier);
        }

        // Parse and set service types (comma-separated string to array)
        if (providerData.service_type) {
          const serviceTypesArray = providerData.service_type.split(',').map((s: string) => s.trim().toLowerCase()).filter((s: string) => s);
          setServiceTypes(serviceTypesArray);
        }

        // Parse and set selected services (comma-separated string of IDs to array of numbers)
        if (providerData.services) {
          const servicesArray = providerData.services.split(',').map((s: string) => parseInt(s.trim())).filter((id: number) => !isNaN(id));
          setSelectedServices(servicesArray);
        }

        // Map address data to onboarding map store
        if (providerData.address || providerData.city || providerData.locality || providerData.state || providerData.zip_code) {
          const addressData: {
            address?: string;
            city?: string;
            state?: string;
            zipCode?: string;
            country?: string;
            latitude?: number;
            longitude?: number;
          } = {};

          if (providerData.address) addressData.address = providerData.address;
          // Use city if available, otherwise use locality
          if (providerData.city) {
            addressData.city = providerData.city;
          } else if (providerData.locality) {
            addressData.city = providerData.locality;
          }
          if (providerData.state) addressData.state = providerData.state;
          if (providerData.zip_code) addressData.zipCode = providerData.zip_code;
          if (providerData.country) addressData.country = providerData.country;
          if (providerData.latitude) addressData.latitude = providerData.latitude;
          if (providerData.longitude) addressData.longitude = providerData.longitude;

          setAddressData(addressData);

          // Set unit number if available
          if (providerData.unit_number) {
            setUnitNumber(providerData.unit_number);
          }

          // Set marker position if lat/lng are available
          if (providerData.latitude && providerData.longitude) {
            const markerPos = {
              lat: providerData.latitude,
              lng: providerData.longitude
            };
            setMarkerPos(markerPos);
          }
        }
      } else {
        console.warn('Business profile response missing success or data:', response);
      }
    } catch (error) {
      console.error('Error fetching business info:', error);
      // Don't show error to user, just log it - this is optional data for onboarding
    }
  };

  // Fetch documents and business info when the component mounts
  useEffect(() => {
    fetchDocuments();
    fetchBusinessInfo();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Get current map data from the store
      const mapState = useOnboardingMapStore.getState();

      // Get form data from the form element
      const form = e.currentTarget;
      const formData = new FormData(form);

      // Add map data to form
      formData.set('latitude', mapState.latitude.toString());
      formData.set('longitude', mapState.longitude.toString());
      formData.set('country', mapState.country);
      formData.set('address', mapState.address);
      formData.set('city', mapState.city);
      formData.set('state', mapState.state);
      formData.set('zip_code', mapState.zipCode);

      // Add radius data
      if (mapState.radiusValues.emergency !== '') {
        formData.set('emergency_radius', mapState.radiusValues.emergency.toString());
      }
      if (mapState.radiusValues.scheduled !== '') {
        formData.set('scheduled_radius', mapState.radiusValues.scheduled.toString());
      }
      formData.set('unit', mapState.selectedUnit);

      // Submit the form data to the API
      const response = await partnerService.submitOnboarding(formData);

      // Handle successful submission
      if (response && (response.success || response.status === 'success')) {
        // Show success message and redirect
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Onboarding form submitted successfully!',
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          navigate('/professional/my-account?page=dashboard');
        });
      } else {
        // Handle API error response
        const errorMessage = response?.message || 'Unknown error occurred';
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: `Error: ${errorMessage}`,
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to submit onboarding form. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <OnboardingHeader />

      <section className="wrapper bg-light">
        <div className="container pb-14 pt-6 pb-md-16">
          <div className="row">
            <div className="col-lg-12 col-xl-8 col-xxl-8 mx-auto">
              <div className="card">
                <div className="card-body p-md-8 p-4 text-center">
                  <form
                    className="text-start"
                    id="providerForm"
                    onSubmit={handleSubmit}
                    noValidate
                  >
                    <input type="hidden" name="_token" defaultValue="RCbuusOWE1X94Cz1tw0J8kCoeBYbo4HxDaCc02ri" />

                    <div className="row">
                      {/* Contact Person Information */}
                      <ContactPersonInfo
                        key={`contact-${contactPersonInfo?.phone || 'empty'}`}
                        defaultName={contactPersonInfo?.name}
                        defaultPhone={contactPersonInfo?.phone}
                        defaultCountryCode={contactPersonInfo?.countryCode}
                        defaultCountryIso={contactPersonInfo?.countryIso}
                      />

                      {/* Partnership Level Selector */}
                      <PartnershipLevelSelector defaultSelectedLevel={servicePartnerTier} />

                      {/* Location Information */}
                      <div className="col-md-12">
                        <p className="lead mb-3 text-start">Location Information</p>
                      </div>

                      <LocationSection
                        isLoaded={isLoaded}
                        onAutocompleteLoad={onAutocompleteLoad}
                        onPlaceChanged={onPlaceChanged}
                      />

                      <MapSection
                        isLoaded={isLoaded}
                        onLoadMap={onLoadMap}
                        onUnmountMap={onUnmountMap}
                      />

                      <input type="hidden" name="latitude" value={latitude} />
                      <input type="hidden" name="longitude" value={longitude} />
                      <input type="hidden" name="country" value={country} />

                      <AddressSection />

                      <div className="col-md-12">
                        <p className="lead mb-1 text-start">Set Your Service Area</p>
                        <p className="mb-1">Tell us how far you’re willing to travel for jobs</p>
                      </div>
                      <RadiusSection />
                      <p>➡️ <span className="underline-2 blue">Pro tip: </span>
                        Keep it tight for emergencies, but expand for scheduled jobs to increase your chances
                        of steady work.
                      </p>

                    </div>

                    <div className="row">
                      {/* Service Type Selector */}
                      <ServiceTypeSelector
                        key={serviceTypes.length ? serviceTypes.join('-') : 'empty'}
                        defaultSelectedTypes={serviceTypes}
                      />
                      <ServiceSearchInput defaultSelectedServices={selectedServices} />

                      {/* Document Uploader */}
                      <DocumentUploader
                        initialDocuments={documents}
                        isLoading={isLoadingDocuments}
                        onDocumentChange={fetchDocuments}
                        documentTypes={documentTypes}
                      />

                      {/* Business Info */}
                      <BusinessInfo
                        key={`business-${businessInfo?.establishmentYear || 'empty'}`}
                        defaultValues={businessInfo || undefined}
                      />
                    </div>

                    {/* Submit Button */}
                    <SubmitButton isLoading={isLoading} />
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default OnboardingPage;