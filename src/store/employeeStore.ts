import { create } from 'zustand';

export interface Employee {
  id: number;
  name: string;
  email: string;
  image: string | null;
  status: string;
  description: string;
  birth_date: string;
  phone: string;
  phone2?: string | null;
  availability: number;
  accepted_requests?: number;
  in_progress_requests?: number;
  completed_requests?: number;
  cancelled_requests?: number;
  rating_count?: number;
}

interface EmployeeState {
  // Employee list state
  employees: Employee[];
  isLoading: boolean;
  error: string | null;
  
  // Selected employee state
  selectedEmployee: Employee | null;
  selectedEmployeeId: number | null;
  
  // Form state
  showAddForm: boolean;
  isEditMode: boolean;
  
  // UI state
  isUpdatingAvailability: { [key: number]: boolean };
  isUpdatingStatus: { [key: number]: boolean };
  
  // Actions
  setEmployees: (employees: Employee[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  setSelectedEmployee: (employee: Employee | null) => void;
  setSelectedEmployeeId: (id: number | null) => void;
  
  setShowAddForm: (show: boolean) => void;
  setIsEditMode: (isEdit: boolean) => void;
  
  setUpdatingAvailability: (employeeId: number, updating: boolean) => void;
  setUpdatingStatus: (employeeId: number, updating: boolean) => void;
  
  updateEmployeeInList: (employeeId: number, updates: Partial<Employee>) => void;
  removeEmployeeFromList: (employeeId: number) => void;
  addEmployeeToList: (employee: Employee) => void;
  
  // Reset functions
  resetForm: () => void;
  resetSelection: () => void;
  resetAll: () => void;
}

export const useEmployeeStore = create<EmployeeState>((set) => ({
  // Initial state
  employees: [],
  isLoading: false,
  error: null,
  
  selectedEmployee: null,
  selectedEmployeeId: null,
  
  showAddForm: false,
  isEditMode: false,
  
  isUpdatingAvailability: {},
  isUpdatingStatus: {},
  
  // Actions
  setEmployees: (employees) => set({ employees }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  
  setSelectedEmployee: (selectedEmployee) => set({ selectedEmployee }),
  setSelectedEmployeeId: (selectedEmployeeId) => set({ selectedEmployeeId }),
  
  setShowAddForm: (showAddForm) => set({ showAddForm }),
  setIsEditMode: (isEditMode) => set({ isEditMode }),
  
  setUpdatingAvailability: (employeeId, updating) => 
    set((state) => ({
      isUpdatingAvailability: {
        ...state.isUpdatingAvailability,
        [employeeId]: updating
      }
    })),
    
  setUpdatingStatus: (employeeId, updating) => 
    set((state) => ({
      isUpdatingStatus: {
        ...state.isUpdatingStatus,
        [employeeId]: updating
      }
    })),
  
  updateEmployeeInList: (employeeId, updates) =>
    set((state) => {
      const updatedEmployees = state.employees.map(emp =>
        emp.id === employeeId ? { ...emp, ...updates } : emp
      );
      const updatedSelectedEmployee = state.selectedEmployee?.id === employeeId 
        ? { ...state.selectedEmployee, ...updates } 
        : state.selectedEmployee;
      
      return {
        employees: updatedEmployees,
        selectedEmployee: updatedSelectedEmployee
      };
    }),
    
  removeEmployeeFromList: (employeeId) =>
    set((state) => ({
      employees: state.employees.filter(emp => emp.id !== employeeId),
      selectedEmployee: state.selectedEmployee?.id === employeeId ? null : state.selectedEmployee,
      selectedEmployeeId: state.selectedEmployeeId === employeeId ? null : state.selectedEmployeeId
    })),
    
  addEmployeeToList: (employee) =>
    set((state) => ({
      employees: [...state.employees, employee]
    })),
  
  // Reset functions
  resetForm: () => set({
    showAddForm: false,
    isEditMode: false
  }),
  
  resetSelection: () => set({
    selectedEmployee: null,
    selectedEmployeeId: null
  }),
  
  resetAll: () => set({
    employees: [],
    isLoading: false,
    error: null,
    selectedEmployee: null,
    selectedEmployeeId: null,
    showAddForm: false,
    isEditMode: false,
    isUpdatingAvailability: {},
    isUpdatingStatus: {}
  })
})); 