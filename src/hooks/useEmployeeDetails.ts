import { useState, useCallback, useMemo } from 'react';
import Swal from '../lib/swal';
import { useEmployeeStore } from '../store/employeeStore';
import { partnerService } from '../services/partnerService/partnerService';
import { type Employee } from "../store/employeeStore"; // Corrected to type-only import

export const useEmployeeDetails = (
  employee: Employee, // Changed type from PartnerEmployee to Employee
  setActivePage?: (page: string) => void,
  onOpenAcceptedRequestsForEmployee?: (employeeId: number) => void, // New prop for handling accepted requests
  onOpenInProgressRequestsForEmployee?: (employeeId: number) => void,
  onOpenCompletedRequestsForEmployee?: (employeeId: number) => void,
  onOpenCancelledRequestsForEmployee?: (employeeId: number) => void
) => {
  const [isUpdating, setIsUpdating] = useState(false);
  
  const {
    isUpdatingAvailability,
    isUpdatingStatus,
    setUpdatingAvailability,
    setUpdatingStatus,
    updateEmployeeInList
  } = useEmployeeStore();

  const currentUpdatingAvailability = isUpdatingAvailability[employee.id] || false;
  const currentUpdatingStatus = isUpdatingStatus[employee.id] || false;

  // Compute timezone hours once
  const timezoneHours = useMemo(() => {
    const tzOffsetMinutes = new Date().getTimezoneOffset();
    return -tzOffsetMinutes / 60;
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
      .employee-availability {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
      }
      .toggle-updating {
        opacity: 0.7 !important;
        pointer-events: none !important;
        transform: scale(0.95) !important;
        transition: all 0.2s ease-in-out !important;
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

  // Handle availability change with confirmation modal
  const handleAvailabilityChange = useCallback(async (employeeId: number, newStatus: boolean) => {
    const style = addSweetAlertStyles();

    const result = await Swal.fire({
      title: 'Employee Availability',
      text: 'Are you sure you want to change this employee\'s availability status! You will not able to assign new request if employee is not available.',
      imageUrl: '',
      imageWidth: 77,
      imageHeight: 77,
      showCancelButton: false,
      confirmButtonText: 'Yes, change it!',
      confirmButtonColor: '#0d6efd',
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
        setIsUpdating(true);
        setUpdatingAvailability(employeeId, true);
        
        const response = await partnerService.setEmployeeAvailability(employeeId, newStatus);
        
        if (response?.success) {
          // Update the employee in global state
          updateEmployeeInList(employeeId, { availability: newStatus ? 1 : 0 });
          
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: `Employee availability ${newStatus ? 'enabled' : 'disabled'} successfully`,
            timer: 2000,
            showConfirmButton: false
          });
        } else {
          throw new Error('Failed to update employee availability');
        }
      } catch (error) {
        console.error('Error updating employee availability:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to update employee availability. Please try again.',
          confirmButtonColor: '#3085d6'
        });
      } finally {
        setTimeout(() => {
          setIsUpdating(false);
          setUpdatingAvailability(employeeId, false);
        }, 800);
      }
    }
  }, [addSweetAlertStyles, removeSweetAlertStyles, setUpdatingAvailability, updateEmployeeInList]);

  // Handle status change
  const handleStatusChange = useCallback(async (employeeId: number, isActive: boolean) => {
    try {
      setUpdatingStatus(employeeId, true);
      
      const response = await partnerService.setEmployeeStatus(employeeId, isActive);
      
      if (response?.success) {
        // Update the employee in global state
        updateEmployeeInList(employeeId, { status: isActive ? 'active' : 'inactive' });
        
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: `Employee status ${isActive ? 'activated' : 'deactivated'} successfully`,
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        throw new Error('Failed to update employee status');
      }
    } catch (error) {
      console.error('Error updating employee status:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update employee status. Please try again.',
        confirmButtonColor: '#3085d6'
      });
    } finally {
      setUpdatingStatus(employeeId, false);
    }
  }, [setUpdatingStatus, updateEmployeeInList]);


  // Handle navigation actions - calls professional get-requests with employee_id and then redirect
  const handleOpenRequests = useCallback(async (status: 'accepted' | 'on hold' | 'in process' | 'completed' | 'cancelled') => {
    try {
      const payload = {
        employee_id: employee.id,
        user_timezone: timezoneHours,
        page: 1
      };

      console.log('🔎 Fetching professional requests:', { status, payload });

      switch (status) {
        case 'accepted':
          if (onOpenAcceptedRequestsForEmployee && employee.id) {
            onOpenAcceptedRequestsForEmployee(employee.id); // Use the new callback instead of direct API call
          }
          break;
        // case 'on hold':
        //   // Removed direct API call
        //   setActivePage && setActivePage('on-hold-request-details');
        //   break;
        case 'in process':
          if (onOpenInProgressRequestsForEmployee && employee.id) {
            onOpenInProgressRequestsForEmployee(employee.id); // Use the new callback
          }
          break;
        case 'completed':
          if (onOpenCompletedRequestsForEmployee && employee.id) {
            onOpenCompletedRequestsForEmployee(employee.id); // Use the new callback
          }
          break;
        case 'cancelled':
          if (onOpenCancelledRequestsForEmployee && employee.id) {
            onOpenCancelledRequestsForEmployee(employee.id); // Use the new callback
          }
          break;
      }
    } catch (error) {
      console.error('❌ Failed to fetch professional requests:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load requests. Please try again.',
        confirmButtonColor: '#dc3545'
      });
    }
  }, [employee.id, timezoneHours, setActivePage, onOpenAcceptedRequestsForEmployee, onOpenInProgressRequestsForEmployee, onOpenCompletedRequestsForEmployee, onOpenCancelledRequestsForEmployee]); // Added new callbacks to dependencies

  const handleOpenReviews = useCallback(() => {
    // TODO: Implement review handling logic
    console.log('Open reviews for employee:', employee.id);
  }, [employee.id]);

  return {
    // State
    isUpdating,
    isUpdatingAvailability: currentUpdatingAvailability,
    isUpdatingStatus: currentUpdatingStatus,
    
    // Handlers
    handleAvailabilityChange,
    handleStatusChange,
    handleOpenRequests,
    handleOpenReviews
  };
};