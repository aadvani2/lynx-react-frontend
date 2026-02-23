import React, { lazy, Suspense, useCallback, useState } from "react";
import Swal from "sweetalert2";
import { getUserTimezoneOffset } from "../../../utils/timezoneHelper";
import { customerService } from "../../../services/customerServices/customerService";
import { useReturningUserAddressStore, } from "../stores";
import type { Address, ProviderItem } from "../types";
const ServiceAddressSection = lazy(() => import("./ServiceAddressSection/ServiceAddressSection"));
const AddNewAddressModal = lazy(() => import("./AddNewAddressModal"));

interface Props {
  providers: ProviderItem[];
  showProviderList: boolean;
  showProviderLoader: boolean;
  showNoProviderAlert: boolean;
  noProviderMessage: string;
  selectedProviderId: number | null;
  updatingProviderId: number | null;
  onAddressChange: (addressId: number) => Promise<void>;
  onProviderClick: (provider: ProviderItem) => Promise<void>;
  imageFallback?: string;
}

const ServiceAddressContainer: React.FC<Props> = ({
  providers,
  showProviderList,
  showProviderLoader,
  showNoProviderAlert,
  noProviderMessage,
  selectedProviderId,
  updatingProviderId,
  onAddressChange,
  onProviderClick,
  imageFallback,
}) => {
  const {
    addresses,
    selectedAddress,
    setAddresses,
    setSelectedAddress,
    showAddAddressModal,
    setShowAddAddressModal,
  } = useReturningUserAddressStore();

  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const handleAddNewAddress = useCallback(() => {
    setModalMode("add");
    setEditingAddress(null);
    setShowAddAddressModal(true);
  }, [setShowAddAddressModal]);

  const handleEditAddress = useCallback(
    (address: Address) => {
      setModalMode("edit");
      setEditingAddress(address);
      setShowAddAddressModal(true);
    },
    [setShowAddAddressModal]
  );

  const handleDeleteAddress = useCallback(
    async (addressId: number) => {
      const addressToDelete = addresses.find((a) => a.id === addressId);

      const result = await Swal.fire({
        title: "Delete Address?",
        text: `Are you sure you want to delete "${addressToDelete?.full_address || "this address"}"? This action cannot be undone.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc3545",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
        customClass: {
          confirmButton: "btn btn-danger rounded-pill px-4",
          cancelButton: "btn btn-secondary rounded-pill px-4",
        },
      });

      if (!result.isConfirmed) return;

      try {
        await customerService.deleteAddress(addressId);

        await Swal.fire({
          icon: "success",
          title: "Address Deleted",
          text: "Your address has been deleted successfully.",
          timer: 2000,
          showConfirmButton: false,
        });

        const timezoneHours = getUserTimezoneOffset();
        const addressesResponse = await customerService.getAddresses(timezoneHours);
        const addressesData = addressesResponse?.data?.addresses || addressesResponse?.data || [];

        if (!Array.isArray(addressesData)) return;

        setAddresses(addressesData);

        if (selectedAddress?.id === addressId) {
          const remaining = addressesData.filter((a) => a.id !== addressId);
          setSelectedAddress(remaining.length ? remaining[0] : null);
        }
      } catch (e) {
        console.error("Error deleting address:", e);
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to delete address. Please try again.",
          timer: 3000,
          showConfirmButton: false,
        });
      }
    },
    [addresses, selectedAddress?.id, setAddresses, setSelectedAddress]
  );

  const handleCloseAddAddressModal = useCallback(() => {
    setShowAddAddressModal(false);
    setModalMode("add");
    setEditingAddress(null);
  }, [setShowAddAddressModal]);

  const handleSaveAddress = useCallback(
    async (addressData: Address) => {
      try {
        const payload = {
          latitude: addressData.latitude,
          longitude: addressData.longitude,
          country: addressData.country,
          type: addressData.type,
          block_no: addressData.block_no || "",
          full_address: addressData.full_address,
          zip_code: addressData.zip_code,
          city: addressData.city,
          state: addressData.state,
        };

        if (modalMode === "add") {
          await customerService.addAddress(payload);
        } else {
          const originalId = editingAddress?.id;
          if (originalId) {
            await customerService.addAddress({ ...payload, id: originalId });
          }
        }

        const timezoneHours = getUserTimezoneOffset();
        const addressesResponse = await customerService.getAddresses(timezoneHours);
        const addressesData = addressesResponse?.data?.addresses || addressesResponse?.data || [];

        if (Array.isArray(addressesData)) {
          setAddresses(addressesData);

          if (modalMode === "add") {
            const newAddress = addressesData[addressesData.length - 1];
            if (newAddress) {
              setSelectedAddress(newAddress);
              if (newAddress.id) {
                await onAddressChange(newAddress.id);
              }
            }
          } else if (editingAddress?.id) {
            const updated = addressesData.find((a) => a.id === editingAddress.id);
            if (updated) {
              setSelectedAddress(updated);
              if (updated.id) {
                await onAddressChange(updated.id);
              }
            }
          }
        }

        setShowAddAddressModal(false);
      } catch (e) {
        console.error("Error saving address:", e);
      }
    },
    [modalMode, editingAddress?.id, setAddresses, setSelectedAddress, setShowAddAddressModal]
  );

  return (
    <>
      <Suspense fallback={null}>
        <ServiceAddressSection
          addresses={addresses}
          selectedAddress={selectedAddress}
          onAddNewAddress={handleAddNewAddress}
          onAddressChange={onAddressChange}
          onEditAddress={handleEditAddress}
          providers={providers}
          showProviders={showProviderList}
          showProviderLoader={showProviderLoader}
          selectedProviderId={selectedProviderId}
          onProviderClick={onProviderClick}
          isUpdatingProviderId={updatingProviderId}
          showNoProviderAlert={showNoProviderAlert}
          noProviderMessage={noProviderMessage}
          disableSelectedAddress={showNoProviderAlert}
          onDeleteAddress={handleDeleteAddress}
          imageFallback={imageFallback}
        />
      </Suspense>
      <Suspense fallback={null}>
        <AddNewAddressModal
          open={showAddAddressModal}
          onClose={handleCloseAddAddressModal}
          mode={modalMode}
          initialData={editingAddress}
          onSave={handleSaveAddress}
        />
      </Suspense>
    </>
  );
};

export default ServiceAddressContainer;
