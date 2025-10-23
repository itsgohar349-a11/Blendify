
import React from 'react';

export const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center my-10">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-brand-light"></div>
      <p className="mt-4 text-lg text-gray-400">AI is working its magic...</p>
    </div>
  );
};
