import { useCallback } from 'react';
import Swal from '../lib/swal';
import { useEmployeeStore } from '../store/employeeStore';
import { partnerService } from '../services/partnerService/partnerService';



export const useEmployeeCardActions = () => {
  const { removeEmployeeFromList } = useEmployeeStore();

  // Status formatting
  const getAvailabilityDotColor = useCallback((availability: number): string => {
    return availability === 1 ? "green" : "red";
  }, []);

  const getStatusBadgeColor = useCallback((status: string): string => {
    return status === 'active' ? 'green' : 'red';
  }, []);

  const formatEmployeeStatus = useCallback((status: string): string => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }, []);

  // SweetAlert styling utility
  const addSweetAlertStyles = useCallback(() => {
    const style = document.createElement('style');
    style.textContent = `
      .swal2-close {
        font-family: "Unicons", "Arial", sans-serif !important;
        font-size: 0 !important;
        position: absolute !important;
        top: 0.7rem !important;
        right: 0.7rem !important;
        width: 1.8rem !important;
        height: 1.8rem !important;
        background: rgba(0, 0, 0, 0.08) !important;
        border-radius: 100% !important;
        display: flex !important;
        justify-content: center !important;
        align-items: center !important;
        color: #0d6efd !important;
        border: none !important;
        cursor: pointer !important;
        transition: background 0.2s ease-in-out !important;
      }
      .swal2-close:before {
        content: "×" !important;
        font-size: 1.2rem !important;
        font-weight: bold !important;
        line-height: 1 !important;
      }
      .swal2-close:hover {
        background: rgba(0, 0, 0, 0.15) !important;
      }
    `;
    document.head.appendChild(style);
    return style;
  }, []);

  const removeSweetAlertStyles = useCallback((style: HTMLStyleElement) => {
    if (document.head.contains(style)) {
      document.head.removeChild(style);
    }
  }, []);

  // Delete employee functionality
  const handleDeleteEmployee = useCallback(async (id: number) => {
    const style = addSweetAlertStyles();

    const result = await Swal.fire({
      title: '',
      html: `
        <div class="text-center">
          <img class="swal2-image" src="" alt="" style="width: 77px; height: 77px; margin-bottom: 1rem;">
          <h2 class="swal2-title" >Delete Employee</h2>
          <div class="swal2-html-container" >
            Are you sure you want to delete this employee? This action cannot be undone.
          </div>
        </div>
      `,
      showCancelButton: false,
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#d33',
      customClass: {
        popup: 'swal2-popup swal2-modal swal2-show',
        container: 'swal2-container swal2-center swal2-backdrop-show',
        confirmButton: 'btn btn-primary rounded-pill w-20'
      },
      buttonsStyling: false,
      showCloseButton: true,
      allowOutsideClick: true
    });

    removeSweetAlertStyles(style);

    if (result.isConfirmed) {
      try {
        console.log('Deleting employee:', id);
        
        // Show loading state
        Swal.fire({
          title: 'Deleting Employee',
          html: `
            <div class="text-center">
              <div class="mb-4">
                <i class="uil uil-spinner-alt-3 text-primary" style="font-size: 3rem; animation: spin 1s linear infinite;"></i>
              </div>
              <h4 class="mb-3">Please wait...</h4>
              <p class="mb-0">We are deleting the employee from your system.</p>
            </div>
          `,
          allowOutsideClick: false,
          showConfirmButton: false,
          customClass: {
            popup: 'swal2-popup swal2-modal swal2-show',
            container: 'swal2-container swal2-center swal2-backdrop-show'
          }
        });

        const response = await partnerService.deleteEmployee(id);
        
        if (response?.success) {
          console.log('Employee deleted successfully');
          
          Swal.close();
          
          Swal.fire({
            icon: 'success',
            title: 'Employee Deleted!',
            text: 'Employee has been deleted successfully from your system.',
            timer: 3000,
            showConfirmButton: false
          });
          
          // Remove from global state
          removeEmployeeFromList(id);
        } else {
          throw new Error('Failed to delete employee');
        }
      } catch (error) {
        console.error('Error deleting employee:', error);
        
        Swal.close();
        
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error instanceof Error ? error.message : 'Failed to delete employee. Please try again.',
          confirmButtonColor: '#3085d6'
        });
      }
    }
  }, [addSweetAlertStyles, removeSweetAlertStyles, removeEmployeeFromList]);

  // Edit handler (just delegates to parent)
  const handleEditEmployee = useCallback((id: number, onEdit: (id: number) => void) => {
    onEdit(id);
  }, []);

  // Card click handler (delegates to parent)
  const handleCardClick = useCallback((id: number, onCardClick: (id: number) => void) => {
    onCardClick(id);
  }, []);

  return {
    // Computed values
    getAvailabilityDotColor,
    getStatusBadgeColor,
    formatEmployeeStatus,
    
    // Event handlers
    handleDeleteEmployee,
    handleEditEmployee,
    handleCardClick
  };
};