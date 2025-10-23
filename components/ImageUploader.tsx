
import React, { useCallback, useRef } from 'react';

interface ImageUploaderProps {
  id: string;
  label: string;
  onImageSelect: (file: File) => void;
  previewSrc: string | null;
  onClear: () => void;
}

const UploadIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ClearIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);

export const ImageUploader: React.FC<ImageUploaderProps> = ({ id, label, onImageSelect, previewSrc, onClear }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (inputRef.current) {
        inputRef.current.value = "";
    }
    onClear();
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
      <div className="relative aspect-video w-full bg-base-300 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center cursor-pointer hover:border-brand-primary transition-colors">
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept="image/*"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFileChange}
        />
        {previewSrc ? (
          <>
            <img src={previewSrc} alt={label} className="w-full h-full object-contain rounded-lg p-1" />
            <button
              onClick={handleClear}
              className="absolute top-2 right-2 bg-black bg-opacity-60 rounded-full p-1.5 text-white hover:bg-opacity-80 transition-all duration-200 z-10"
              aria-label="Clear image"
            >
              <ClearIcon />
            </button>
          </>
        ) : (
          <div className="text-center">
            <UploadIcon />
            <p className="mt-2 text-sm text-gray-500">Click to upload</p>
          </div>
        )}
      </div>
    </div>
  );
};
