import React, { useEffect, useRef, useState } from 'react';
import Swal from '../../../lib/swal';
import { partnerService } from '../../../services/partnerService/partnerService';
import { addModalCloseIconStyles, modalCloseIconConfigs } from '../../../utils/modalCloseIcon';
import BackendImage from '../../common/BackendImage/BackendImage';

interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string;
  dial_code: string;
  image?: string;
}

interface AssignEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestId: number;
  onAssignEmployee: () => void;
}

const AssignEmployeeModal: React.FC<AssignEmployeeModalProps> = ({
  isOpen,
  onClose,
  requestId,
  onAssignEmployee
}) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(false);
  const [employeesLoading, setEmployeesLoading] = useState(false);
  const [employeesError, setEmployeesError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  /* ---------------------------- Fetch Employees ---------------------------- */

  useEffect(() => {
    if (!isOpen) return;

    setSelectedEmployee(null);
    setSearch('');
    setEmployeesLoading(true);

    partnerService
      .getEmployees()
      .then(res => {
        setEmployees(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => {
        setEmployeesError('Failed to load employees.');
      })
      .finally(() => setEmployeesLoading(false));
  }, [isOpen]);

  /* ---------------------------- Modal Side Effects ---------------------------- */

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    if (isOpen) {
      cleanup = addModalCloseIconStyles(modalCloseIconConfigs.default);
    }
    return () => cleanup?.();
  }, [isOpen]);

  /* ---------------------------- Click Outside ---------------------------- */

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /* ---------------------------- Filtering ---------------------------- */

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(search.toLowerCase()) ||
    emp.email.toLowerCase().includes(search.toLowerCase())
  );

  /* ---------------------------- Submit ---------------------------- */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee) return;

    setLoading(true);
    try {
      await partnerService.assignEmployee({
        employee_id: selectedEmployee.id,
        member_id: selectedEmployee.id,
        request_id: requestId,
        is_accepted: 1
      });

      Swal.fire({
        title: 'Assignment Successful!',
        text: 'Employee assigned successfully!',
        icon: 'success',
        showConfirmButton: false,
        timer: 1500
      }).then(() => {
        onAssignEmployee();
        onClose();
      });
    } catch {
      Swal.fire({
        title: 'Assignment Failed',
        text: 'Please try again.',
        icon: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  /* ---------------------------- JSX ---------------------------- */

  return (
    <>
      {/* Backdrop */}
      <div
        className="modal-backdrop fade show"
        style={{
          backgroundColor: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(5px)'
        }}
        onClick={onClose}
      />

      {/* Modal */}
      <div className="modal fade show d-block" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <form className="modal-content" onSubmit={handleSubmit}>
            <div className="modal-header border-0">
              <h5 className="modal-title">Assign Employee</h5>
              <button type="button" className="custom-modal-close" onClick={onClose} />
            </div>

            <div className="modal-body">
             
              {/* Searchable Employee Selector */}
              <div className="mb-3 position-relative" ref={dropdownRef}>
                <label className="form-label fw-semibold text-primary">
                  Assign an employee
                </label>

                <input
                  type="text"
                  className="form-control p-3"
                  placeholder="Search for employee..."
                  value={search}
                  onFocus={() => setDropdownOpen(true)}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setDropdownOpen(true);
                  }}
                />

                {dropdownOpen && (
                  <div
                    className="border rounded-3 bg-white shadow-sm mt-1"
                    style={{ maxHeight: 260, overflowY: 'auto', zIndex: 10 }}
                  >
                    {employeesLoading && (
                      <div className="p-3 text-muted">Loading employees...</div>
                    )}

                    {!employeesLoading && filteredEmployees.length === 0 && (
                      <div className="p-3 text-muted">No employees found</div>
                    )}

                    {filteredEmployees.map(emp => (
                      <div
                        key={emp.id}
                        className="d-flex align-items-center p-2 border-bottom"
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          setSelectedEmployee(emp);
                          setSearch(`${emp.name} (${emp.email})`);
                          setDropdownOpen(false);
                        }}
                      >
                        <BackendImage
                          src={emp.image}
                          alt={emp.name}
                          className="rounded-circle me-2 w-11 h-11 object-fit-cover"
                        />
                        <div>
                          <div className="fw-semibold">{emp.name}</div>
                          <div className="fs-sm text-muted">{emp.email}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Employee Card (same UI as before) */}
              {selectedEmployee && (
                <div className="card bg-soft-primary">
                  <div className="card-body p-2 d-flex align-items-center">
                    <BackendImage
                      src={selectedEmployee.image}
                      alt={selectedEmployee.name}
                      className="rounded-circle me-3 w-11 h-11 object-fit-cover"
                    />
                    <div>
                      <div className="fw-semibold">{selectedEmployee.name}</div>
                      <div className="fs-sm">{selectedEmployee.email}</div>
                      <div className="fs-sm">
                        {selectedEmployee.dial_code} {selectedEmployee.phone}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {employeesError && (
                <div className="text-danger mt-2 fs-sm">
                  {employeesError}
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                type="submit"
                className="btn btn-primary rounded-pill w-100"
                disabled={!selectedEmployee || loading}
              >
                {loading ? 'Assigning...' : 'Assign Employee'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AssignEmployeeModal;
