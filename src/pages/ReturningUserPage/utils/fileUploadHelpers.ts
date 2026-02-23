import validateImages from '../../../utils/validateImages';

interface ProcessFilesParams {
  incomingFiles: File[];
  existingFiles: File[];
  maxFiles?: number;
}

interface ProcessFilesResult {
  ok: boolean;
  duplicateErrors?: string[];
  validationErrorsHtml?: string;
  validatedImages?: File[];
  pdfFiles?: File[];
  limitExceeded?: boolean;
}

/**
 * Process incoming files for the returning user flow.
 * - Enforces duplicate checks
 * - Validates images via shared validator
 * - Enforces max file count (default 10)
 */
export async function processFiles({
  incomingFiles,
  existingFiles,
  maxFiles = 10,
}: ProcessFilesParams): Promise<ProcessFilesResult> {
  if (!incomingFiles.length) return { ok: true, validatedImages: [], pdfFiles: [] };

  const imageFiles = incomingFiles.filter((f) => f.type.startsWith('image/'));
  const pdfFiles = incomingFiles.filter((f) => f.type === 'application/pdf');
  const existingImageFiles = existingFiles.filter((f) => f.type.startsWith('image/'));

  // Duplicate check against existing images
  const duplicateErrors: string[] = [];
  imageFiles.forEach((newFile) => {
    const isDuplicate = existingImageFiles.some(
      (existingFile) => existingFile.name === newFile.name && existingFile.size === newFile.size
    );
    if (isDuplicate) {
      duplicateErrors.push(`File "${newFile.name}" is already uploaded.`);
    }
  });

  if (duplicateErrors.length > 0) {
    return { ok: false, duplicateErrors };
  }

  // Total file count guard
  const totalFiles = existingFiles.length + incomingFiles.length;
  if (totalFiles > maxFiles) {
    return { ok: false, limitExceeded: true };
  }

  // Validate images
  if (imageFiles.length > 0) {
    const validationResult = await validateImages(imageFiles, {
      maxFiles: maxFiles - existingImageFiles.length,
      checkDuplicates: true,
      useHashForDuplicates: false,
    });

    if (!validationResult.valid) {
      const errorMessages =
        validationResult.errors?.map((err) => err.message).join('\n') || 'Image validation failed';
      const validationErrorsHtml = `<div style="text-align: left; max-height: 400px; overflow-y: auto;">${errorMessages
        .split('\n')
        .map((msg) => `<p style="margin: 5px 0;">• ${msg}</p>`)
        .join('')}</div>`;
      return { ok: false, validationErrorsHtml };
    }

    return {
      ok: true,
      validatedImages: validationResult.files ?? [],
      pdfFiles,
    };
  }

  // No images, only PDFs or other allowed files
  return { ok: true, validatedImages: [], pdfFiles };
}

