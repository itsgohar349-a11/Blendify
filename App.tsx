import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { GeneratedImageGrid } from './components/GeneratedImageGrid';
import { generateCombinedImage } from './services/geminiService';
import { Loader } from './components/Loader';

const App: React.FC = () => {
  const [personImage, setPersonImage] = useState<string | null>(null);
  const [objectImage, setObjectImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fileToDataUrl = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handlePersonImageSelect = useCallback(async (file: File) => {
    try {
      const dataUrl = await fileToDataUrl(file);
      setPersonImage(dataUrl);
    } catch (error) {
      setError('Failed to read person image.');
    }
  }, []);

  const handleObjectImageSelect = useCallback(async (file: File) => {
    try {
      const dataUrl = await fileToDataUrl(file);
      setObjectImage(dataUrl);
    } catch (error) {
      setError('Failed to read object image.');
    }
  }, []);

  const handleGenerateClick = async () => {
    if (!personImage || !objectImage) {
      setError('Please upload both a person and an object image.');
      return;
    }

    setIsLoading(true);
    setGeneratedImages([]);
    setError(null);

    const basePrompt = `Combine the uploaded human photo with the uploaded object image so the object appears naturally held, touched, or interacted with by the person. Keep the person’s face, body, and pose realistic and unchanged. Make lighting, color, and shadows consistent for a smooth, natural, and high-quality result. Avoid distortions, extra fingers, weird shadows, or unnatural lighting. The final image should be photorealistic with cinematic lighting, high detail, and in a 16:9 landscape aspect ratio.`;
    const userPromptPart = prompt.trim() ? `${prompt.trim()}. ` : '';

    // Array of prompt variations for different angles/views
    const promptVariations = [
        "Generate the scene with a focus on the interaction, viewed from the front.",
        "Show the scene from a slight side angle to add depth and perspective.",
        "Create a version where the person is looking towards the object they are interacting with, creating a connection.",
        "Generate a candid shot from a slightly different perspective, capturing a natural, unposed moment."
    ];

    try {
      const generationPromises = promptVariations.map(variation => {
        const finalPrompt = `${userPromptPart}${basePrompt} Instruction for this specific image: ${variation}`;
        return generateCombinedImage(personImage, objectImage, finalPrompt);
      });
      
      const results = await Promise.all(generationPromises);
      setGeneratedImages(results);
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Failed to generate images. ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-100 text-gray-200 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">
            AI Image Fusion
          </h1>
          <p className="mt-2 text-lg text-gray-400 max-w-2xl mx-auto">
            Upload a person and an object, and watch AI seamlessly blend them into a single, realistic image.
          </p>
        </header>

        <main>
          <div className="bg-base-200 p-6 rounded-2xl shadow-lg mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <ImageUploader
                id="person-uploader"
                label="Person Photo"
                onImageSelect={handlePersonImageSelect}
                previewSrc={personImage}
                onClear={() => setPersonImage(null)}
              />
              <ImageUploader
                id="object-uploader"
                label="Object Image"
                onImageSelect={handleObjectImageSelect}
                previewSrc={objectImage}
                onClear={() => setObjectImage(null)}
              />
            </div>
            <div className="mb-6">
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
                Optional prompt (e.g., "the man is feeding a cat")
              </label>
              <textarea
                id="prompt"
                rows={3}
                className="w-full bg-base-300 border border-gray-600 rounded-lg p-3 text-gray-200 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition"
                placeholder="Add extra instructions for a more creative result..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>
            <div className="text-center">
              <button
                onClick={handleGenerateClick}
                disabled={isLoading || !personImage || !objectImage}
                className="w-full md:w-auto px-12 py-3 bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold rounded-lg shadow-md hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 transition-transform duration-300"
              >
                {isLoading ? 'Generating...' : '✨ Fuse Images'}
              </button>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg relative mb-8" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {isLoading && <Loader />}

          {generatedImages.length > 0 && <GeneratedImageGrid images={generatedImages} />}

        </main>
      </div>
    </div>
  );
};

export default App;
