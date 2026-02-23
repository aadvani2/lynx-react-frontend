import PhoneInput from '../public/PhoneInput';
import { useState, useRef, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';
import { partnerService } from '../../services/partnerService/partnerService';
import type { PhoneInputData } from '../../types/auth';
import { useAuthStore } from '../../store/authStore';
import BackendImage from '../common/BackendImage/BackendImage';
import imageFailedToLoad from '../../assets/Icon/image-failed-to-load.png';
import validateImages from '../../utils/validateImages';
import { loadSummernote } from '../../utils/externalLoaders';

interface BusinessProfileContentProps {
  setActivePage: (page: string) => void;
}

interface BusinessProfileData {
  name?: string;
  business_type?: string;
  phone?: string;
  phone2?: string;
  zip_code?: string;
  city?: string;
  state?: string;
  exp?: number;
  company_size?: string;
  website?: string;
  bio?: string;
  contact_person?: string;
  cp_phone?: string;
  image?: string;
  dial_code?: string;
  country_code?: string;
  dial_code2?: string;
  country_code2?: string;
  cp_dial_code?: string;
  cp_country_code?: string;
  description?: string; // Added for Quill editor
}

interface BusinessType {
  id: number;
  name: string;
}

const BusinessProfileContent: React.FC<BusinessProfileContentProps> = ({ setActivePage }) => {

  const { updateUser } = useAuthStore();


  const handleBackToDashboard = () => {
    setActivePage("dashboard");
  };

  // Phone state (no hidden inputs / no getElementById)
  const [businessPhone, setBusinessPhone] = useState<PhoneInputData>({ phone: '', countryCode: '1', countryIso: 'US' });
  const [alternatePhone, setAlternatePhone] = useState<PhoneInputData>({ phone: '', countryCode: '1', countryIso: 'US' });
  const [contactPhone, setContactPhone] = useState<PhoneInputData>({ phone: '', countryCode: '1', countryIso: 'US' });

  // Image preview state
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Business profile data state
  const [businessProfileData, setBusinessProfileData] = useState<BusinessProfileData>({});
  const [businessTypes, setBusinessTypes] = useState<BusinessType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Summernote editor state
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [summernoteEditor, setSummernoteEditor] = useState<any>(null);
  const summernoteRef = useRef<HTMLTextAreaElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const summernoteEditorRef = useRef<any>(null);
const [isSummernoteReady, setIsSummernoteReady] = useState(false);

// Bridge Bootstrap 5 tooltips to jQuery for Summernote (which expects $.fn.tooltip)
type BootstrapNamespace = {
  Tooltip?: BootstrapTooltip;
};

type BootstrapTooltip = {
  new (element: Element, config?: Record<string, unknown>): unknown;
  getInstance?(element: Element): { dispose: () => void } | null;
};

// Load Summernote (and its jQuery/Select2 dependencies) only when this component mounts
useEffect(() => {
  let isMounted = true;
  (async () => {
    try {
      await loadSummernote();
      if (isMounted) setIsSummernoteReady(true);
    } catch (err) {
      console.warn('Failed to load Summernote assets', err);
    }
  })();
  return () => {
    isMounted = false;
  };
}, []);

// Ensure tooltip bridge is present once Summernote assets are ready
useEffect(() => {
  if (!isSummernoteReady) return;
  if (typeof window !== 'undefined') {
    const w = window as typeof window & { $?: { fn?: Record<string, unknown> }; bootstrap?: BootstrapNamespace };
    const $ = w.$;
    if (!$ || !$.fn) return;
    const Tooltip = w.bootstrap?.Tooltip as BootstrapTooltip | undefined;
    if ($.fn.tooltip || !Tooltip) return;

    $.fn.tooltip = function (config: Record<string, unknown> = {}) {
      const ctx = this as unknown as { each: (cb: (this: Element) => void) => void };
      return ctx.each(function (this: Element) {
        const existing = Tooltip.getInstance ? Tooltip.getInstance(this) : null;
        if (existing && typeof existing.dispose === 'function') {
          existing.dispose();
        }
        new Tooltip(this, config);
      });
    };
  }
}, [isSummernoteReady]);

  // Fetch business profile data function
  const fetchBusinessProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await partnerService.getBusinessProfileInfo();

      if (response?.success) {
        const data = response.data;

        // Set provider data (main business profile data) - data is in provider.dataValues
        const providerData = data.provider;
        if (providerData) {
          setBusinessProfileData(providerData);

          // Set existing profile image if available
          if (providerData.image) {
            setExistingImageUrl(providerData.image);
            // Only set preview if no new file is selected
            if (!profileImageFile) {
              setProfileImagePreview(providerData.image);
            }
            
            // Update user image in auth store so it shows in sidebar
            const { updateUserImage } = useAuthStore.getState();
            updateUserImage(providerData.image);
          } else {
            // Clear image if not available
            setExistingImageUrl(null);
            if (!profileImageFile) {
              setProfileImagePreview(null);
            }
            const { updateUserImage } = useAuthStore.getState();
            updateUserImage(null);
          }

          // Parse phone numbers and set phone states
          if (providerData.phone) {
            setBusinessPhone({
              phone: providerData.phone,
              countryCode: providerData.dial_code?.replace('+', '') || '1',
              countryIso: providerData.country_code || 'US'
            });
          }
          if (providerData.phone2) {
            setAlternatePhone({
              phone: providerData.phone2,
              countryCode: providerData.dial_code2?.replace('+', '') || '1',
              countryIso: providerData.country_code2 || 'US'
            });
          }
          if (providerData.cp_phone) {
            setContactPhone({
              phone: providerData.cp_phone,
              countryCode: providerData.cp_dial_code?.replace('+', '') || '1',
              countryIso: providerData.cp_country_code || 'US'
            });
          }
        }

        // Set business types from response.data.business_type
        if (data.business_type) {
          setBusinessTypes(data.business_type);
        }

        // The companySizes are not directly used in a dropdown that iterates over state,
        // but rather as hardcoded options. If there was a state for it,
        // it would be set here from `data.companySizes`.

        // Reinitialize Summernote editor after data is loaded
        setTimeout(() => {
          if (!isSummernoteReady) return;
          if (summernoteRef.current && typeof window !== 'undefined') {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const $ = (window as any).$;

            if ($ && $.fn && $.fn.summernote) {
              // Destroy existing editor if it exists
              if (summernoteEditorRef.current) {
                $(summernoteRef.current).summernote('destroy');
                summernoteEditorRef.current = null;
                setSummernoteEditor(null);
              }

              // Reinitialize the editor
              const editor = $(summernoteRef.current).summernote({
                height: 200,
                toolbar: [
                  ['style', ['bold', 'italic', 'underline', 'strikethrough']],
                  ['font', ['superscript', 'subscript']],
                  ['fontsize', ['fontsize']],
                  ['color', ['color']],
                  ['backcolor', ['backcolor']],
                  ['para', ['ul', 'ol', 'paragraph']],
                  ['height', ['height']],
                  ['insert', ['table', 'link', 'picture']],
                  ['view', ['fullscreen', 'codeview']]
                ],
                placeholder: 'Enter detailed description...',
                popover: {
                  image: [
                    ['image', ['resizeFull', 'resizeHalf', 'resizeQuarter', 'resizeNone']],
                    ['float', ['floatLeft', 'floatRight', 'floatNone']],
                    ['remove', ['removeMedia']]
                  ],
                  link: [
                    ['link', ['linkDialogShow', 'unlink']]
                  ],
                  table: [
                    ['add', ['addRowDown', 'addRowUp', 'addColLeft', 'addColRight']],
                    ['delete', ['deleteRow', 'deleteCol', 'deleteTable']],
                  ],
                  air: [
                    ['color', ['color']],
                    ['font', ['bold', 'underline', 'clear']],
                  ]
                },
                buttons: {
                  image: function () {
                    const ui = $.summernote.ui;
                    const button = ui.button({
                      contents: '<i class="note-icon-picture"></i>',
                      tooltip: 'Insert Image',
                      click: function () {
                        // Custom image insertion logic
                      }
                    });
                    return button.render();
                  }
                },
                callbacks: {
                  onInit: function () {
                    // Set content from fetched data
                    if (providerData?.description) {
                      $(summernoteRef.current).summernote('code', providerData.description);
                    }

                    // Add custom styling to make it look like the first image
                    const $editor = $(summernoteRef.current).next('.note-editor');
                    $editor.addClass('custom-summernote');

                    // Apply custom CSS to match the first image design
                    $editor.css({
                      'border': '1px solid #ced4da',
                      'border-radius': '0.375rem',
                      'overflow': 'hidden'
                    });

                    // Style the toolbar to be more compact and clean
                    const $toolbar = $editor.find('.note-toolbar');
                    $toolbar.css({
                      'border': 'none',
                      'border-bottom': '1px solid #e9ecef',
                      'padding': '8px 12px',
                      'background': '#f8f9fa',
                      'margin': '0'
                    });

                    // Style the editing area
                    const $editingArea = $editor.find('.note-editing-area');
                    $editingArea.css({
                      'border': 'none',
                      'margin': '0'
                    });

                    // Style the editable content area
                    const $editable = $editor.find('.note-editable');
                    $editable.css({
                      'padding': '12px 16px',
                      'min-height': '150px',
                      'border': 'none',
                      'outline': 'none',
                      'background': '#fff',
                      'font-family': 'inherit',
                      'font-size': '14px',
                      'line-height': '1.5'
                    });

                    // Style toolbar buttons to be more compact
                    $toolbar.find('.btn').css({
                      'padding': '4px 8px',
                      'margin': '0 1px',
                      'border': 'none',
                      'background': 'transparent',
                      'color': '#6c757d'
                    });

                    $toolbar.find('.btn:hover').css({
                      'background': '#e9ecef',
                      'color': '#495057'
                    });

                    // Style dropdowns
                    $toolbar.find('.dropdown-toggle').css({
                      'border': 'none',
                      'background': 'transparent'
                    });

                    // Remove default Summernote borders and shadows
                    $editor.find('.note-status-output').hide();
                    $editor.find('.note-resizebar').css({
                      'background': 'transparent',
                      'border': 'none'
                    });
                  }
                }
              });

              summernoteEditorRef.current = editor;
              setSummernoteEditor(editor);
            }
          }
        }, 100); // Small delay to ensure DOM is updated
      } else {
        setError('Failed to fetch business profile data');
      }
    } catch (err) {
      console.error('Error fetching business profile:', err);
      setError('Failed to fetch business profile data');
    } finally {
      setLoading(false);
    }
  }, [profileImageFile, isSummernoteReady]);

  // Fetch business profile data when component mounts
  useEffect(() => {
    fetchBusinessProfile();
  }, [fetchBusinessProfile]);

  // Initialize Summernote editor
  useEffect(() => {
    if (!isSummernoteReady) return;
    if (summernoteRef.current && !summernoteEditor && typeof window !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const $ = (window as any).$;

      // Check if jQuery and Summernote are available
      if (!$ || !$.fn || !$.fn.summernote) {
        console.warn('Summernote is not loaded. Please include Summernote CSS and JS files.');
        return;
      }

      try {
        // Initialize Summernote with improved styling
        const editor = $(summernoteRef.current).summernote({
          height: 200,
          toolbar: [
            ['style', ['bold', 'italic', 'underline', 'strikethrough']],
            ['font', ['superscript', 'subscript']],
            ['fontsize', ['fontsize']],
            ['color', ['color']],
            ['backcolor', ['backcolor']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['height', ['height']],
            ['insert', ['table', 'link', 'picture']],
            ['view', ['fullscreen', 'codeview']]
          ],
          placeholder: 'Enter detailed description...',
          popover: {
            image: [
              ['image', ['resizeFull', 'resizeHalf', 'resizeQuarter', 'resizeNone']],
              ['float', ['floatLeft', 'floatRight', 'floatNone']],
              ['remove', ['removeMedia']]
            ],
            link: [
              ['link', ['linkDialogShow', 'unlink']]
            ],
            table: [
              ['add', ['addRowDown', 'addRowUp', 'addColLeft', 'addColRight']],
              ['delete', ['deleteRow', 'deleteCol', 'deleteTable']],
            ],
            air: [
              ['color', ['color']],
              ['font', ['bold', 'underline', 'clear']],
            ]
          },
          buttons: {
            image: function () {
              const ui = $.summernote.ui;
              const button = ui.button({
                contents: '<i class="note-icon-picture"></i>',
                tooltip: 'Insert Image',
                click: function () {
                  // Custom image insertion logic
                }
              });
              return button.render();
            }
          },
          callbacks: {
            onInit: function () {
              // Set initial content if available
              if (businessProfileData.description) {
                $(summernoteRef.current).summernote('code', businessProfileData.description);
              }

              // Add custom styling to make it look like the first image
              const $editor = $(summernoteRef.current).next('.note-editor');
              $editor.addClass('custom-summernote');

              // Apply custom CSS to match the first image design
              $editor.css({
                'border': '1px solid #ced4da',
                'border-radius': '0.375rem',
                'overflow': 'hidden'
              });

              // Style the toolbar to be more compact and clean
              const $toolbar = $editor.find('.note-toolbar');
              $toolbar.css({
                'border': 'none',
                'border-bottom': '1px solid #e9ecef',
                'padding': '8px 12px',
                'background': '#f8f9fa',
                'margin': '0'
              });

              // Style the editing area
              const $editingArea = $editor.find('.note-editing-area');
              $editingArea.css({
                'border': 'none',
                'margin': '0'
              });

              // Style the editable content area
              const $editable = $editor.find('.note-editable');
              $editable.css({
                'padding': '12px 16px',
                'min-height': '150px',
                'border': 'none',
                'outline': 'none',
                'background': '#fff',
                'font-family': 'inherit',
                'font-size': '14px',
                'line-height': '1.5'
              });

              // Style toolbar buttons to be more compact
              $toolbar.find('.btn').css({
                'padding': '4px 8px',
                'margin': '0 1px',
                'border': 'none',
                'background': 'transparent',
                'color': '#6c757d'
              });

              $toolbar.find('.btn:hover').css({
                'background': '#e9ecef',
                'color': '#495057'
              });

              // Style dropdowns
              $toolbar.find('.dropdown-toggle').css({
                'border': 'none',
                'background': 'transparent'
              });

              // Remove default Summernote borders and shadows
              $editor.find('.note-status-output').hide();
              $editor.find('.note-resizebar').css({
                'background': 'transparent',
                'border': 'none'
              });
            }
          }
        });

        summernoteEditorRef.current = editor;
        setSummernoteEditor(editor);
      } catch (error) {
        console.error('Error initializing Summernote:', error);
        // Fallback to regular textarea if Summernote fails
        summernoteEditorRef.current = null;
        setSummernoteEditor(null);
      }
    }
  }, [businessProfileData.description, summernoteEditor, isSummernoteReady]);

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;

    // Revoke previous preview URL if it exists (blob URL)
    if (profileImagePreview && profileImagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(profileImagePreview);
    }

    if (!file) {
      setProfileImageFile(null);
      setProfileImagePreview(null);
      return;
    }

    // Validate the image file using the utility
    try {
      const validationResult = await validateImages([file], {
        maxFiles: 1,
        maxFileSize: 2 * 1024 * 1024, // 2MB
        maxDimensions: {
          width: 2000,
          height: 2000,
        },
        checkDuplicates: false, // Single file, no need to check duplicates
        useHashForDuplicates: false,
      });

      if (!validationResult.valid) {
        // Collect all error messages
        const errorMessages = validationResult.errors?.map(err => err.message).join('\n') || 'Image validation failed';
        
        // Show error alert
        await Swal.fire({
          icon: 'error',
          title: 'Invalid Image',
          html: `<div style="text-align: left; max-height: 400px; overflow-y: auto;">${errorMessages.split('\n').map(msg => `<p style="margin: 5px 0;">• ${msg}</p>`).join('')}</div>`,
          confirmButtonText: 'OK',
          width: '500px',
          confirmButtonColor: '#dc3545'
        });

        // Reset the file input
        event.target.value = '';
        return;
      }

      // Validation passed - set the file and create preview
      if (validationResult.files && validationResult.files.length > 0) {
        const validFile = validationResult.files[0];
        setProfileImageFile(validFile);

        // Create preview URL using FileReader (data URL)
        const reader = new FileReader();
        reader.onload = (e) => {
          const previewUrl = e.target?.result as string;
          setProfileImagePreview(previewUrl);
        };
        reader.readAsDataURL(validFile);
      }
    } catch (error) {
      // Handle unexpected errors
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error instanceof Error ? error.message : 'An error occurred while validating the image.',
        confirmButtonText: 'OK',
        confirmButtonColor: '#dc3545'
      });

      // Reset the file input
      event.target.value = '';
    }
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSaving) return; // Prevent multiple submissions

    try {
      setIsSaving(true);

      // Create FormData object manually to avoid duplicates
      const formData = new FormData();

      // Manually add form fields (excluding file inputs and phone fields)
      const form = event.currentTarget;
      const formElements = form.elements;

      for (let i = 0; i < formElements.length; i++) {
        const element = formElements[i] as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

        // Skip file inputs, phone inputs, and description textarea
        if (element.type === 'file' ||
          element.name === 'phone' ||
          element.name === 'dial_code' ||
          element.name === 'country_code' ||
          element.name === 'phone2' ||
          element.name === 'dial_code2' ||
          element.name === 'country_code2' ||
          element.name === 'cp_phone' ||
          element.name === 'cp_dial_code' ||
          element.name === 'cp_country_code' ||
          element.name === 'description') {
          continue;
        }

        // Add text inputs, selects, and textareas
        if ((element.type === 'text' || element.type === 'number' || element.tagName === 'SELECT' || element.tagName === 'TEXTAREA') &&
          element.name && element.value) {
          formData.append(element.name, element.value);
        }
      }

      // Add phone data from React state (these override any form values)
      formData.append('phone', businessPhone.phone);
      formData.append('dial_code', `+${businessPhone.countryCode}`);
      formData.append('country_code', businessPhone.countryIso.toUpperCase());

      formData.append('phone2', alternatePhone.phone);
      formData.append('dial_code2', `+${alternatePhone.countryCode}`);
      formData.append('country_code2', alternatePhone.countryIso.toUpperCase());

      formData.append('cp_phone', contactPhone.phone);
      formData.append('cp_dial_code', `+${contactPhone.countryCode}`);
      formData.append('cp_country_code', contactPhone.countryIso.toUpperCase());

      // Add image file from React state if selected (this overrides any form image)
      if (profileImageFile) {
        formData.append('image', profileImageFile);
      }

      // Add description from Summernote editor using ref (this overrides any form description)
      if (summernoteEditorRef.current && summernoteRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const $ = (window as any).$;
        const description = $(summernoteRef.current).summernote('code');
        formData.append('description', description);
      }

      // Call API
      const response = await partnerService.updateCompanyProfile(formData);

      if (response?.success) {
        // Show success message
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Business profile updated successfully!',
          timer: 3000,
          showConfirmButton: false
        });

        // Clear the file input and preview for new uploads
        setProfileImageFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }

        // Refetch the business profile data to show updated information
        await fetchBusinessProfile();

        // Update the user in the auth store with relevant data from the response
        const updatedUserData = {
          ...response.details,
          name: response.details.name,
        };
        
        // Update user image if available in response
        if (response.details?.image) {
          updatedUserData.image = response.details.image;
        }
        
        updateUser(updatedUserData);
        
        // Also update user image separately to ensure it's set
        const { updateUserImage } = useAuthStore.getState();
        if (response.details?.image) {
          updateUserImage(response.details.image);
        }

      } else {
        throw new Error(response?.message || 'Failed to update business profile');
      }
    } catch (error) {
      console.error('Error updating business profile:', error);

      // Show error message
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error instanceof Error ? error.message : 'Failed to update business profile. Please try again.',
        confirmButtonColor: '#3085d6'
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="card my-account-dashboard">
        <div className="card-header p-3 d-flex align-items-center">
          <div className="d-flex align-items-center justify-content-between">
            <button className="btn btn-primary btn-sm rounded-pill" onClick={handleBackToDashboard}>
              <i className="uil uil-arrow-left" /> Back
            </button>
            &nbsp;&nbsp;
            <h4 className="card-title mb-0">Business Profile</h4>
          </div>
        </div>
        <div className="card-body">
          <div className="w-100 text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading business profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card my-account-dashboard">
      <div className="card-header p-3 d-flex align-items-center">
        <div className="d-flex align-items-center justify-content-between">
          <button className="btn btn-primary btn-sm rounded-pill" onClick={handleBackToDashboard}>
            <i className="uil uil-arrow-left" /> Back
          </button>
          &nbsp;&nbsp;
          <h4 className="card-title mb-0">Business Profile</h4>
        </div>
      </div>
      <div className="card-body">
        {error && (
          <div className="alert alert-danger mb-3" role="alert">
            {error}
          </div>
        )}

        <form className="text-start" id="form-business-profile" onSubmit={handleSave}>
          <div className="row">
            <div className="col-xxl-6">
              <p className="lead mb-1 mb-md-3 text-start">Business Information</p>
              <div className="form-floating mb-2 mb-md-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  className="form-control"
                  name="image"
                  id="profile_image"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageChange}
                />
                <label htmlFor="profile_image">Profile Picture (JPG, PNG, WEBP - Max 2MB, 2000x2000px)</label>

                {/* Image Preview - Show new file preview or existing image */}
                {(profileImagePreview || existingImageUrl) && (
                  <div className="mt-3">
                    <div style={{ width: '100px', height: '100px' }}>
                      <BackendImage
                        src={profileImagePreview || existingImageUrl || ''}
                        alt="Profile Preview"
                        className="w-100 h-100 object-fit-cover rounded"
                        placeholderImage={imageFailedToLoad}
                        placeholderText=""
                        useBackendUrl={!profileImageFile} // Use backend URL for existing images, blob URL for new files
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="form-floating mb-2 mb-md-4">
                <input type="text" className="form-control" name="name" placeholder="Business Name" id="business_name" required defaultValue={businessProfileData.name || "Idestiny office"} />
                <label htmlFor="business_name">Business Name</label>
              </div>
              <div className="form-floating mb-2 mb-md-4">
                <select className="form-select" name="business_type" id="business_type" required defaultValue={businessProfileData.business_type}>
                  <option value="" disabled>Business Type</option>
                  {businessTypes.map((type) => (
                    <option
                      key={type.id}
                      value={type.name}
                    >
                      {type.name}
                    </option>
                  ))}
                  {/* Fallback options if no business types from API */}
                  {businessTypes.length === 0 && (
                    <>
                      <option value="Individual/Sole-Proprietor">Individual/Sole-Proprietor</option>
                      <option value="Partnership">Partnership</option>
                      <option value="Limited Liability Company">Limited Liability Company</option>
                      <option value="Corporation">Corporation</option>
                      <option value="Other">Other</option>
                    </>
                  )}
                </select>
                <label htmlFor="business_type">Business Type</label>
              </div>
              <div className="form-floating mb-2 mb-md-4">
                <div className="form-group">
                  <PhoneInput
                    name="phone"
                    id="phone"
                    placeholder="Phone"
                    onChange={(data) => setBusinessPhone(data)}
                    initialValue={businessPhone.phone}
                    defaultCountry={businessPhone.countryIso?.toLowerCase() || 'us'}
                  />
                </div>
              </div>
              <div className="form-floating mb-2 mb-md-4">
                <div className="form-group">
                  <PhoneInput
                    name="phone2"
                    id="phone2"
                    placeholder="Alternate Phone (Optional)"
                    onChange={(data) => setAlternatePhone(data)}
                    initialValue={alternatePhone.phone}
                    defaultCountry={alternatePhone.countryIso?.toLowerCase() || 'us'}
                  />
                </div>
              </div>
              <div className="form-floating mb-2 mb-md-4">
                <input type="text" className="form-control zip_code_val" name="zip_code" placeholder="Zip Code" id="zip_code" required defaultValue={businessProfileData.zip_code} />
                <label htmlFor="zip_code">Zip Code</label>
              </div>
              <div className="form-floating mb-2 mb-md-4">
                <input type="text" className="form-control" name="city" placeholder="City" id="city" readOnly defaultValue={businessProfileData.city} />
                <label htmlFor="city">City</label>
              </div>
              <div className="form-floating mb-2 mb-md-4">
                <input type="text" className="form-control" name="state" placeholder="State" id="state" readOnly defaultValue={businessProfileData.state} />
                <label htmlFor="state">State</label>
              </div>
            </div>
            <div className="col-xxl-6">
              <p className="lead mb-1 mb-md-3 text-start">Company Information</p>
              <div className="form-floating mb-2 mb-md-4">
                <input type="number" onKeyDown={(e) => { if (e.key === '.') e.preventDefault(); }} onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]*/g, ''); }} className="form-control" name="exp" placeholder="Establishment Year" id="exp" required defaultValue={businessProfileData.exp} />
                <label htmlFor="loginName">Establishment Year</label>
              </div>
              <div className="form-floating mb-2 mb-md-4">
                <select className="form-select" name="company_size" required defaultValue={businessProfileData.company_size}>
                  <option value="" disabled>Business Size</option>
                  <option value="1 to 10 Employees">1 to 10 Employees</option>
                  <option value="11 to 50 Employees">11 to 50 Employees</option>
                  <option value="51 to 100 Employees">51 to 100 Employees</option>
                  <option value="101 to 500 Employees">101 to 500 Employees</option>
                  <option value="501 to 1000 Employees">501 to 1000 Employees</option>
                  <option value="1001 or More Employees">1001 or More Employees</option>
                </select>
                <label htmlFor="loginName">Company Size</label>
              </div>
              <div className="form-floating mb-2 mb-md-4">
                <input type="text" name="website" className="form-control" placeholder="Website" id="loginWebsite" defaultValue={businessProfileData.website} />
                <label htmlFor="loginWebsite">Website</label>
              </div>
              <div className="form-floating mb-2 mb-md-4">
                <textarea className="form-control" name="bio" placeholder="Short Bio" id="bio" defaultValue={businessProfileData.bio || ""} />
                <label htmlFor="loginName">Short Bio</label>
              </div>
              {/* Summernote Rich Text Editor for Description */}
              <div className="mb-2 mb-md-4">
                <label htmlFor="description" className="form-label fw-bold mb-2">Description</label>
                <div className="summernote-container">
                  <textarea
                    ref={summernoteRef}
                    className="form-control summernote-editor"
                    name="description"
                    id="description"
                    placeholder="Enter detailed description..."
                    style={{
                      display: 'none' // Hide the original textarea, Summernote will replace it
                    }}
                  />
                </div>
                <div className="form-text mt-2">Enter a detailed description of your business services and expertise.</div>
              </div>
              <p className="lead mb-1 mb-md-3 text-start">Contact Person Information</p>
              <div className="form-floating mb-2 mb-md-4">
                <input type="text" className="form-control" name="contact_person" placeholder="Name" id="contact_person" required defaultValue={businessProfileData.contact_person} />
                <label htmlFor="loginName">Name</label>
              </div>
              <div className="form-floating mb-4">
                <div className="form-group">
                  <PhoneInput
                    name="cp_phone"
                    id="cp_phone"
                    placeholder="Contact Phone"
                    onChange={(data) => setContactPhone(data)}
                    initialValue={contactPhone.phone}
                    defaultCountry={contactPhone.countryIso?.toLowerCase() || 'us'}
                  />
                </div>
              </div>
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="btn btn-primary rounded-pill btn-login"
                id="submit-business-profile"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <i className="fas fa-spinner fa-spin me-2"></i>
                    Saving...
                  </>
                ) : (
                  'Save'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BusinessProfileContent; 