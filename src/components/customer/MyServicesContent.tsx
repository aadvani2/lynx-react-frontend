import React from 'react';

const MyServicesContent: React.FC = () => {
  return (
    <div className="card my-account-dashboard">
      <div className="card-header p-3 d-flex align-items-center">
        <h4 className="card-title mb-0">My Services</h4>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-6 mb-3">
            <div className="card border">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h6 className="mb-0">House Cleaning</h6>
                  <span className="badge bg-primary">Active</span>
                </div>
                <p className="text-muted small mb-2">Scheduled for: Dec 20, 2024 at 2:00 PM</p>
                <p className="text-muted small mb-3">Address: 123 Main St, City, State</p>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-primary fw-bold">$150</span>
                  <button className="btn btn-sm btn-outline-primary">View Details</button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <div className="card border">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h6 className="mb-0">Lawn Maintenance</h6>
                  <span className="badge bg-success">Completed</span>
                </div>
                <p className="text-muted small mb-2">Completed on: Dec 15, 2024 at 10:00 AM</p>
                <p className="text-muted small mb-3">Address: 123 Main St, City, State</p>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-primary fw-bold">$75</span>
                  <button className="btn btn-sm btn-outline-primary">View Details</button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <div className="card border">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h6 className="mb-0">Window Cleaning</h6>
                  <span className="badge bg-warning">Scheduled</span>
                </div>
                <p className="text-muted small mb-2">Scheduled for: Dec 25, 2024 at 9:00 AM</p>
                <p className="text-muted small mb-3">Address: 123 Main St, City, State</p>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-primary fw-bold">$120</span>
                  <button className="btn btn-sm btn-outline-primary">View Details</button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <div className="card border">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h6 className="mb-0">Carpet Cleaning</h6>
                  <span className="badge bg-info">In Progress</span>
                </div>
                <p className="text-muted small mb-2">Started on: Dec 18, 2024 at 1:00 PM</p>
                <p className="text-muted small mb-3">Address: 123 Main St, City, State</p>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-primary fw-bold">$200</span>
                  <button className="btn btn-sm btn-outline-primary">View Details</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyServicesContent; 