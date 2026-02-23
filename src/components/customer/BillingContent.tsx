import React from 'react';

const BillingContent: React.FC = () => {
  return (
    <div className="card my-account-dashboard">
      <div className="card-header p-3 d-flex align-items-center">
        <h4 className="card-title mb-0">Billing & Invoices</h4>
      </div>
      <div className="card-body">
        <div className="row mb-4">
          <div className="col-md-4">
            <div className="card bg-primary text-white">
              <div className="card-body text-center">
                <h5>Total Spent</h5>
                <h3>$1,250</h3>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card bg-success text-white">
              <div className="card-body text-center">
                <h5>Paid Invoices</h5>
                <h3>8</h3>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card bg-warning text-white">
              <div className="card-body text-center">
                <h5>Pending</h5>
                <h3>2</h3>
              </div>
            </div>
          </div>
        </div>

        <h5 className="mb-3">Recent Invoices</h5>
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Service</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#INV-001</td>
                <td>House Cleaning</td>
                <td>Dec 15, 2024</td>
                <td>$150</td>
                <td><span className="badge bg-success">Paid</span></td>
                <td><button className="btn btn-sm btn-outline-primary">Download</button></td>
              </tr>
              <tr>
                <td>#INV-002</td>
                <td>Lawn Maintenance</td>
                <td>Dec 12, 2024</td>
                <td>$75</td>
                <td><span className="badge bg-success">Paid</span></td>
                <td><button className="btn btn-sm btn-outline-primary">Download</button></td>
              </tr>
              <tr>
                <td>#INV-003</td>
                <td>Window Cleaning</td>
                <td>Dec 20, 2024</td>
                <td>$120</td>
                <td><span className="badge bg-warning">Pending</span></td>
                <td><button className="btn btn-sm btn-primary">Pay Now</button></td>
              </tr>
              <tr>
                <td>#INV-004</td>
                <td>Carpet Cleaning</td>
                <td>Dec 18, 2024</td>
                <td>$200</td>
                <td><span className="badge bg-warning">Pending</span></td>
                <td><button className="btn btn-sm btn-primary">Pay Now</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BillingContent; 