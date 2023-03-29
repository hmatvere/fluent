// This is an API route that uses the OpenAI API to translate text to a target language
import type { NextApiRequest, NextApiResponse } from 'next';
import openai from '../../lib/openai';

type Data = {
  translatedText: string;
};

// This function uses the OpenAI API to translate text to a target language
async function translateText(prompt: string, targetLanguage: string) {
  const response = await openai.post('/chat/completions', {
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: `You are a helpful assistant that translates English text to ${targetLanguage}.` },
      { role: 'user', content: `Translate the following text: ${prompt}` },
    ],
  });

  return response.data.choices[0].message.content.trim();
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { text, targetLanguage } = req.body;

  // Validate the request body
  
  try {
    const translatedText = await translateText(text, targetLanguage);
    res.status(200).json({ translatedText });
  } catch (error) {
    res.status(500).json({ translatedText: 'Error: Unable to translate text' });
  }
}
