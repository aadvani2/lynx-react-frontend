import { create } from 'zustand';

interface ImagePreview {
  file: File;
  url: string;
}

interface ReturningUserFormState {
  jobDescription: string;
  files: File[];
  imagePreviews: ImagePreview[];
  setJobDescription: (description: string) => void;
  setFiles: (files: File[]) => void;
  setImagePreviews: (previews: ImagePreview[]) => void;
  addFiles: (newFiles: File[]) => void;
  addImagePreview: (preview: ImagePreview) => void;
  addImagePreviews: (previews: ImagePreview[]) => void;
  removeFile: (index: number) => void;
  reset: () => void;
}

export const useReturningUserFormStore = create<ReturningUserFormState>((set, get) => ({
  jobDescription: '',
  files: [],
  imagePreviews: [],
  setJobDescription: (jobDescription) => set({ jobDescription }),
  setFiles: (files) => set({ files }),
  setImagePreviews: (imagePreviews) => set({ imagePreviews }),
  addFiles: (newFiles) => {
    const currentFiles = get().files;
    set({ files: [...currentFiles, ...newFiles] });
  },
  addImagePreview: (preview) => {
    const currentPreviews = get().imagePreviews;
    set({ imagePreviews: [...currentPreviews, preview] });
  },
  addImagePreviews: (previews) => {
    const currentPreviews = get().imagePreviews;
    set({ imagePreviews: [...currentPreviews, ...previews] });
  },
  removeFile: (index: number) => {
    set((state) => {
      const newFiles = state.files.filter((_, i) => i !== index);
      const newImagePreviews = state.imagePreviews.filter((_, i) => i !== index);

      // Revoke object URLs for image previews to prevent memory leaks
      const removedPreview = state.imagePreviews[index];
      if (removedPreview) {
        URL.revokeObjectURL(removedPreview.url);
      }
      return { files: newFiles, imagePreviews: newImagePreviews };
    });
  },
  reset: () => {
    const state = get();
    // Revoke all blob object URLs to prevent memory leaks
    // Note: data URLs (from FileReader.readAsDataURL) don't need to be revoked
    state.imagePreviews.forEach(preview => {
      if (preview.url && preview.url.startsWith('blob:')) {
        try {
          URL.revokeObjectURL(preview.url);
        } catch (error) {
          // Ignore errors if URL was already revoked
        }
      }
    });
    set({
      jobDescription: '',
      files: [],
      imagePreviews: []
    });
  },
}));
