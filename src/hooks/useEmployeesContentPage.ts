import { useCallback } from 'react';
import { useEmployeeStore } from '../store/employeeStore';
import { useReviewsStore } from '../store/reviewsStore';
import { useEmployees } from './useEmployees';
import { useEmployeeForm } from './useEmployeeForm';
import { partnerService } from '../services/partnerService/partnerService';
import Swal from '../lib/swal';

export const useEmployeesContentPage = (setActivePage: (page: string) => void) => {
  const {
    employees,
    selectedEmployee,
    selectedEmployeeId,
    showAddForm,
    isEditMode,
    setSelectedEmployee,
    setSelectedEmployeeId,
    setShowAddForm,
    resetSelection
  } = useEmployeeStore();

  const { resetReviews } = useReviewsStore();

  // Use existing hooks
  const { isLoading, error, refreshEmployees } = useEmployees();
  const employeeFormHook = useEmployeeForm(refreshEmployees);

  // Navigation handlers
  const handleBackToDashboard = useCallback(() => {
    setActivePage("dashboard");
  }, [setActivePage]);

  // Employee management handlers
  const handleAddEmployee = useCallback(() => {
    resetSelection();
    employeeFormHook.resetForm(); // Reset form data only, not the showAddForm state
    setShowAddForm(true);
  }, [setShowAddForm, resetSelection, employeeFormHook]);

  const handleEmployeeCardClick = useCallback((id: number) => {
    const employee = employees.find(emp => emp.id === id);
    if (employee) {
      setSelectedEmployeeId(id);
      setSelectedEmployee(employee);
      setShowAddForm(false);
      resetReviews(); // Reset reviews state when any employee card is clicked
    }
  }, [employees, setSelectedEmployeeId, setSelectedEmployee, setShowAddForm, resetReviews]);

  const handleEditEmployee = useCallback(async (id: number) => {
    try {
      const response = await partnerService.getEmployeeDetails(id);

      if (response?.success) {
        const employeeData = response.data;
        employeeFormHook.populateFormForEdit(employeeData);
        resetSelection();
        setShowAddForm(true);
      } else {
        throw new Error('Failed to fetch employee details');
      }
    } catch (error) {
      console.error('Error fetching employee details:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch employee details. Please try again.',
        confirmButtonColor: '#3085d6'
      });
    }
  }, [employeeFormHook, resetSelection, setShowAddForm]);

  // Render helper for employee details section
  const renderEmployeeDetails = useCallback(() => {
    if (!selectedEmployee) {
      return {
        type: 'info',
        content: 'Click on employee to show employee\'s details.'
      };
    }
    return {
      type: 'employee',
      employee: selectedEmployee
    };
  }, [selectedEmployee]);

  // Check if employee list is empty
  const hasEmployees = employees.length > 0;

  return {
    // State
    employees,
    selectedEmployee,
    selectedEmployeeId,
    isLoading,
    error,
    hasEmployees,

    // Form state from store and hook
    showAddForm,
    isEditMode,
    formData: employeeFormHook.formData,

    // Handlers
    handleBackToDashboard,
    handleAddEmployee,
    handleEmployeeCardClick,
    handleEditEmployee,

    // Form handlers from hook
    handleInputChange: employeeFormHook.handleInputChange,
    handlePhoneChange: employeeFormHook.handlePhoneChange,
    handleFileChange: employeeFormHook.handleFileChange,
    handleFormSubmit: employeeFormHook.handleFormSubmit,

    // Render helpers
    renderEmployeeDetails,
    isSubmitting: employeeFormHook.isSubmitting
  };
};