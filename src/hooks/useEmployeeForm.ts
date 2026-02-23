import { useState } from 'react';
import { partnerService } from '../services/partnerService/partnerService';
import { useEmployeeStore } from '../store/employeeStore';
import Swal from '../lib/swal';
import type { PhoneInputData } from '../types/components';
import validateImages from '../utils/validateImages';



interface FormData {
  name: string;
  email: string;
  phone1: string;
  phone2: string;
  phone1_country_code: string;
  phone2_country_code: string;
  phone1_dial_code: string;
  phone2_dial_code: string;
  birth_date: string;
  description: string;
  password: string;
  confirm_password: string;
  image: File | null;
  displayImage: string;
}

interface EmployeeEditData {
  id: number;
  name: string;
  email: string;
  phone: string;
  phone2?: string;
  dial_code: string;
  country_code: string;
  dial_code2?: string;
  country_code2?: string;
  birth_date: string;
  description: string;
  image?: string;
}

// Helper function to convert date from DD/MM/YYYY to YYYY-MM-DD
const convertDateFormat = (dateString: string): string => {
  if (!dateString) return '';

  try {
    // Check if it's already in YYYY-MM-DD format
    if (dateString.includes('-') && dateString.length === 10) {
      return dateString;
    }

    // Convert from DD/MM/YYYY to YYYY-MM-DD
    if (dateString.includes('/')) {
      const [day, month, year] = dateString.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }

    return dateString;
  } catch (error) {
    console.error('Error converting date format:', error);
    return '';
  }
};

