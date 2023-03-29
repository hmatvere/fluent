// Import the React library and the useState hook from React to manage state in our component
import type { NextPage } from "next";
import { useState } from "react";
import axios from 'axios';

// This is the form that will be rendered on the home page
const TranslatePage: NextPage = () => {
  const [text, setText] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("");
  const [translatedText, setTranslatedText] = useState("");


  async function handleSubmit(text: string, targetLanguage: string) {
		console.log('Received a translation request!');
		const response = await axios.get('https://us-central1-subtle-seat-368211.cloudfunctions.net/expressApi/translateTarget', 
    {
    params: {
      text: encodeURIComponent(text),
      targetLanguage: encodeURIComponent(targetLanguage)
    }
    });
		const translation = response.data.translation;
    setTranslatedText(translation);
		//const response = await axios.get('/translate', { params: { word } });
		//return response.data;
	}

  // Render the form
  return (
    <div className="min-h-screen bg-gray-900 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-10">
          Try our new AI Powered Language Translator Below!
        </h1>
        <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(text, targetLanguage); }}>
            <div className="mb-4">
              <label
                htmlFor="text"
                className="block text-sm font-medium text-gray-700"
              >
                Text to translate
              </label>
              <textarea
                id="text"
                name="text"
                rows={5}
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md text-black"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="targetLanguage"
                className="block text-sm font-medium text-gray-700"
              >
                Target language
              </label>
              <select
                id="targetLanguage"
                name="targetLanguage"
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md text-black"
              >
                <option value="">Choose a language</option>
                <option value="hi">Hindi</option>
                <option value="gu">Gujarati</option>
                <option value="ne">Nepalese</option>
                {/* Add more languages as needed */}
              </select>
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-500 text-white rounded-md"
              disabled={!text || !targetLanguage}
            >
              Translate
            </button>
          </form>
          {translatedText && (
            <div className="mt-4 bg-gray-100 p-4 rounded-md">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Translated Text:
              </h3>
              <p className="text-gray-600">{translatedText}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TranslatePage;
