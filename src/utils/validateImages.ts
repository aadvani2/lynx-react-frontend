/**
 * Image validation utility for React applications
 * Validates file types, sizes, dimensions, duplicates, and more
 */

export interface ValidateImagesOptions {
  allowedTypes?: string[];
  maxFileSize?: number; // in bytes
  maxDimensions?: {
    width: number;
    height: number;
  };
  maxFiles?: number;
  checkDuplicates?: boolean;
  useHashForDuplicates?: boolean; // Use MD5/SHA-1 hash for duplicate detection
}

export interface ValidationError {
  type: string;
  message: string;
  fileName?: string;
  index?: number;
}

export interface ValidationResult {
  valid: boolean;
  files?: File[];
  errors?: ValidationError[];
}

const DEFAULT_OPTIONS: Required<Omit<ValidateImagesOptions, 'maxDimensions'>> & {
  maxDimensions: { width: number; height: number };
} = {
  allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  maxFileSize: 2 * 1024 * 1024, // 2MB in bytes
  maxDimensions: {
    width: 2000,
    height: 2000,
  },
  maxFiles: 10,
  checkDuplicates: true,
  useHashForDuplicates: false,
};

/**
 * Get file extension from filename
 */
const getFileExtension = (filename: string): string => {
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
};

/**
 * Check if file extension is allowed
 */
const isExtensionAllowed = (filename: string, allowedTypes: string[]): boolean => {
  const extension = getFileExtension(filename);
  const allowedExtensions = allowedTypes.map((type) => {
    const mimeParts = type.split('/');
    return mimeParts.length > 1 ? mimeParts[1].toLowerCase() : '';
  });

  return allowedExtensions.includes(extension);
};

/**
 * Generate hash for file using SubtleCrypto
 */
const generateFileHash = async (file: File, algorithm: 'SHA-1' | 'SHA-256' = 'SHA-1'): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest(algorithm, arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
};

/**
 * Get image dimensions using Image() constructor
 */
const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Failed to load image: ${file.name}`));
    };

    img.src = url;
  });
};

/**
 * Validate a single file's MIME type
 */
const validateMimeType = (file: File, allowedTypes: string[]): boolean => {
  // Check if file.type starts with 'image/'
  if (!file.type || !file.type.startsWith('image/')) {
    return false;
  }

  // Check if MIME type is in allowed list
  return allowedTypes.includes(file.type.toLowerCase());
};

/**
 * Validate file type (both MIME type and extension)
 */
const validateFileType = (file: File, allowedTypes: string[]): { valid: boolean; error?: string } => {
  // Explicitly reject GIF files
  const fileTypeLower = file.type?.toLowerCase() || '';
  const fileNameLower = file.name?.toLowerCase() || '';
  if (fileTypeLower === 'image/gif' || fileNameLower.endsWith('.gif')) {
    return {
      valid: false,
      error: `File "${file.name}" is a GIF file. GIF files are not allowed. Please use JPG, PNG, or WEBP format.`,
    };
  }

  // Check MIME type starts with 'image/'
  if (!file.type || !file.type.startsWith('image/')) {
    return {
      valid: false,
      error: `File "${file.name}" does not have a valid image MIME type. Detected: ${file.type || 'unknown'}`,
    };
  }

  // Check if MIME type is allowed
  if (!validateMimeType(file, allowedTypes)) {
    return {
      valid: false,
      error: `File "${file.name}" has unsupported MIME type: ${file.type}. Allowed types: ${allowedTypes.join(', ')}`,
    };
  }

  // Check file extension
  if (!isExtensionAllowed(file.name, allowedTypes)) {
    return {
      valid: false,
      error: `File "${file.name}" has unsupported extension. Allowed extensions: ${allowedTypes.map((t) => t.split('/')[1]).join(', ')}`,
    };
  }

  return { valid: true };
};

/**
 * Validate file size
 */
const validateFileSize = (file: File, maxSize: number): { valid: boolean; error?: string } => {
  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2);
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
    return {
      valid: false,
      error: `File "${file.name}" exceeds maximum size of ${maxSizeMB}MB. Current size: ${fileSizeMB}MB`,
    };
  }
  return { valid: true };
};

/**
 * Validate image dimensions
 */
const validateImageDimensions = async (
  file: File,
  maxDimensions: { width: number; height: number }
): Promise<{ valid: boolean; error?: string }> => {
  try {
    const dimensions = await getImageDimensions(file);
    if (dimensions.width > maxDimensions.width || dimensions.height > maxDimensions.height) {
      return {
        valid: false,
        error: `File "${file.name}" exceeds maximum dimensions of ${maxDimensions.width}x${maxDimensions.height}px. Current dimensions: ${dimensions.width}x${dimensions.height}px`,
      };
    }
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: `Failed to read dimensions for file "${file.name}": ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
};

