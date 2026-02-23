import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/generalServices/authService';
import { useAuthStore } from '../store/authStore';
import Swal from '../lib/swal';

export const useDeleteAccount = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeleteAccount = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await authService.deleteAccount();
      
      if (response.success) {
        await Swal.fire({
          title: 'Account Deleted',
          html: 'Your account has been successfully deleted.',
          icon: 'success',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
          confirmButtonText: 'OK',
          confirmButtonColor: '#007bff',
          customClass: {
            confirmButton: 'btn btn-primary rounded-pill w-20'
          }
        });

        await logout();
        navigate('/');
      } else {
        setError(response.message || 'Failed to delete account');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const showDeleteConfirmation = () => {
    return Swal.fire({
      title: 'Delete Account',
      html: `
        <div class="text-start">
          <p>By proceeding to delete account it will remove all your account data and cancel requests if you have any.</p>
          <p><strong>Are you sure you want to delete your account?</strong></p>
          <div class="mb-3">
            <label for="delete-password" class="form-label">Enter your password to confirm:</label>
            <input type="password" id="delete-password" class="form-control" placeholder="Enter your password">
          </div>
          <div class="mb-3">
            <label for="delete-reason" class="form-label">Reason for deletion (optional):</label>
            <textarea id="delete-reason" class="form-control" rows="3" placeholder="Why are you deleting your account?"></textarea>
          </div>
        </div>
      `,
      imageUrl: '',
      imageWidth: 77,
      imageHeight: 77,
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#dc3545',
      cancelButtonText: 'Cancel',
      cancelButtonColor: '#6c757d',
      customClass: {
        popup: 'swal2-popup swal2-modal swal2-show',
        container: 'swal2-container swal2-center swal2-backdrop-show',
        confirmButton: 'btn btn-danger rounded-pill w-20',
        cancelButton: 'btn btn-secondary rounded-pill w-20'
      },
      buttonsStyling: false,
      preConfirm: () => {
        const password = (document.getElementById('delete-password') as HTMLInputElement)?.value;
        const reason = (document.getElementById('delete-reason') as HTMLTextAreaElement)?.value || 'No reason provided';
        
        if (!password) {
          Swal.showValidationMessage('Please enter your password');
          return false;
        }
        
        return { password, reason };
      }
    });
  };

  return {
    isSubmitting,
    error,
    handleDeleteAccount,
    showDeleteConfirmation
  };
};