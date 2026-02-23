import { useEffect, useMemo, useState } from 'react';
import { customerService } from '../services/customerServices/customerService';
import { useAuthStore } from '../store/authStore';
import Swal from '../lib/swal';
import validateImages from '../utils/validateImages';

export interface CustomerProfileFormData {
  name: string;
  email: string;
  phone: string;
  zip_code: string | null | string;
  city: string | null | string;
  state: string | null | string;
  dial_code: string;
  country_code: string;
}

export function useCustomerProfile() {
  const [formData, setFormData] = useState<CustomerProfileFormData>({
    name: '',
    email: '',
    phone: '',
    zip_code: '',
    city: '',
    state: '',
    dial_code: '+1',
    country_code: 'US',
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  // Derived value for PhoneInput initial number
  const fullPhoneForInit = useMemo(() => `${formData.dial_code || ''}${formData.phone || ''}`,[formData.dial_code, formData.phone]);

  // Load profile info on mount
  useEffect(() => {
    const fetchProfileInfo = async () => {
      try {
        setLoading(true);
        setError(null);
        const tzOffsetMinutes = new Date().getTimezoneOffset();
        const timezoneHours = -tzOffsetMinutes / 60;

        const payload = { user_timezone: timezoneHours, page: 1 };
        const response = await customerService.getEditProfileInfo(payload);
        const data = response?.data || response;
        const user = data?.user || data?.data?.user || data?.data || data;

        setFormData(prev => ({
          ...prev,
          name: user?.name ?? prev.name,
          email: user?.email ?? prev.email,
          phone: user?.phone ?? prev.phone,
          zip_code: user?.zip_code ?? prev.zip_code,
          city: user?.city ?? prev.city,
          state: user?.state ?? prev.state,
          dial_code: user?.dial_code ? `${user.dial_code}` : prev.dial_code,
          country_code: user?.country_code ?? prev.country_code,
        }));

        // Set image preview from server image path if present
        if (user?.image) {
          try {
            const base = import.meta.env.VITE_API_BASE_URL as string;
            const origin = new URL(base).origin;
            const imgPath: string = String(user.image);
            const absolute = /^(https?:|data:|blob:)/i.test(imgPath)
              ? imgPath
              : `${origin}/${imgPath.startsWith('/') ? imgPath.slice(1) : imgPath}`;
            const devRelative = `/${imgPath.startsWith('/') ? imgPath.slice(1) : imgPath}`;
            const finalUrl = import.meta.env.DEV ? devRelative : absolute;
            setImagePreviewUrl(finalUrl);
            
            // Update local storage with the processed image URL
            const { updateUserImage } = useAuthStore.getState();
            updateUserImage(finalUrl);
          } catch {
            // Fallback to raw image path
            const fallbackUrl = String(user.image);
            setImagePreviewUrl(fallbackUrl);
            
            // Update local storage with fallback URL
            const { updateUserImage } = useAuthStore.getState();
            updateUserImage(fallbackUrl);
          }
        } else {
          setImagePreviewUrl(null);
          
          // Clear image from local storage
          const { updateUserImage } = useAuthStore.getState();
          updateUserImage(null);
        }
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Failed to load profile info';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileInfo();
  }, []);

  // Clean up object URL for preview (only for blob URLs)
  useEffect(() => {
    return () => {
      if (imagePreviewUrl && imagePreviewUrl.startsWith('blob:')) URL.revokeObjectURL(imagePreviewUrl);
    };
  }, [imagePreviewUrl]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    // Revoke previous preview URL if it exists
    if (imagePreviewUrl && imagePreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreviewUrl);
    }

    if (!file) {
      setSelectedImageFile(null);
      setImagePreviewUrl(null);
      
      // Clear image from local storage when file is removed
      const { updateUserImage } = useAuthStore.getState();
      updateUserImage(null);
      return;
    }

    // Validate the image file
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
          customClass: {
            popup: 'swal2-popup swal2-modal swal2-show',
            confirmButton: 'btn btn-primary rounded-pill'
          },
          buttonsStyling: false
        });

        // Reset the file input
        e.target.value = '';
        return;
      }

      // Validation passed - set the file and create preview
      if (validationResult.files && validationResult.files.length > 0) {
        const validFile = validationResult.files[0];
        setSelectedImageFile(validFile);
        const objectUrl = URL.createObjectURL(validFile);
        setImagePreviewUrl(objectUrl);
      }
    } catch (error) {
      // Handle unexpected errors
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error instanceof Error ? error.message : 'An error occurred while validating the image.',
        confirmButtonText: 'OK',
        customClass: {
          popup: 'swal2-popup swal2-modal swal2-show',
          confirmButton: 'btn btn-primary rounded-pill'
        },
        buttonsStyling: false
      });

      // Reset the file input
      e.target.value = '';
    }
  };

  const handlePhoneChange = (update: { phone: string; countryCode: string; countryIso: string }) => {
    setFormData(prev => ({
      ...prev,
      phone: update.phone,
      dial_code: `+${update.countryCode}`,
      country_code: update.countryIso,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      setLoading(true);

      const fd = new FormData();
      fd.append('name', String(formData.name ?? ''));
      // Send only the phone number without country code
      fd.append('phone', formData.phone);
      fd.append('dial_code', formData.dial_code);
      fd.append('country_code', formData.country_code);
      fd.append('city', formData.city ? String(formData.city) : '');
      fd.append('state', formData.state ? String(formData.state) : '');
      fd.append('zip_code', formData.zip_code ? String(formData.zip_code) : '');
      if (selectedImageFile) {
        fd.append('image', selectedImageFile);
      }

      await customerService.updateProfile(fd);

      // Update auth store so header/sidebar reflect new name immediately
      const { user, updateUser, updateUserImage } = useAuthStore.getState();
      if (user) {
        updateUser({ ...user, name: formData.name });
        
        // If a new image was uploaded, update the image in local storage
        if (selectedImageFile && imagePreviewUrl) {
          // For newly uploaded files, we use the blob URL as it will be processed by the server
          // The server will return the new image path in the response
          updateUserImage(imagePreviewUrl);
        }
      }

      // SweetAlert2 success modal
      await Swal.fire({
        title: 'Profile Updated',
        text: 'Your profile has been updated successfully.',
        icon: 'success',
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to update profile';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    loading,
    error,
    success,
    selectedImageFile,
    imagePreviewUrl,
    fullPhoneForInit,
    handleInputChange,
    handleFileChange,
    handlePhoneChange,
    handleSubmit,
  };
}