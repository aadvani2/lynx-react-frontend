import AddressEditor from "../../../components/public/booking/components/AddressEditor";

// Address interface matching the AddressEditor expectations
interface Address {
  id?: number;
  user_id?: number;
  type: string;
  block_no: string | null;
  full_address: string;
  zip_code: string;
  city: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  street?: string | null;
  deleted_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

interface AddNewAddressModalProps {
  open: boolean;
  onClose: () => void;
  mode: 'add' | 'edit';
  initialData?: Address | null;
  onSave: (addressData: Address) => Promise<void>;
}

export default function AddNewAddressModal({ open, onClose, mode, initialData, onSave }: AddNewAddressModalProps) {
  if (!open) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(39,39,39,0.18)",
      zIndex: 1000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2vh 4vw"
    }}>
      <div style={{
        background: "#fff",
        borderRadius: 20,
        width: "min(1200px, 96vw)",
        maxHeight: "90vh",
        padding: "32px 40px 32px 40px",
        boxShadow: "0 4px 32px rgba(39,39,39,0.10)",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
      }}>
        {/* Close button - fixed position */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 24,
            right: 32,
            background: "none",
            border: "none",
            fontSize: 28,
            color: "#1E4D5A",
            cursor: "pointer",
            zIndex: 10
          }}
          aria-label="Close"
        >×</button>

        <div style={{
          overflowY: "auto",
          overflowX: "hidden",
          flex: 1,
          paddingRight: "8px"
        }}>
          <AddressEditor
            isVisible={open}
            mode={mode}
            initialData={initialData}
            onSave={onSave}
            onClose={onClose}
          />
        </div>
      </div>
    </div>
  );
}



