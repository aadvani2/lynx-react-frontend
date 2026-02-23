import React from 'react';
import Swal from 'sweetalert2';
import { useServiceLocationsStore } from '../../../../store/serviceLocationsStore';

const AddressList: React.FC = () => {
  const { addresses, openEditEditor, deleteAddress } = useServiceLocationsStore();

  const handleDelete = async (id: string | number) => {
    const result = await Swal.fire({
      title: 'Delete Address',
      html: 'Are you sure you want to delete this address?',
      imageUrl: '',
      imageWidth: 77,
      imageHeight: 77,
      showCancelButton: false,
      showDenyButton: false,
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#0d6efd',
      customClass: {
        popup: 'swal2-popup swal2-modal swal2-show',
        confirmButton: 'btn btn-primary rounded-pill w-20'
      },
      buttonsStyling: false
    });

    if (result.isConfirmed) {
      await deleteAddress(id);
    }
  };

  if (addresses.length === 0) {
    return (
      <div className="col-12 text-center">
        <div className="py-5">
          <p className="text-muted">You haven't added any addresses yet.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {addresses.map((addr) => {
        let icon;
        const type = (addr.type || '').toLowerCase();
        if (type === 'home') {
          icon = <span className="icon fs-lg"><i className="uil uil-home" /></span>;
        } else if (type === 'work') {
          icon = <span className="icon fs-lg"><i className="uil uil-briefcase" /></span>;
        } else if (type === 'other') {
          icon = <span className="icon fs-lg"><i className="uil uil-map-marker" /></span>;
        } else {
          icon = <span className="icon fs-lg"><i className="uil uil-location-point" /></span>;
        }
        return (
          <div key={addr.id} className="col-md-6 col-lg-12 col-xl-6 col-xxl-6 col-sm-12 d-flex" id={`userAddress-${addr.id}`}>
            <a href="javascript:void(0)" className="card lift manage-employees w-100" data-id={addr.id}>
              <div className="card-body p-3">
                <span className="row justify-content-between align-items-center">
                  <span className="col-md-12 d-flex text-body">
                    <div className="profile-image-container me-3">
                      {icon}
                    </div>
                    <div className="desc">
                      <p className="mb-0 name fw-medium">{(addr.type || 'Home').charAt(0).toUpperCase() + (addr.type || 'home').slice(1)}</p>
                      <p className="mb-0 fs-14 email">{addr.full_address || addr.address}</p>
                    </div>
                    <div className="edit-delete">
                      <span>
                        <i className="uil uil-edit text-blue fs-20 edit-addresses" data-id={addr.id} onClick={() => openEditEditor(addr)} />
                      </span>
                      <span>
                        <i className="uil uil-trash-alt text-danger fs-20 delete-address" data-id={addr.id} onClick={() => handleDelete(addr.id)} />
                      </span>
                    </div>
                  </span>
                </span>
              </div>
            </a>
          </div>
        );
      })}
    </>
  );
};

export default AddressList;
