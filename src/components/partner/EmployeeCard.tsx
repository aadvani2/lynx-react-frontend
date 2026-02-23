import React from 'react';
import { useEmployeeCardActions } from '../../hooks/useEmployeeCardActions';
import BackendImage from '../common/BackendImage/BackendImage';
import userPlaceholder from '../../assets/Icon/user-placeholder.png';

interface Employee {
  id: number;
  name: string;
  email: string;
  image: string | null;
  status: string;
  phone: string;
  availability: number;
}

interface EmployeeCardProps {
  employee: Employee;
  isSelected: boolean;
  onCardClick: (id: number) => void;
  onEdit: (id: number) => void;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({
  employee,
  isSelected,
  onCardClick,
  onEdit
}) => {
  const {
    getAvailabilityDotColor,
    getStatusBadgeColor,
    formatEmployeeStatus,
    handleDeleteEmployee,
    handleEditEmployee,
    handleCardClick
  } = useEmployeeCardActions();

  return (
    <a
      href="javascript:void(0)"
      className={`card lift manage-employees ${isSelected ? 'active' : ''}`}
      data-id={employee.id}
      onClick={() => handleCardClick(employee.id, onCardClick)}
    >
      <div className="card-body p-3">
        <div className="row justify-content-between align-items-center">
          <div className="col-md-12 d-flex align-items-center text-body">
            <div
              className="profile-image-container me-3"
              id={`employee-${employee.id}`}
              style={{ "--dot-color": getAvailabilityDotColor(employee.availability) } as React.CSSProperties}
            >
              <BackendImage
                src={employee.image}
                alt={employee.name || 'Employee'}
                className="rounded-circle w-10 h-10 object-fit-cover"
                placeholderImage={userPlaceholder}
                placeholderText=""
              />
              <div className="availability-dot" />
            </div>
            <div className="desc">
              <p className="mb-0 name">{employee.name}</p>
              <p className="mb-0 fs-14 email">{employee.email}</p>
              <span className={`badge bg-${getStatusBadgeColor(employee.status)} rounded-pill`} id={`empStatus-${employee.id}`}>
                {formatEmployeeStatus(employee.status)}
              </span>
            </div>
            <div className="edit-delete">
              <span>
                <i
                  className="uil uil-edit text-blue fs-20 edit-employee"
                  data-id={employee.id}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleEditEmployee(employee.id, onEdit);
                  }}
                  style={{ cursor: 'pointer' }}
                />
              </span>
              <span>
                <i
                  className="uil uil-trash-alt text-danger fs-20 delete-employee"
                  data-id={employee.id}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDeleteEmployee(employee.id);
                  }}
                  style={{ cursor: 'pointer' }}
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
};

export default EmployeeCard; 