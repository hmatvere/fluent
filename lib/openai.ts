import axios from 'axios';

// Create an axios instance with the OpenAI API base URL and the API key
const openai = axios.create({
  baseURL: 'https://api.openai.com/v1',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
  },
});

export default openai;
