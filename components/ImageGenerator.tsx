import { useState, ChangeEvent, MouseEvent } from "react";
import openai from "openai";
import axios from "axios";

interface Props {}

const ImageGenerator: React.FC<Props> = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [image, setImage] = useState<string>("");

  const handleClick = async () => {
    try {
      const openaiApiKey = process.env.NEXT_PUBLIC_DALLE_API_KEY;
      if (!openaiApiKey) {
        console.error("OpenAI API key not found.");
        return;
      }

      const response = await axios.post(
        "https://api.openai.com/v1/images/generations",
        {
          model: "image-alpha-001",
          prompt: prompt,
          n: 1,
          size: "1024x1024",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openaiApiKey}`,
          },
        }
      );

      const imageUrl = response.data.data[0].url;
      setImage(imageUrl);
    } catch (error) {
      console.error("Error generating image:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-md">
        <h3 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Image Generator
        </h3>
        <input
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setPrompt(e.target.value)
          }
          className="mt-8 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none text-black focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Search an Image based on the cultures we teach!"
        />
        <button
          onClick={(e: MouseEvent<HTMLButtonElement>) => handleClick()}
          className="mt-8 group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Generate Image
        </button>
        {image.length > 0 ? (
          <img
            src={image}
            alt="Generated"
            className="mt-8 mx-auto w-full h-auto max-h-80 rounded-md shadow-lg"
          />
        ) : null}
      </div>
    </div>
  );
};

export default ImageGenerator;
