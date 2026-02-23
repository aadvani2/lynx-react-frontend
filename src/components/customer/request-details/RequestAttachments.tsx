import { getBackendImageUrl } from '../../../utils/urlUtils';

const RequestAttachments = ({ files = [] }: { files?: string[] }) => {
  if (!files || files.length === 0) return null;
  return (
    <>
      <p className="fw-semibold mt-3 mb-1 text-secondary fs-sm">Attachments</p>
      <div className="card mb-3">
        <div className="card-body p-3">
          <div className="d-flex flex-row flex-wrap justify-content-start gap-3">
            {files.map((file, idx) => (
              <a
                key={file + idx}
                href={getBackendImageUrl(file)}
                data-glightbox
                data-gallery="g1"
                className="text-decoration-none glightbox"
              >
                <img
                  src={getBackendImageUrl(file)}
                  alt={`Attachment ${idx + 1}`}
                  className="img-fluid rounded"
                  style={{ width: 100, height: 100, objectFit: 'cover', objectPosition: 'center' }}
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default RequestAttachments;
