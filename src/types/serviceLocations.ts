export interface AddressItem {
  id: string | number;
  // API fields
  type?: string; // home | office | other
  full_address?: string;
  block_no?: string | null;
  street?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  zip_code?: string | null;
  latitude?: number;
  longitude?: number;
  // Legacy fields (fallbacks)
  address?: string;
  unit_number?: string;
  is_default?: boolean;
}

export type AddressesData = AddressItem[] | { addresses?: AddressItem[]; location_count?: number };

export interface AddressesResponseShape {
  addresses?: AddressItem[];
  data?: AddressesData;
}


export interface ServiceLocationsContentProps {
  setActivePage: (page: string) => void;
}

export interface FormData {
  id: string | number | undefined;
  type: string;
  blockNo: string;
  fullAddress: string;
  zip: string;
  city: string;
  state: string;
  country: string;
  lat: number | undefined;
  lng: number | undefined;
}

export interface ServiceLocationsState {
  // Address list state
  addresses: AddressItem[];
  totalLocations: number;
  isLoading: boolean;
  error: string | null;

  // Editor state
  showEditor: boolean;
  editorMode: 'add' | 'edit';
  editorInitial: Partial<AddressItem> | undefined;
  isSaving: boolean;
  
  // Form state
  formData: FormData;

  // Actions for address list
  setAddresses: (addresses: AddressItem[]) => void;
  setTotalLocations: (count: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addAddress: (address: AddressItem) => void;
  updateAddress: (id: string | number, address: AddressItem) => void;
  removeAddress: (id: string | number) => void;
  clearAddresses: () => void;

  // Actions for editor
  setShowEditor: (show: boolean) => void;
  setEditorMode: (mode: 'add' | 'edit') => void;
  setEditorInitial: (initial: Partial<AddressItem> | undefined) => void;
  setSaving: (saving: boolean) => void;
  openAddEditor: () => void;
  openEditEditor: (address: AddressItem) => void;
  closeEditor: () => void;
  
  // Actions for form
  setFormData: (data: Partial<FormData>) => void;
  resetFormData: () => void;

  // Combined actions
  loadAddresses: () => Promise<void>;
  saveAddress: () => Promise<void>;
  deleteAddress: (id: string | number) => Promise<void>;
}
