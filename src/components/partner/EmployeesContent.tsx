import React from 'react';
import { useEmployeesContentPage } from '../../hooks/useEmployeesContentPage';
import EmployeeCard from './EmployeeCard';
import EmployeeDetails from './EmployeeDetails';
import EmployeeForm from './EmployeeForm';
import LogoutModal from './LogoutModal';
import DeleteAccountModal from './DeleteAccountModal';

interface EmployeesContentProps {
  setActivePage: (page: string) => void;
  onOpenAcceptedRequestsForEmployee: (employeeId: number) => void; // Added prop
  onOpenInProgressRequestsForEmployee: (employeeId: number) => void;
  onOpenCompletedRequestsForEmployee: (employeeId: number) => void;
  onOpenCancelledRequestsForEmployee: (employeeId: number) => void;
}

const EmployeesContent: React.FC<EmployeesContentProps> = ({ setActivePage, onOpenAcceptedRequestsForEmployee, onOpenInProgressRequestsForEmployee, onOpenCompletedRequestsForEmployee, onOpenCancelledRequestsForEmployee }) => {
  const {
    employees,
    selectedEmployeeId,
    isLoading,
    error,
    hasEmployees,
    showAddForm,
    isEditMode,
    formData,
    handleBackToDashboard,
    handleAddEmployee,
    handleEmployeeCardClick,
    handleEditEmployee,
    handleInputChange,
    handlePhoneChange,
    handleFileChange,
    handleFormSubmit,
    renderEmployeeDetails,
    isSubmitting
  } = useEmployeesContentPage(setActivePage);

  const employeeDetailsData = renderEmployeeDetails();

  return (
    <>
      <div className="card my-account-dashboard">
        <div className="card-header p-3 d-flex flex-wrap justify-content-between align-items-center gap-2">
          <div className="d-flex align-items-center justify-content-between">
            <button className="btn btn-primary btn-sm rounded-pill" onClick={handleBackToDashboard}>
              <i className="uil uil-arrow-left" /> Back
            </button>
            &nbsp;&nbsp;
            <h4 className="card-title mb-0">Manage Employees</h4>
          </div>
          <button className="btn btn-primary btn-sm rounded-pill" onClick={handleAddEmployee}>
            <i className="uil uil-plus" /> Add Employee
          </button>
        </div>
        <div className="card-body">
          {isLoading && (
            <div className="w-100 text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 mb-0">Loading employees...</p>
            </div>
          )}

          {!isLoading && error && (
            <div className="alert alert-danger mt-3">
              <i className="uil uil-exclamation-triangle me-2"></i>
              {error}
            </div>
          )}

          {!isLoading && !error && !hasEmployees && (
            <div className="row g-3">
              {!showAddForm ? (
                // Show message centered when no form is open
                <div className="col-12">
                  <div className="w-100 text-center py-4">
                    <p className="">No employees found.</p>
                  </div>
                </div>
              ) : (
                // Show message on left and form on right when form is open
                <>
                  <div className="col-12 col-xl-6">
                    <div className="w-100 text-center py-4">
                      <p className="">No employees found.</p>
                    </div>
                  </div>

                  <div className="col-12 col-xl-6" id="employeeDetails">
                    <EmployeeForm
                      isEditMode={isEditMode}
                      formData={formData}
                      onInputChange={handleInputChange}
                      onPhoneChange={handlePhoneChange}
                      onFileChange={handleFileChange}
                      onSubmit={handleFormSubmit}
                      isSubmitting={isSubmitting}
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {!isLoading && !error && hasEmployees && (
            <div className="row g-3">
              <div className="col-12 col-xl-6">
                {employees.map((employee) => (
                  <EmployeeCard
                    key={employee.id}
                    employee={employee}
                    isSelected={selectedEmployeeId === employee.id}
                    onCardClick={handleEmployeeCardClick}
                    onEdit={handleEditEmployee}
                  />
                ))}
              </div>

              <div className="col-12 col-xl-6" id="employeeDetails">
                {showAddForm ? (
                  <EmployeeForm
                    isEditMode={isEditMode}
                    formData={formData}
                    onInputChange={handleInputChange}
                    onPhoneChange={handlePhoneChange}
                    onFileChange={handleFileChange}
                    onSubmit={handleFormSubmit}
                    isSubmitting={isSubmitting}
                  />
                ) : (
                  employeeDetailsData.type === 'employee' && employeeDetailsData.employee ? (
                    <EmployeeDetails
                      employee={employeeDetailsData.employee}
                      setActivePage={setActivePage}
                      onOpenAcceptedRequestsForEmployee={onOpenAcceptedRequestsForEmployee} // Pass the prop
                      onOpenInProgressRequestsForEmployee={onOpenInProgressRequestsForEmployee}
                      onOpenCompletedRequestsForEmployee={onOpenCompletedRequestsForEmployee}
                      onOpenCancelledRequestsForEmployee={onOpenCancelledRequestsForEmployee}
                    />
                  ) : (
                    <div className="alert alert-info d-flex align-items-center" role="alert">
                      <i className="uil uil-info-circle me-2"></i>
                      <div>{employeeDetailsData.content}</div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <LogoutModal
        isOpen={false}
        onClose={() => { }}
        onConfirm={() => { }}
        title=""
        message=""
        confirmText=""
      />

      <DeleteAccountModal
        isOpen={false}
        onClose={() => { }}
        onConfirm={() => { }}
      />
    </>
  );
};

export default EmployeesContent; 