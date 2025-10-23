
import { GoogleGenAI, Modality } from "@google/genai";

// A utility to parse the mime type and base64 data from a data URL
const parseDataUrl = (dataUrl: string) => {
    const match = dataUrl.match(/^data:(.*);base64,(.*)$/);
    if (!match) {
        throw new Error("Invalid data URL format.");
    }
    return { mimeType: match[1], data: match[2] };
};

export const generateCombinedImage = async (
    personImageDataUrl: string, 
    objectImageDataUrl: string, 
    prompt: string
): Promise<string> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set.");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const personImage = parseDataUrl(personImageDataUrl);
    const objectImage = parseDataUrl(objectImageDataUrl);

    const personImagePart = {
        inlineData: {
            data: personImage.data,
            mimeType: personImage.mimeType,
        },
    };

    const objectImagePart = {
        inlineData: {
            data: objectImage.data,
            mimeType: objectImage.mimeType,
        },
    };

    const textPart = { text: prompt };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [personImagePart, objectImagePart, textPart],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        const imagePart = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);

        if (imagePart && imagePart.inlineData) {
            return `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
        }

        throw new Error("No image data found in the API response.");

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        if (error instanceof Error) {
            throw new Error(`Gemini API Error: ${error.message}`);
        }
        throw new Error("An unknown error occurred while contacting the Gemini API.");
    }
};
