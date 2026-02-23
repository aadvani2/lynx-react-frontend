import React from 'react';
import type { UploadedDocument } from '../types';

interface DocumentTableProps {
  documents: UploadedDocument[];
  downloadingDocId: number | null;
  onDownload: (docId: string | number, fileName: string) => void;
  onRemove: (docId: string | number) => void;
}

const DocumentTable: React.FC<DocumentTableProps> = ({
  documents,
  downloadingDocId,
  onDownload,
  onRemove
}) => {
  if (documents.length === 0) {
    return null;
  }

  return (
    <div className="col-md-12 table-responsive">
      <table className="table table-bordered text-start" id="documentsTable">
        <thead>
          <tr>
            <th style={{ width: '50%' }}>Uploaded Document</th>
            <th style={{ width: '20%' }}>File</th>
            <th style={{ width: '20%' }}>Verification Status</th>
            <th style={{ width: '10%' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr key={doc.id}>
              <td>{doc.name}</td>
              <td>
                {doc.id && typeof doc.id === 'number' ? (
                  <button
                    type="button"
                    className="btn btn-link p-0 text-decoration-none"
                    onClick={() => onDownload(doc.id as number, doc.fileName)}
                    disabled={downloadingDocId === doc.id}
                    style={{ textAlign: 'left' }}
                  >
                    {downloadingDocId === doc.id ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Downloading...
                      </>
                    ) : (
                      doc.fileName
                    )}
                  </button>
                ) : (
                  <a 
                    href={doc.fileUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    download={doc.fileName}
                  >
                    {doc.fileName}
                  </a>
                )}
              </td>
              <td>
                <span className="badge bg-warning">Pending</span>
              </td>
              <td>
                <button 
                  type="button" 
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => onRemove(doc.id)}
                >
                  <i className="uil uil-trash-alt"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DocumentTable;

