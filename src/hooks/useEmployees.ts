import { useEffect, useCallback } from 'react';
import { useEmployeeStore, type Employee } from '../store/employeeStore';
import { partnerService } from '../services/partnerService/partnerService';

interface EmployeesResponse {
  success: boolean;
  employees?: Employee[];
  data?: {
    employees?: Employee[];
  };
}

export const useEmployees = () => {
  const {
    employees,
    isLoading,
    error,
    setEmployees,
    setLoading,
    setError
  } = useEmployeeStore();

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await partnerService.getManageEmployeesInfo();
      
      const data = response?.data as EmployeesResponse;
      
      const employeesList = (data?.employees || data?.data?.employees || []) as Employee[];

      setEmployees(employeesList);
    } catch (err) {
      console.error('Failed to fetch employees:', err);
      const msg = err instanceof Error ? err.message : 'Failed to load employees';
      setError(msg);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setEmployees]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const refreshEmployees = useCallback(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  return {
    employees,
    isLoading,
    error,
    refreshEmployees
  };
}; 