/**
 * Detect duplicate files
 */
const detectDuplicates = async (
  files: File[],
  useHash: boolean
): Promise<{ valid: boolean; errors: ValidationError[] }> => {
  const errors: ValidationError[] = [];
  const seen = new Map<string, Set<number>>(); // Map<identifier, Set<indices>>

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    let identifier: string;

    if (useHash) {
      // Use hash for duplicate detection
      identifier = await generateFileHash(file);
    } else {
      // Use filename + size for duplicate detection
      identifier = `${file.name}_${file.size}`;
    }

    if (!seen.has(identifier)) {
      seen.set(identifier, new Set([i]));
    } else {
      const indices = seen.get(identifier)!;
      indices.add(i);

      if (indices.size === 2) {
        // First duplicate found - report all instances
        const allIndices = Array.from(indices);
        errors.push({
          type: 'duplicate',
          message: `Duplicate files detected: "${file.name}" appears ${indices.size} times (indices: ${allIndices.join(', ')})`,
          fileName: file.name,
          index: i,
        });
      } else if (indices.size > 2) {
        // Additional duplicate
        errors.push({
          type: 'duplicate',
          message: `Duplicate file: "${file.name}" (index ${i})`,
          fileName: file.name,
          index: i,
        });
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Main validation function
 * @param files - Array of File objects to validate
 * @param options - Optional configuration to override defaults
 * @returns Promise<ValidationResult> - Result object with valid flag, files, and errors
 */
const validateImages = async (
  files: File[],
  options: ValidateImagesOptions = {}
): Promise<ValidationResult> => {
  const config = {
    allowedTypes: options.allowedTypes || DEFAULT_OPTIONS.allowedTypes,
    maxFileSize: options.maxFileSize ?? DEFAULT_OPTIONS.maxFileSize,
    maxDimensions: options.maxDimensions || DEFAULT_OPTIONS.maxDimensions,
    maxFiles: options.maxFiles ?? DEFAULT_OPTIONS.maxFiles,
    checkDuplicates: options.checkDuplicates ?? DEFAULT_OPTIONS.checkDuplicates,
    useHashForDuplicates: options.useHashForDuplicates ?? DEFAULT_OPTIONS.useHashForDuplicates,
  };

  const errors: ValidationError[] = [];

  // 1. Validate number of files
  if (files.length === 0) {
    return {
      valid: false,
      errors: [
        {
          type: 'empty',
          message: 'No files provided',
        },
      ],
    };
  }

  if (files.length > config.maxFiles) {
    errors.push({
      type: 'maxFiles',
      message: `Too many files. Maximum allowed: ${config.maxFiles}, provided: ${files.length}`,
    });
  }

  // 2. Validate each file synchronously (type, size)
  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    // File type validation (MIME type + extension)
    const typeValidation = validateFileType(file, config.allowedTypes);
    if (!typeValidation.valid) {
      errors.push({
        type: 'fileType',
        message: typeValidation.error!,
        fileName: file.name,
        index: i,
      });
      continue; // Skip further validation for this file
    }

    // File size validation
    const sizeValidation = validateFileSize(file, config.maxFileSize);
    if (!sizeValidation.valid) {
      errors.push({
        type: 'fileSize',
        message: sizeValidation.error!,
        fileName: file.name,
        index: i,
      });
    }
  }

  // 3. Validate image dimensions asynchronously (using Promise.all)
  const dimensionValidations = await Promise.all(
    files.map((file, index) =>
      validateImageDimensions(file, config.maxDimensions).then((result) => ({
        index,
        file,
        result,
      }))
    )
  );

  dimensionValidations.forEach(({ index, file, result }) => {
    if (!result.valid) {
      errors.push({
        type: 'dimensions',
        message: result.error!,
        fileName: file.name,
        index,
      });
    }
  });

  // 4. Detect duplicates (if enabled)
  if (config.checkDuplicates) {
    const duplicateResult = await detectDuplicates(files, config.useHashForDuplicates);
    if (!duplicateResult.valid) {
      errors.push(...duplicateResult.errors);
    }
  }

  // Return result
  if (errors.length > 0) {
    return {
      valid: false,
      errors,
    };
  }

  return {
    valid: true,
    files,
  };
};

export default validateImages;
