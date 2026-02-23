import React, { lazy, Suspense, useCallback } from "react";
import { useReturningUserFormStore } from "../stores";
import { useFileUploads } from "../hooks/useFileUploads";
const ServiceInformationSection = lazy(() => import("./ServiceInformationSection/ServiceInformationSection"));

const ServiceInformationContainer: React.FC = () => {
  const {
    jobDescription,
    files,
    imagePreviews,
    setJobDescription,
    addFiles,
    addImagePreviews,
    removeFile,
  } = useReturningUserFormStore();

  const { handleFileChange, handleDropFiles } = useFileUploads({
    files,
    addFiles,
    addImagePreviews,
  });

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      await handleDropFiles(Array.from(e.dataTransfer.files));
    },
    [handleDropFiles]
  );

  const handleRemoveFile = useCallback((index: number) => removeFile(index), [removeFile]);

  return (
    <Suspense fallback={null}>
      <ServiceInformationSection
        jobDescription={jobDescription}
        onJobDescriptionChange={setJobDescription}
        files={files}
        imagePreviews={imagePreviews}
        onFileChange={handleFileChange}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onRemoveFile={handleRemoveFile}
      />
    </Suspense>
  );
};

export default ServiceInformationContainer;

