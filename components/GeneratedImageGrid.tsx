
import React from 'react';

interface GeneratedImageGridProps {
  images: string[];
}

const DownloadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);


export const GeneratedImageGrid: React.FC<GeneratedImageGridProps> = ({ images }) => {
  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold text-center mb-6">Your Fused Images</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {images.map((src, index) => (
          <div key={index} className="relative group aspect-video bg-base-300 rounded-lg overflow-hidden shadow-lg">
            <img src={src} alt={`Generated result ${index + 1}`} className="w-full h-full object-contain" />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                <a
                    href={src}
                    download={`fused-image-${index + 1}.png`}
                    className="opacity-0 group-hover:opacity-100 transform group-hover:scale-110 transition-all duration-300 bg-brand-primary p-3 rounded-full text-white"
                    aria-label="Download image"
                >
                    <DownloadIcon />
                </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
