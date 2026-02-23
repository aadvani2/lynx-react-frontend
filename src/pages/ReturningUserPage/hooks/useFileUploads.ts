import { useCallback } from 'react';
import Swal from 'sweetalert2';
import { processFiles } from '../utils/fileUploadHelpers';

interface UseFileUploadsParams {
  files: File[];
  addFiles: (files: File[]) => void;
  addImagePreviews: (previews: Array<{ file: File; url: string }>) => void;
}

export function useFileUploads({ files, addFiles, addImagePreviews }: UseFileUploadsParams) {
  const buildDuplicateHtml = (messages: string[]) =>
    `<div style="text-align: left;">${messages.map((msg) => `<p style="margin: 5px 0;">• ${msg}</p>`).join('')}</div>`;

  const handleIncomingFiles = useCallback(
    async (incomingFiles: File[]) => {
      const result = await processFiles({
        incomingFiles,
        existingFiles: files,
        maxFiles: 10,
      });

      if (!result.ok) {
        if (result.duplicateErrors?.length) {
          Swal.fire({
            icon: 'error',
            title: 'Duplicate Files Detected',
            html: buildDuplicateHtml(result.duplicateErrors),
            confirmButtonText: 'OK',
            width: '500px',
          });
          return;
        }

        if (result.limitExceeded) {
          Swal.fire({
            icon: 'warning',
            title: 'Upload Limit Exceeded',
            text: 'Maximum 10 files allowed.',
            confirmButtonText: 'OK',
          });
          return;
        }

        if (result.validationErrorsHtml) {
          Swal.fire({
            icon: 'error',
            title: 'Image Validation Failed',
            html: result.validationErrorsHtml,
            confirmButtonText: 'OK',
            width: '600px',
          });
          return;
        }

        return;
      }

      // Add validated images
      if (result.validatedImages && result.validatedImages.length > 0) {
        addFiles(result.validatedImages);

        const imagePreviews: Array<{ file: File; url: string }> = [];
        result.validatedImages.forEach((file) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            imagePreviews.push({ file, url: event.target?.result as string });
            if (imagePreviews.length === result.validatedImages!.length) {
              addImagePreviews(imagePreviews);
            }
          };
          reader.readAsDataURL(file);
        });
      }

      // Add PDFs
      if (result.pdfFiles && result.pdfFiles.length > 0) {
        addFiles(result.pdfFiles);
      }
    },
    [addFiles, addImagePreviews, files]
  );

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(event.target.files || []);
      await handleIncomingFiles(selectedFiles);
    },
    [handleIncomingFiles]
  );

  const handleDropFiles = useCallback(
    async (droppedFiles: File[]) => {
      await handleIncomingFiles(droppedFiles);
    },
    [handleIncomingFiles]
  );

  return {
    handleFileChange,
    handleDropFiles,
  };
}

