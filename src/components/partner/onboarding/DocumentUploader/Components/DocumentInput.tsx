import React, { useRef } from 'react';
import type { DocumentInputProps } from '../types';

const DocumentInput: React.FC<DocumentInputProps> = ({ id, name, isUploading, error, onFileChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileChange(file, id, name);
    }
  };

  const formattedId = id.replace(/-/g, '');

  return (
    <div className={`col-md-6 document_id_${id}`}>
      <div className="mb-4">
        <label className="col-md-12" htmlFor={formattedId}><b>{name}</b></label>
        {isUploading ? (
          <div className=" my-2 border rounded fs-30 mx-auto text-center py-13">Uploading...</div>
        ) : (
          <div className="form-group files">
            <input
              ref={fileInputRef}
              type="file"
              name={formattedId}
              className="form-control-file upload-document-file"
              id={formattedId}
              onChange={handleChange}
              disabled={isUploading}
              accept=".pdf,.doc,.docx,.jpeg,.jpg,.png"
            />

            {error && (
              <div className="text-danger mt-2">{error}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentInput;

