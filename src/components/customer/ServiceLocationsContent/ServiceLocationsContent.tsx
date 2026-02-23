import React, { useEffect } from 'react';
import AddressEditor from './component/AddressEditor';
import AddressList from './component/AddressList';
import { useServiceLocationsStore } from '../../../store/serviceLocationsStore';
import type { ServiceLocationsContentProps } from '../../../types/serviceLocations';

const ServiceLocationsContent: React.FC<ServiceLocationsContentProps> = ({ setActivePage }) => {
  const {
    addresses,
    totalLocations,
    showEditor,
    loadAddresses,
    openAddEditor
  } = useServiceLocationsStore();

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  // Handle scroll when editor opens/closes
  useEffect(() => {
    if (showEditor) {
      // Scroll to map when editor opens
      setTimeout(() => {
        const addressFormDiv = document.getElementById('addressFormDiv');
        if (addressFormDiv) {
          addressFormDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      // Scroll to top when editor closes
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [showEditor]);

  // const MAX_ADDRESSES = 3;

  const handleAddLocationClick = () => {
    // if (addresses.length >= MAX_ADDRESSES) {
    //   import('sweetalert2').then(Swal => {
    //     Swal.default.fire({
    //       title: 'Limit Reached',
    //       text: 'You can only add up to 3 service locations.',
    //       imageUrl: 'https://webstaging.connectwithlynx.com/frontend_assets/img/modal_logo.svg',
    //       imageWidth: 77,
    //       imageHeight: 77,
    //       showConfirmButton: true,
    //       confirmButtonText: 'OK',
    //       confirmButtonColor: '#0d6efd',
    //       customClass: {
    //         confirmButton: 'btn btn-primary rounded-pill w-20'
    //       }
    //     });
    //   });
    //   return;
    // }
    openAddEditor();
  };

  return (
    <div id="loadView">
      <div className="card">
        <div className="card-header p-3 d-flex flex-wrap justify-content-between align-items-center gap-2">
          <div className="d-flex align-items-center justify-content-between">
            <button className="btn btn-primary btn-sm rounded-pill" onClick={() => setActivePage('dashboard')}>
              <i className="uil uil-arrow-left" /> Back
            </button>
            &nbsp;&nbsp;
            <h4 className="card-title mb-0">Service Locations</h4>
          </div>
          <button type="button" className="btn btn-sm btn-primary rounded-pill" id="getAddressList" onClick={handleAddLocationClick}>
            <i className="uil uil-plus" />&nbsp;Add Location
          </button>
        </div>
        <div className="card-body">
          <div className="row">
            <input type="hidden" id="locationCount" defaultValue={addresses.length} />
            <input type="hidden" id="totalLocations" defaultValue={totalLocations} />
            <AddressList />
          </div>
        </div>
      </div>

      {showEditor && <AddressEditor />}
    </div>
  );
};

export default ServiceLocationsContent;