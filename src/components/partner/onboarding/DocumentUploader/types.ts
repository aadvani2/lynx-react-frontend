export interface UploadedDocument {
  id: number | string;
  name: string;
  fileName: string;
  status: 'pending' | 'verified' | 'rejected' | string; // Allow string for flexibility
  fileUrl?: string;
}

export interface DocumentInputProps {
  id: string;
  name: string;
  isUploading: boolean;
  error: string;
  onFileChange: (file: File, docId: string, docName: string) => void;
}

export interface DocumentUploaderProps {
  initialDocuments?: Array<{
    id?: number;
    document_id?: number;
    name?: string;
    document_name?: string;
    file?: string;
    file_name?: string;
    fileName?: string;
    status?: string;
    file_url?: string;
    fileUrl?: string;
    [key: string]: unknown; // For any other properties that might be in the response
  }>;
  isLoading?: boolean;
  onDocumentChange?: () => void; // Callback for when documents are added or removed
  documentTypes?: {
    proof_of_license?: boolean;
    proof_of_insurance?: boolean;
    [key: string]: boolean | undefined;
  };
}

