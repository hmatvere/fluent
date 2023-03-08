const express = require('express');
const app = express();
const textToSpeech = require('@google-cloud/text-to-speech');
const { PassThrough } = require('stream');
const { Translate } = require('@google-cloud/translate').v2;
//const axios = require('axios');
const cors = require('cors');
const { Configuration, OpenAIApi } = require("openai");


app.use(cors());
//to allow request from client side 
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); //http://localhost:3000
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//--translation settings
const target = 'en';

const translate = new Translate({
  projectId: 'subtle-seat-368211',
  keyFilename: 'C:\\Users\\henry\\AppData\\Roaming\\gcloud\\application_default_credentials.json'
});

// Creates a client
//const translate = new Translate();

//client side react runs on 3000 so do not use 3000
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});




//const fs = require('fs');
//const util = require('util');

// credidentials
//const key = "AIzaSyCx_k0uXPoIOZWIo6qVUm9uasyK8ql6Mt4";
//const email = "hmatvere@gmail.com"

// client
const client = new textToSpeech.TextToSpeechClient();

//environment variable for the application default credentials
process.env.GOOGLE_APPLICATION_CREDENTIALS = "C:\\Users\\henry\\AppData\\Roaming\\gcloud\\application_default_credentials.json";


class AudioController {
  static async apiGetPronounce(req, res, next) {
    try {
      const request = {
        input: { text: req.query.text },
        voice: { languageCode: req.query.langCode, ssmlGender: 'NEUTRAL' },
        audioConfig: { audioEncoding: 'MP3' },
      }
      res.set({
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': 'attachment; filename=pronunciation.mp3',
        'Transfer-Encoding': 'chunked'
      })
      const [response] = await client.synthesizeSpeech(request)
      const bufferStream = new PassThrough()
      bufferStream.end(Buffer.from(response.audioContent))
      bufferStream.pipe(res)
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }
}



app.get('/api/translate', async (req, res) => {
  const { word } = req.query;

  try {
    // Translates the word to English
    const [translation] = await translate.translate(word, 'en');

    // Sends the translated word back to the client-side
    res.send({ translation });
  } catch (e) {
    console.error(`Failed to translate ${word} to English: ${e}`);
    res.status(500).send({ error: `Failed to translate ${word} to English` });
  }
});

//define endpoint for client to access
app.get('/api/pronounce', AudioController.apiGetPronounce);


module.exports = AudioController;

organisationID = 'org-0pAscKh9WBhtgFqt2ouoeZdV';




//image generation
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

process.env.OPENAI_API_KEY = "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";

const configuration = new Configuration({
  organization: "org-0pAscKh9WBhtgFqt2ouoeZdV",
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

async function run() {
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{role: "user", content: "Hello world"}],
  });
  console.log(completion.data.choices[0].text);

}

run().catch(error => console.error(error));


// app.post('/api/image', async (req, res) => {
//   try {
//     const prompt = req.body.prompt;
//     const response = await openaiClient.createImage({
//       prompt: prompt,
//       n: 1,
//       size: "1024x1024",
//     });
//     const imageUrl = response.data.data[0].url;
//     res.send({ imageUrl: imageUrl });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Error generating image');
//   }
// });



app.post('/api/text', async (req, res) => {
  const { prompt, length } = req.body;
  const response = await openai.complete({
    engine: 'davinci',
    prompt: prompt,
    maxTokens: length
  });
  const { choices } = response.data;
  const text = choices[0].text.trim();
  res.send({ text: text });
});




