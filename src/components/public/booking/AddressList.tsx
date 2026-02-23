import React from 'react';

interface Address {
  id: number;
  user_id: number;
  type: string;
  full_address: string;
  block_no: string | null;
  street: string | null;
  city: string;
  state: string;
  country: string;
  zip_code: string;
  latitude: number;
  longitude: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

interface AddressListProps {
  addresses: Address[];
  selectedAddress: number | null;
  onAddressChange: (addressId: number) => void;
  onEditAddress?: (address: Address) => void;
  onDeleteAddress?: (addressId: number) => void;
  onAddNewAddress?: () => void;
}

const AddressList: React.FC<AddressListProps> = ({
  addresses,
  selectedAddress,
  onAddressChange,
  onEditAddress,
  onDeleteAddress,
  onAddNewAddress
}) => {
  return (
    <>

      <div className="row">
        <div className="col-md-12 position-relative">
          <p className="lead px-xxl-10" id="addressTitle">Select your service address</p>
          <div className="row text-start justify-content-center" id="selectableAddressList">
            <input type="hidden" id="locationCount" defaultValue={1} />
            <input type="hidden" id="totalLocations" defaultValue={4} />
            {addresses.length > 0 ? (
              addresses.map((address) => (
                <div key={address.id} className="col-md-12 d-flex col-lg-6 col-xl-6" id={`select_userAddress-${address.id}`}>
                  <div className="inputGroup w-100 d-flex">
                    <input
                      type="radio"
                      name="selectAddress"
                      className="customerAddress"
                      value={address.id}
                      data-address={JSON.stringify({
                        latitude: address.latitude,
                        longitude: address.longitude,
                        state: address.state
                      })}
                      id={`address_${address.id}`}
                      checked={selectedAddress === address.id}
                      onChange={() => onAddressChange(address.id)}
                    />
                    <label className="w-100" htmlFor={`address_${address.id}`}>
                      {address.type === 'home'
                        &&
                        <img
                          src=""
                          className="icon-svg icon-svg-xxs text-primary"
                          alt="address"
                        />
                      }
                      {address.type === 'work'
                        &&
                        <img
                          src=""
                          className="icon-svg icon-svg-xxs text-primary"
                          alt="address"
                        />
                      }
                      {address.type === 'other'
                        &&
                        <img
                          src=""
                          className="icon-svg icon-svg-xxs text-primary"
                          alt="address"
                        />
                      }
                      <div>
                        <span className="fw-semibold">
                          {address.type.charAt(0).toUpperCase() + address.type.slice(1)}
                        </span><br />

                        {address.full_address}
                        <br />
                        <span
                          className="d-inline-flex align-items-center justify-content-center edit-address"
                          data-object={JSON.stringify(address)}
                          data-id={address.id}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onEditAddress?.(address);
                          }}
                          style={{ cursor: 'pointer' }}
                        >
                          <i className="uil uil-edit text-blue fs-15 me-1" />
                          <span className="underline-2 fs-14 text-blue">
                            Edit
                          </span>
                        </span>
                        <span
                          className="d-inline-flex align-items-center justify-content-center ms-1 delete-address"
                          data-id={address.id}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onDeleteAddress?.(address.id);
                          }}
                          style={{ cursor: 'pointer' }}
                        >
                          <i className="uil uil-trash-alt text-danger fs-15 me-1" />
                          <span className="underline-2 fs-14 text-danger">
                            Delete
                          </span>
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center">
                <p>No addresses found. Please add an address first.</p>
              </div>
            )}
          </div>
          <button
            type="button"
            className="btn btn-outline-primary rounded-pill mx-0 btn-sm"
            id="addNewAddress"
            onClick={(e) => {
              e.preventDefault();
              onAddNewAddress?.();
            }}
          >
            <i className="uil uil-plus-circle fs-15" />&nbsp;
            Add New Address
          </button>
        </div>
      </div>
    </>

  );
};

export default AddressList;
