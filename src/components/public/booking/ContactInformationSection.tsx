import React, { Suspense, lazy, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useAddressSelectionStore } from '../../../store/addressSelectionStore';
import PhoneInput from '../../public/PhoneInput';

const StripeElementsWrapper = lazy(() => import('./StripeElementsWrapper'));
const StripeCardForm = lazy(() => import('../../customer/StripeCardForm'));

interface ContactInformationSectionProps {
    onPrevious: () => void;
    onNext: () => void;
    apiResponse?: {
        success: boolean;
        user_info?: {
            allCards?: Array<{
                id?: string;
                last4: string;
                exp_month?: number;
                exp_year?: number;
                brand?: string;
            }>;
            payable_amount?: number;
            user_name?: string;
            user_phone?: string;
            user_dial_code?: string;
            country_code?: string;
            message?: string;
        };
    } | null;
    isLoading?: boolean;
}

const ContactInformationSection: React.FC<ContactInformationSectionProps> = ({
    onPrevious,
    apiResponse: propApiResponse
}) => {
    // Zustand store state and actions
    const {
        contactFormData,
        phoneData,
        previewImages,
        showPaymentSection,
        isLoading,
        contactApiResponse,
        setContactApiResponse,
        setContactFormData,
        setPhoneData,
        setShowPaymentSection,
        setPreviewImages,
        handleInputChange,
        handlePhoneChange,
        handlePaymentMethodChange,
        handleDrop,
        handleDragOver,
        handleBrowseClick,
        removeImage,
        handleAddRequest
    } = useAddressSelectionStore();

    // Local state for add card functionality
    const [showAddCard, setShowAddCard] = useState(false);
    const [error, setError] = useState<string | null>(null);


    // Handle API response from parent component
    useEffect(() => {
        if (propApiResponse) {
            setContactApiResponse(propApiResponse);

            // Pre-populate form with user data if available
            if (propApiResponse?.success && propApiResponse?.user_info) {
                const userInfo = propApiResponse.user_info;
                setContactFormData({
                    contact_person: userInfo.user_name || '',
                    phone: userInfo.user_phone || '',
                    dial_code: userInfo.user_dial_code || '+1',
                    country_code: userInfo.country_code || 'US',
                    description: userInfo.message || '',
                    files: [],
                    selectedPaymentMethodCard: userInfo.allCards && userInfo.allCards.length > 0 ? userInfo.allCards[0].id || '' : ''
                });

                // Set phone data for PhoneInput component
                setPhoneData({
                    phone: userInfo.user_phone || '',
                    countryCode: userInfo.user_dial_code?.replace('+', '') || '1',
                    countryIso: userInfo.country_code || 'US'
                });

                // Show payment section only if allCards array has data
                if (userInfo.allCards && Array.isArray(userInfo.allCards) && userInfo.allCards.length > 0) {
                    setShowPaymentSection(true);
                } else {
                    setShowPaymentSection(false);
                }
            } else {
                // If no user_info or API call failed, hide payment section
                setShowPaymentSection(false);
            }
        }
    }, [propApiResponse, setContactApiResponse, setContactFormData, setPhoneData, setShowPaymentSection]);

    // Cleanup effect to clear images when component unmounts
    useEffect(() => {
        return () => {
            // Clear preview images and files when component unmounts
            setPreviewImages([]);
            setContactFormData({
                contact_person: '',
                phone: '',
                dial_code: '+1',
                country_code: 'US',
                description: '',
                files: [],
                selectedPaymentMethodCard: ''
            });
        };
    }, [setPreviewImages, setContactFormData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await handleAddRequest();
    };

    const handlePrevious = () => {
        // Clear preview images and files when navigating back
        setPreviewImages([]);
        setContactFormData({
            contact_person: '',
            phone: '',
            dial_code: '+1',
            country_code: 'US',
            description: '',
            files: [],
            selectedPaymentMethodCard: ''
        });
        onPrevious();
    };

    // Add card handlers
    const handleSaveCard = () => {
        // The actual save card API call is handled by StripeCardForm component
        // This function is called after successful card save
    };

    const handleCloseAddCard = () => {
        setShowAddCard(false);
        setError(null);
    };


    return (
        <div className="row" id="contactInformationDiv">
            <hr className="my-8" />
            <div id="user-contact-information">
                <section id="selection1" className="wrapper bg-light">
                    <div className="container">
                        <form id="contactInformationForm" encType="multipart/form-data" onSubmit={handleSubmit}>
                            <div className="row" id="contactInformationFields">
                                <div className="col-lg-10 offset-lg-1 col-xl-8 offset-xl-2">
                                    <h3 className="mb-2 text-black fw-semibold">Contact Information</h3>
                                    <div className="row text-start">
                                        <div className="col-md-12">
                                            <div className="row gx-4">
                                                <div className="col-md-6">
                                                    <div className="form-floating mb-4">
                                                        <input
                                                            id="form_name"
                                                            type="text"
                                                            name="contact_person"
                                                            className="form-control"
                                                            placeholder="Jane"
                                                            value={contactFormData.contact_person}
                                                            onChange={handleInputChange}
                                                            required
                                                        />
                                                        <label htmlFor="form_name">Name *</label>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-floating mb-4">
                                                        <PhoneInput
                                                            onChange={handlePhoneChange}
                                                            initialValue={phoneData.phone}
                                                            defaultCountry={phoneData.countryIso.toLowerCase()}
                                                            className="form-control"
                                                            placeholder="Phone"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-10 offset-lg-1 col-xl-8 offset-xl-2">
                                    <h3 className="mb-2 text-black fw-semibold">Tell Us What You Need Help With</h3>
                                    <div className="row text-start">
                                        <div className="col-md-12">
                                            <div className="row gx-4">
                                                <div className="col-12">
                                                    <h6 className="text-black fw-medium mb-0">Job Description *</h6>
                                                    <p className="text-black-50 fw-medium mb-1 fs-14">Let us know what needs to be serviced.</p>
                                                    <div className="mb-4">
                                                        <textarea
                                                            className="form-control"
                                                            name="description"
                                                            placeholder="Describe the issue or service you need"
                                                            rows={4}
                                                            onChange={handleInputChange}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <h6 className="text-black fw-medium mb-0">Upload Images (Optional)</h6>
                                                    <p className="text-black-50 fw-medium mb-1 fs-14">Add clear photos of the item or
                                                        area that needs repair</p>
                                                    <div
                                                        id="myDropzone"
                                                        className="mb-4 border-2 border-dashed border-secondary rounded p-4 text-center"
                                                        style={{
                                                            cursor: 'pointer',
                                                            minHeight: '200px',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            backgroundColor: '#f8f9fa'
                                                        }}
                                                        onDrop={handleDrop}
                                                        onDragOver={handleDragOver}
                                                        onClick={handleBrowseClick}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlnsXlink="http://www.w3.org/1999/xlink" width={64} height={64} x={0} y={0} viewBox="0 0 512 512" className="mb-3">
                                                            <g>
                                                                <path d="M297.499 300.836c4.099 0 8.181-1.67 11.142-4.952 5.552-6.149 5.063-15.636-1.089-21.185l-43.063-38.854c-5.802-5.283-10.863-5.283-16.978 0l-43.073 38.852c-6.152 5.549-6.642 15.032-1.094 21.186 5.549 6.151 15.033 6.642 21.186 1.095L241 282.119v105.994c0 8.285 6.716 15.001 15 15.001s15-6.716 15-15.001V282.126l16.456 14.847a14.934 14.934 0 0 0 10.043 3.863z" fill="#666666" opacity={1} data-original="#000000" />
                                                                <path d="M427.563 229.276c-13.322-14.664-30.727-24.692-49.82-28.879-15.485-53.607-65.095-91.511-121.74-91.511-56.658 0-106.268 37.902-121.743 91.513-19.094 4.188-36.496 14.216-49.819 28.879-15.886 17.482-24.635 40.129-24.635 63.767 0 52.297 42.55 94.844 94.85 94.844h49.943c8.284 0 15-6.716 15-15 0-8.283-6.716-15-15-15h-49.943c-35.758 0-64.85-29.089-64.85-64.844 0-33.398 24.665-60.725 58.18-64.51 7.024-.983 11.591-4.221 13.191-11.985 8.985-45.001 48.866-77.663 94.827-77.663 45.95 0 84.826 32.385 94.828 77.666 2.025 9.048 4.502 10.531 13.192 11.982 32.477 3.09 58.179 31.107 58.179 64.51 0 35.755-29.086 64.844-64.838 64.844H307.4c-8.284 0-15.001 6.717-15.001 15 0 8.284 6.717 15 15.001 15h49.965c52.294 0 94.838-42.547 94.838-94.844-.006-23.638-8.755-46.284-24.64-63.769z" fill="#666666" opacity={1} data-original="#000000" />
                                                            </g>
                                                        </svg>
                                                        <h5 className="text-muted">Choose file or drag & drop here</h5>
                                                        <p className="text-muted small">Limit 10 images</p>
                                                        <span className="btn btn-outline-primary bg-white text-primary d-inline-flex">Browse</span>
                                                    </div>

                                                    {/* Image Previews */}
                                                    {previewImages.length > 0 && (
                                                        <div className="d-flex flex-wrap gap-2 mb-3">
                                                            {previewImages.map((preview, index) => (
                                                                <div key={index} className="position-relative" style={{ width: '100px', height: '100px' }}>
                                                                    <img
                                                                        src={preview}
                                                                        alt={`Preview ${index + 1}`}
                                                                        className="w-100 h-100 object-fit-cover rounded border"
                                                                        style={{ objectFit: 'cover' }}
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-sm btn-danger position-absolute top-0 end-0 rounded-circle"
                                                                        style={{
                                                                            width: '24px',
                                                                            height: '24px',
                                                                            padding: '0',
                                                                            fontSize: '12px',
                                                                            lineHeight: '1'
                                                                        }}
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            removeImage(index);
                                                                        }}
                                                                    >
                                                                        ×
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Payment Section */}
                            {showPaymentSection && (
                                <div className="row mt-4 d-none">
                                    <div className="col-lg-10 offset-lg-1 col-xl-8 offset-xl-2">
                                        <h3 className="mb-2 text-black fw-semibold">Select Payment Method</h3>
                                        <div className="card p-4">
                                            <div className="card-listing d-flex gap-4 flex-column">
                                                {contactApiResponse?.user_info?.allCards?.map((card, index: number) => (
                                                    <div key={index} className="card-list-box w-100">
                                                        <input
                                                            type="radio"
                                                            name="paymentMethodCard"
                                                            value={card.id || `card-${index}`}
                                                            id={`card-${index}`}
                                                            defaultChecked={index === 0}
                                                            onChange={(e) => {
                                                                if (e.target.checked && card.id) {
                                                                    handlePaymentMethodChange(card.id);
                                                                }
                                                            }}
                                                        />
                                                        <label htmlFor={`card-${index}`} className="card-body p-3 lift">
                                                            <span className="justify-content-between align-items-center w-100">
                                                                <span className="d-flex text-body justify-content-between w-100 align-items-center card-dtl-box">
                                                                    <div className="desc text-start">
                                                                        <p className="mb-0 name fw-medium">**** **** **** {card.last4}</p>
                                                                        <p className="mb-0 fs-10 email">
                                                                            {card.exp_month}/{card.exp_year}
                                                                        </p>
                                                                    </div>
                                                                    <div className="edit-delete text-end">
                                                                        <div className="profile-image-container me-0 d-flex align-items-center gap-1 justify-content-end">
                                                                            <span className="icon fs-lg">
                                                                                <i className="uil uil-card-atm" />
                                                                            </span>
                                                                            <p className="mb-0 name fw-medium">{card.brand || 'Card'}</p>
                                                                        </div>
                                                                        {index === 0 && (
                                                                            <span className="default-card d-inline-flex align-items-center">
                                                                                <span className="badge bg-green rounded-pill primaryText text-primary">Primary</span>
                                                                                <span className="badge-uil d-inline-flex">
                                                                                    <i className="uil uil-check-circle text-green fs-20 d-inline-flex" />
                                                                                </span>
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </span>
                                                            </span>
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Add New Card Section */}
                                            {showAddCard && (
                                                <div>
                                                    <Suspense fallback={null}>
                                                        <StripeElementsWrapper>
                                                            <StripeCardForm
                                                                onSave={handleSaveCard}
                                                                onClose={handleCloseAddCard}
                                                                onSuccess={() => {
                                                                    Swal.fire({
                                                                        title: 'Success!',
                                                                        text: 'Card saved successfully.',
                                                                        icon: 'success',
                                                                        timer: 1500,
                                                                        showConfirmButton: false
                                                                    });
                                                                    setShowAddCard(false);
                                                                    // Note: The card will be available in the next API call
                                                                    // The contact-information API response will include the new card
                                                                }}
                                                                onError={(msg) => setError(msg)}
                                                            />
                                                        </StripeElementsWrapper>
                                                    </Suspense>
                                                </div>
                                            )}

                                            {!showAddCard && (
                                                <a href="javascript:void(0);" className="ms-auto mt-3 addNewCardOpen btn-link" onClick={() => setShowAddCard(!showAddCard)}>
                                                    <i className="uil uil-plus" /> Add New Card
                                                </a>
                                            )}

                                            {error && (
                                                <div className="alert alert-danger mt-3">
                                                    {error}
                                                </div>
                                            )}

                                            <div className="note-card mt-1">
                                                <p className="fs-13 mb-0">
                                                    <b>Note:-</b> You will be charged a service fee of <b>${contactApiResponse?.user_info?.payable_amount || 60}</b> once the service provider accepts your request.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="row">
                                <div className="col-lg-6 col-md-8 d-flex gap-3 justify-content-between m-auto text-center mt-4">
                                    <button
                                        type="button"
                                        onClick={handlePrevious}
                                        className="btn btn-outline-primary rounded-pill w-20"
                                        disabled={isLoading}
                                    >
                                        <i className="uil uil-angle-double-left fs-30 lh-1" /> Previous
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary rounded-pill w-20"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Processing...
                                            </>
                                        ) : (
                                            'Book Service'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </section>
            </div>


        </div>
    );
};

export default ContactInformationSection;
