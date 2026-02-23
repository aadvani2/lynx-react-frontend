import React from 'react';

interface ServiceRadiusSelectorProps {
  defaultRadius?: number;
  defaultUnit?: 'km' | 'miles';
}

const ServiceRadiusSelector: React.FC<ServiceRadiusSelectorProps> = ({ 
  defaultRadius = 20, 
  defaultUnit = 'miles' 
}) => {
  return (
    <div className="row" id="radiusDetails">
      <div className="col-md-12">
        <p className="lead mb-1 text-start">Set Your Service Area</p>
        <p className="mb-1">Tell us how far you're willing to travel for jobs</p>
      </div>
      <div className="col-md-12">
        <div className="form-floating mb-4">
          <div className="col-md-12 form-group">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Service Tiers</th>
                  <th>
                    <div className="d-flex align-items-center">
                      <span className="text-nowrap me-2">Radius</span>
                      <div className="switches-container font-weight-normal me-0 m-auto">
                        <input 
                          type="radio" 
                          id="switchKm" 
                          className="in_km" 
                          name="switchRange" 
                          defaultValue="km"
                          defaultChecked={defaultUnit === 'km'} 
                        />
                        <label htmlFor="switchKm" className="innerInterval">In Km</label>
                        <input 
                          type="radio" 
                          id="switchMiles" 
                          className="in_miles" 
                          name="switchRange" 
                          defaultValue="miles" 
                          defaultChecked={defaultUnit === 'miles'} 
                        />
                        <label htmlFor="switchMiles" className="innerInterval">In Miles</label>
                        <div className="switch-wrapper">
                          <div className="switch">
                            <div>In Km</div>
                            <div>In Miles</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody id="tier_pricing_table">
                <tr id="tier_pricing_row_0">
                  <td style={{ verticalAlign: 'middle' }}>
                    <input type="hidden" name="service_radius[0][is_available]" defaultValue={1} />
                    <input type="hidden" name="service_radius[0][tier_id]" defaultValue={3} />
                    <input type="hidden" name="service_radius[0][tier_title]" defaultValue="Scheduled Service" />
                    Scheduled Service
                  </td>
                  <td width="30%">
                    <input 
                      type="number" 
                      className="form-control service_radius" 
                      name="service_radius[0][radius]" 
                      defaultValue={defaultRadius} 
                      placeholder="Enter Radius" 
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <p>➡️ <span className="underline-2 blue">Pro tip:</span> Keep it tight for emergencies, but expand for scheduled jobs to increase your chances of steady work.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceRadiusSelector;
