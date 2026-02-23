import { create } from 'zustand';

interface Address {
  id?: number;
  user_id?: number;
  type: string;
  full_address: string;
  block_no: string | null;
  street?: string | null;
  city: string;
  state: string;
  country: string;
  zip_code: string;
  latitude: number;
  longitude: number;
  deleted_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

interface ReturningUserAddressState {
  addresses: Address[];
  selectedAddress: Address | null;
  showAddAddressModal: boolean;
  setAddresses: (addresses: Address[]) => void;
  setSelectedAddress: (address: Address | null) => void;
  setShowAddAddressModal: (show: boolean) => void;
  addAddress: (address: Address) => void;
  updateAddress: (updatedAddress: Address) => void;
  reset: () => void;
}

export const useReturningUserAddressStore = create<ReturningUserAddressState>((set, get) => ({
  addresses: [],
  selectedAddress: null,
  showAddAddressModal: false,
  setAddresses: (addresses) => set({ addresses }),
  setSelectedAddress: (selectedAddress) => set({ selectedAddress }),
  setShowAddAddressModal: (showAddAddressModal) => set({ showAddAddressModal }),
  addAddress: (address) => {
    const currentAddresses = get().addresses;
    set({ addresses: [address, ...currentAddresses] });
  },
  updateAddress: (updatedAddress) => {
    const currentAddresses = get().addresses;
    const updatedAddresses = currentAddresses.map(addr =>
      addr.id === updatedAddress.id ? updatedAddress : addr
    );
    set({ addresses: updatedAddresses, selectedAddress: updatedAddress });
  },
  reset: () => set({
    addresses: [],
    selectedAddress: null,
    showAddAddressModal: false
  }),
}));
