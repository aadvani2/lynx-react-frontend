import React, { useState, useCallback, useEffect } from 'react';
import { partnerService } from '../../../../services/partnerService/partnerService';
import Swal from '../../../../lib/swal';
import { DocumentInput, DocumentTable } from './Components';
import type { DocumentUploaderProps, UploadedDocument } from './types';

const DocumentUploader: React.FC<DocumentUploaderProps> = ({ 
  initialDocuments = [], 
  isLoading = false,
  onDocumentChange,
  documentTypes = {}
}) => {
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([]);
  const [isUploading, setIsUploading] = useState<{ [key: string]: boolean }>({
    'Proof-of-license': false,
    'Proof-of-insurance': false
  });
  const [uploadError, setUploadError] = useState<{ [key: string]: string }>({});
  const [downloadingDocId, setDownloadingDocId] = useState<number | null>(null);
  
  // Process initialDocuments when they change
  useEffect(() => {
    if (initialDocuments && initialDocuments.length > 0) {
      // Map API documents to our format
      const mappedDocuments = initialDocuments.map(doc => ({
        id: doc.id || doc.document_id || `doc-${Math.random().toString(36).substr(2, 9)}`,
        name: doc.name || doc.document_name || 'Document',
        fileName: doc.file_name || doc.fileName || 'file',
        status: doc.status || 'verified',
        fileUrl: doc.file_url || doc.fileUrl || ''
      }));
      
      setUploadedDocuments(mappedDocuments as UploadedDocument[]);
    }
  }, [initialDocuments]);

  // Documents to be displayed based on documentTypes
  const documents = [
    // Show Proof of license if not already uploaded (or if documentTypes is not provided)
    ...(!documentTypes.proof_of_license ? [{ id: 'Proof-of-license', name: 'Proof of license' }] : []),
    // Show Proof of insurance if not already uploaded (or if documentTypes is not provided)
    ...(!documentTypes.proof_of_insurance ? [{ id: 'Proof-of-insurance', name: 'Proof of insurance' }] : [])
  ];

  const handleFileUpload = useCallback(async (file: File, docId: string, docName: string) => {
    // Update uploading state
    setIsUploading(prev => ({ ...prev, [docId]: true }));
    setUploadError(prev => ({ ...prev, [docId]: '' }));
    
    try {
      // Call the API to upload the document
      const response = await partnerService.addDocuments(docName, file);
      console.log('Document upload response:', response);
      
      // Add the uploaded document to the state
      const newDocument: UploadedDocument = {
        id: docId,
        name: docName,
        fileName: file.name,
        status: 'pending',
        fileUrl: URL.createObjectURL(file)
      };
      
      setUploadedDocuments(prev => [...prev.filter(doc => doc.id !== docId), newDocument]);
      
      // Call the onDocumentChange callback to refresh documents from API
      if (onDocumentChange) {
        onDocumentChange();
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      setUploadError(prev => ({ 
        ...prev, 
        [docId]: 'Failed to upload document. Please try again.' 
      }));
    } finally {
      setIsUploading(prev => ({ ...prev, [docId]: false }));
    }
  }, [onDocumentChange]);

  const handleDownloadDocument = useCallback(async (docId: string | number, fileName: string) => {
    if (!docId || typeof docId !== 'number' || downloadingDocId === docId) {
      return;
    }
    
    setDownloadingDocId(docId);
    
    try {
      // Get the API base URL from environment
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
      const downloadUrl = `${apiBaseUrl}/professional/documents/download/${docId}`;
      
      // Get token from auth storage (same pattern as api.ts)
      const authStorage = localStorage.getItem("auth-storage");
      let token = null;
      
      if (authStorage) {
        try {
          const authData = JSON.parse(authStorage);
          token = authData.state?.token || null;
        } catch (error) {
          console.error('Error parsing auth storage:', error);
        }
      }
      
      // Fetch the file with credentials to include auth token
      const response = await fetch(downloadUrl, {
        method: 'GET',
        credentials: 'include',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          'Accept': '*/*'
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Download failed:', response.status, errorText);
        throw new Error(`Failed to download document: ${response.status} ${response.statusText}`);
      }
      
      // Get the blob from the response
      const blob = await response.blob();
      
      // Create a blob URL and trigger download
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName || 'document';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the blob URL
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error downloading document:', error);
      Swal.fire({
        icon: 'error',
        title: 'Download Failed',
        text: error instanceof Error ? error.message : 'Unable to download the document. Please try again.'
      });
    } finally {
      setDownloadingDocId(null);
    }
  }, [downloadingDocId]);

  const handleRemoveDocument = useCallback((docId: string | number) => {
    // Show confirmation dialog using SweetAlert2
    Swal.fire({
      title: 'Delete document',
      html: 'You want to delete this document?',
      imageUrl: '',
      imageWidth: 77,
      imageHeight: 77,
      showCancelButton: false,
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#3085d6',
      buttonsStyling: true,
      customClass: {
        confirmButton: 'btn btn-primary rounded-pill w-20'
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // If it's a numeric ID, call the API to delete the document
          if (typeof docId === 'number') {
            await partnerService.deleteDocument(docId);
          }
          
          // Remove from local state
          setUploadedDocuments(prev => prev.filter(doc => doc.id !== docId));
          
          // Reset the file input if it's a string ID (for documents not yet submitted)
          if (typeof docId === 'string') {
            const inputId = docId.replace(/-/g, '');
            const input = document.querySelector(`#${inputId}`) as HTMLInputElement;
            if (input) {
              input.value = '';
            }
          }
          
          // Show success message
          Swal.fire({
            title: 'Deleted!',
            text: 'Document has been deleted.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });
          
          // Call the onDocumentChange callback to refresh documents from API
          if (onDocumentChange) {
            onDocumentChange();
          }
        } catch (error) {
          console.error('Error deleting document:', error);
          Swal.fire({
            title: 'Error!',
            text: 'Failed to delete document. Please try again.',
            icon: 'error',
            timer: 3000,
            showConfirmButton: false
          });
        }
      }
    });
  }, [onDocumentChange]);

  return (
    <>
      <div className="col-md-12">
        <p className="lead mb-1 text-start">Proof of License &amp; Insurance - Let's Keep It Legit</p>
        <p className="mb-1">We take quality and trust seriously. Please upload the following documents.</p>
        {isLoading && (
          <div className="alert alert-info">
            <div className="d-flex align-items-center">
              <div className="spinner-border spinner-border-sm me-2" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <span>Loading your documents...</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Document table - only shown when documents are uploaded */}
      <DocumentTable
        documents={uploadedDocuments}
        downloadingDocId={downloadingDocId}
        onDownload={handleDownloadDocument}
        onRemove={handleRemoveDocument}
      />
      
      <div className="col-md-12 mt-1">
        <p>Supported File Formats: .pdf | .doc | .docx | .jpeg | .jpg | .png</p>
      </div>
      
      {/* Document inputs using the reusable component */}
      <div className="row">
        {documents.map(doc => (
          <DocumentInput
            key={doc.id}
            id={doc.id}
            name={doc.name}
            isUploading={isUploading[doc.id]}
            error={uploadError[doc.id] || ''}
            onFileChange={handleFileUpload}
          />
        ))}
      </div>
      
      <p>➡️ If you don't have these on hand, you can skip and come back later - just know you won't be able to go live until they're verified.</p>
    </>
  );
};

export default DocumentUploader;

