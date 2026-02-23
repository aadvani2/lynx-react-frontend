import React from 'react';
import { useOnboardingMapStore } from '../../../hooks/useOnboardingMap';

const RadiusSection: React.FC = () => {
  const { selectedUnit, radiusValues, setSelectedUnit, setRadiusValues } = useOnboardingMapStore();

  const handleUnitSwitch = (unit: 'miles' | 'km') => {
    if (unit === selectedUnit) return;
    
    // Conversion functions
    const milesToKm = (miles: number): number => parseFloat((miles * 1.60934).toFixed(2));
    const kmToMiles = (km: number): number => parseFloat((km / 1.60934).toFixed(2));
    
    setRadiusValues({
      emergency: radiusValues.emergency === '' ? '' : (unit === 'km' ? milesToKm(radiusValues.emergency as number) : kmToMiles(radiusValues.emergency as number)),
      scheduled: radiusValues.scheduled === '' ? '' : (unit === 'km' ? milesToKm(radiusValues.scheduled as number) : kmToMiles(radiusValues.scheduled as number))
    });
    
    setSelectedUnit(unit);
  };

  const handleRadiusChange = (serviceType: 'emergency' | 'scheduled', value: string) => {
    // Handle empty string case
    if (value === '') {
      setRadiusValues({
        ...radiusValues,
        [serviceType]: ''
      });
      return;
    }
    
    // Handle numeric values including zero
    const parsedValue = parseFloat(value);
    
    // Check if it's a valid number (including zero)
    if (!isNaN(parsedValue)) {
      // Limit to 3 decimal places
      const limitedValue = parseFloat(parsedValue.toFixed(3));
      setRadiusValues({
        ...radiusValues,
        [serviceType]: limitedValue
      });
    }
  };

  return (
    <div className="row" id="radiusDetails">
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="fs-14">
            <tr>
              <th>Service Tiers</th>
              <th style={{ width: '30%' }}>
                <div className="d-flex align-items-center">
                  <span className="text-nowrap me-2">Radius</span>
                  <div className="switches-container font-weight-normal me-0 m-auto">
                    <input 
                      type="radio" 
                      id="switchKm" 
                      className="in_km" 
                      name="switchRange" 
                      value="km" 
                      checked={selectedUnit === 'km'}
                      onChange={() => handleUnitSwitch('km')}
                    />
                    <label htmlFor="switchKm" className="innerInterval">In Km</label>
                    <input 
                      type="radio" 
                      id="switchMiles" 
                      className="in_miles" 
                      name="switchRange" 
                      value="miles" 
                      checked={selectedUnit === 'miles'}
                      onChange={() => handleUnitSwitch('miles')}
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
              <td width="50%" style={{ verticalAlign: 'middle' }}>
                Emergency Service (1-4 Hrs)
                <input type="hidden" className="form-control" name="service_radius[0][tier_title]" defaultValue="Emergency Service (1-4 Hrs)" />
                <input type="hidden" name="service_radius[0][tier_id]" defaultValue={1} />
                <input type="hidden" name="service_radius[0][is_available]" defaultValue={1} />
              </td>
              <td width="50%">
                <input 
                  type="number" 
                  className="form-control service_radius" 
                  data-base={radiusValues.emergency} 
                  data-unit={selectedUnit} 
                  name="service_radius[0][radius]" 
                  value={radiusValues.emergency}
                  onChange={(e) => handleRadiusChange('emergency', e.target.value)}
                  placeholder="Enter Radius" 
                  step="0.001"
                  min="0"
                />
              </td>
            </tr>
            <tr id="tier_pricing_row_1">
              <td width="50%" style={{ verticalAlign: 'middle' }}>
                Scheduled Service
                <input type="hidden" className="form-control" name="service_radius[1][tier_title]" defaultValue="Scheduled Service" />
                <input type="hidden" name="service_radius[1][tier_id]" defaultValue={3} />
                <input type="hidden" name="service_radius[1][is_available]" defaultValue={1} />
              </td>
              <td width="50%">
                <input 
                  type="number" 
                  className="form-control service_radius" 
                  data-base={radiusValues.scheduled} 
                  data-unit={selectedUnit} 
                  name="service_radius[1][radius]" 
                  value={radiusValues.scheduled}
                  onChange={(e) => handleRadiusChange('scheduled', e.target.value)}
                  placeholder="Enter Radius" 
                  step="0.001"
                  min="0"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RadiusSection;
