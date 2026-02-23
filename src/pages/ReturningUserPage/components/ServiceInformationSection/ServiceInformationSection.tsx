import React from 'react';
import styles from './ServiceInformationSection.module.css';

interface ServiceInformationSectionProps {
  jobDescription: string;
  onJobDescriptionChange: (value: string) => void;
  files: File[];
  imagePreviews: Array<{ file: File; url: string }>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onRemoveFile: (index: number) => void; // New prop for removing a file
}

const ServiceInformationSection: React.FC<ServiceInformationSectionProps> = ({
  jobDescription,
  onJobDescriptionChange,
  files,
  imagePreviews,
  onFileChange,
  onDragOver,
  onDrop,
  onRemoveFile // Destructure the new prop
}) => {
  return (
    <section className={styles.infoSection}>
      <h2 className={styles.sectionTitle}>Service Information</h2>
      <p className={styles.sectionSubtitle}>Let us know what needs to be or serviced.</p>

      <div className={`${styles.formGroup} ${styles.formGroupFloating}`}>
        <label htmlFor="job_description">Job description</label>
        <textarea
          id="job_description"
          value={jobDescription}
          onChange={(e) => onJobDescriptionChange(e.target.value)}
          placeholder="Describe the issue or service you need"
          rows={6}
          className={styles.jobDescriptionTextarea}
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.uploadTitle}>
          Upload Images <span className={styles.uploadOptional}>(optional)</span>
        </label>
        <p className={styles.uploadSubtitle}>Add clear photos of the item or area that needs repair</p>
        <div
          className={styles.uploadBox}
          onDragOver={onDragOver}
          onDrop={onDrop}
        >
          <div className={styles.uploadContent}>
            <p className={styles.uploadMainText}>Choose file or drag & drop here</p>
            <p className={styles.uploadHint}>File supported: JPG, JPEG, PNG, WEBP & PDF</p>
            <input
              type="file"
              id="file-upload"
              multiple
              accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
              onChange={onFileChange}
              style={{ display: 'none' }}
            />
            <label htmlFor="file-upload" className={styles.browseBtn}>
              Browse
            </label>
            <p className={styles.uploadLimit}>Limit 10 images</p>
          </div>
        </div>
        {files.length > 0 && (
          <div className={styles.uploadedFilesPreview}>
            <div className={styles.previewGrid}>
              {imagePreviews.map((preview, idx) => (
                <div className={styles.previewItem} key={idx}>
                  <img src={preview.url} alt={preview.file.name} />
                  <div className={styles.previewName} title={preview.file.name}>
                    {preview.file.name}
                  </div>
                  <button  type='button' className={styles.removeBtn} onClick={() => onRemoveFile(idx)}>
                    &times;
                  </button>
                </div>
              ))}
              {files
                .filter(f => !f.type.startsWith('image/'))
                .map((file, idx) => (
                  <div className={`${styles.previewItem} ${styles.previewItemDoc}`} key={idx}>
                    <div className={styles.previewDoc}>PDF</div>
                    <div className={styles.previewItemDocName} title={file.name}>{file.name}</div>
                    <button  type='button' className={styles.removeBtn} onClick={() => onRemoveFile(imagePreviews.length + idx)}>
                      &times;
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ServiceInformationSection;