export const useEmployeeForm = (refreshEmployees?: () => void) => {
  const {
    showAddForm,
    isEditMode,
    setShowAddForm,
    setIsEditMode,
    addEmployeeToList,
    updateEmployeeInList
  } = useEmployeeStore();

  const [editingEmployeeId, setEditingEmployeeId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone1: '',
    phone2: '',
    phone1_country_code: 'US',
    phone2_country_code: 'US',
    phone1_dial_code: '1',
    phone2_dial_code: '1',
    birth_date: '',
    description: '',
    password: '',
    confirm_password: '',
    image: null,
    displayImage: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhoneChange = (data: PhoneInputData, field: 'phone1' | 'phone2') => {
    setFormData(prev => ({
      ...prev,
      [field]: data.phone,
      [`${field}_country_code`]: data.countryIso,
      [`${field}_dial_code`]: data.countryCode
    }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    // Revoke previous preview URL if it exists (blob URL)
    setFormData(prev => {
      if (prev.displayImage && prev.displayImage.startsWith('blob:')) {
        URL.revokeObjectURL(prev.displayImage);
      }
      return prev;
    });

    if (!file) {
      setFormData(prev => ({
        ...prev,
        image: null,
        displayImage: ''
      }));
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
          confirmButtonColor: '#dc3545'
        });

        // Reset the file input
        e.target.value = '';
        return;
      }

      // Validation passed - set the file and create preview
      if (validationResult.files && validationResult.files.length > 0) {
        const validFile = validationResult.files[0];
        const objectUrl = URL.createObjectURL(validFile);
        setFormData(prev => ({
          ...prev,
          image: validFile,
          displayImage: objectUrl
        }));
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
      e.target.value = '';
    }
  };

  const resetForm = () => {
    // Revoke blob URL before resetting
    if (formData.displayImage && formData.displayImage.startsWith('blob:')) {
      URL.revokeObjectURL(formData.displayImage);
    }
    
    setFormData({
      name: '',
      email: '',
      phone1: '',
      phone2: '',
      phone1_country_code: 'US',
      phone2_country_code: 'US',
      phone1_dial_code: '1',
      phone2_dial_code: '1',
      birth_date: '',
      description: '',
      password: '',
      confirm_password: '',
      image: null,
      displayImage: ''
    });
    setEditingEmployeeId(null);
    setIsEditMode(false);
  };

  const populateFormForEdit = (employee: EmployeeEditData) => {
    console.log('Populating form with employee data:', employee);

    setFormData({
      name: employee.name || '',
      email: employee.email || '',
      phone1: employee.phone || '',
      phone2: employee.phone2 || '',
      phone1_country_code: employee.country_code || 'US',
      phone2_country_code: employee.country_code2 || 'US',
      phone1_dial_code: employee.dial_code?.replace('+', '') || '1',
      phone2_dial_code: employee.dial_code2?.replace('+', '') || '1',
      birth_date: convertDateFormat(employee.birth_date) || '',
      description: employee.description || '',
      password: '',
      confirm_password: '',
      image: null,
      displayImage: employee.image || ''
    });
    setEditingEmployeeId(employee.id);
    setIsEditMode(true);
    setShowAddForm(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.email || !formData.phone1 || !formData.birth_date) {
        Swal.fire({
          title: 'Validation Error',
          text: 'Please fill in all required fields (Name, Email, Phone 1, Birth Date)',
          icon: 'error',
          confirmButtonColor: '#007bff'
        });
        return;
      }

      // Validate password if not in edit mode
      if (!isEditMode && (!formData.password || !formData.confirm_password)) {
        Swal.fire({
          title: 'Validation Error',
          text: 'Please enter both password and confirm password',
          icon: 'error',
          showConfirmButton: false,
          timer: 2000,
        });
        return;
      }

      // Validate password confirmation
      if (formData.password && formData.password !== formData.confirm_password) {
        Swal.fire({
          title: 'Validation Error',
          text: 'Password and confirm password do not match',
          icon: 'error',
          showConfirmButton: false,
          timer: 2000,
        });
        return;
      }

      // Prepare payload - use FormData for file uploads
      const payload = new FormData();

      // Add all form fields to FormData
      payload.append('name', formData.name);
      payload.append('email', formData.email);
      payload.append('phone', formData.phone1);
      payload.append('phone2', formData.phone2 || '');
      payload.append('dial_code', `+${formData.phone1_dial_code}`);
      payload.append('country_code', formData.phone1_country_code);
      payload.append('dial_code2', formData.phone2 ? `+${formData.phone2_dial_code}` : '');
      payload.append('country_code2', formData.phone2 ? formData.phone2_country_code : '');
      payload.append('birth_date', formData.birth_date);
      payload.append('description', formData.description);
      payload.append('password', formData.password);
      payload.append('password_confirmation', formData.confirm_password);

      // Add image file if present
      if (formData.image) {
        payload.append('image', formData.image);
      }

      // Add employee ID if in edit mode
      if (isEditMode && editingEmployeeId) {
        payload.append('id', editingEmployeeId.toString());
      }

      // Call API
      const response = await partnerService.addNewEmployee(payload);

      if (response?.data?.success || response?.success) {
        Swal.fire({
          title: 'Success!',
          text: response?.data?.message || response?.message || (isEditMode ? 'Employee updated successfully!' : 'Employee added successfully!'),
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
        });

        // Refresh employee list from server to get the latest data
        if (refreshEmployees) {
          refreshEmployees();
        } else {
          // Fallback: Add/update employee in global state if refresh is not available
          if (isEditMode && editingEmployeeId && response?.data?.employee) {
            updateEmployeeInList(editingEmployeeId, response.data.employee);
          } else if (!isEditMode && response?.data?.employee) {
            addEmployeeToList(response.data.employee);
          }
        }

        // Reset form and close
        resetForm();
        setShowAddForm(false);
      } else {
        throw new Error(response?.data?.message || response?.message || 'Failed to add employee');
      }
    } catch (error: unknown) {
      console.error('Error adding employee:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to add employee. Please try again.';
      Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error',
        confirmButtonColor: '#dc3545'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormClose = () => {
    setShowAddForm(false);
    resetForm();
  };

  return {
    showAddForm,
    isEditMode,
    editingEmployeeId,
    formData,
    setShowAddForm,
    handleInputChange,
    handlePhoneChange,
    handleFileChange,
    resetForm,
    populateFormForEdit,
    handleFormSubmit,
    handleFormClose,
    isSubmitting
  };
};