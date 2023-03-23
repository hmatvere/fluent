const express = require('express');
const app = express();
const textToSpeech = require('@google-cloud/text-to-speech');
const { PassThrough } = require('stream');
const { Translate } = require('@google-cloud/translate').v2;
//const axios = require('axios');
const cors = require('cors');
const corsOptions = {
  origin: "*",  //https://fluent-app-hmatvere.vercel.app
  optionsSuccessStatus: 200,
};
const corsMiddleware = cors(corsOptions);
const { Configuration, OpenAIApi } = require("openai");
// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions_ = require('firebase-functions');

// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
//firebase--- 
var serviceAccount = require("./subtle-seat-368211-firebase-adminsdk-b2ft1-f94924ba18.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

//app.use(function(req, res, next) {
//  res.header("Access-Control-Allow-Origin", "https://fluent-app-hmatvere.vercel.app");
//  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//  next();
//});

//--translation settings
const target = 'en';

const translate = new Translate({
  projectId: 'subtle-seat-368211',
  keyFilename: 'C:\\Users\\henry\\AppData\\Roaming\\gcloud\\application_default_credentials.json'
});

// Creates a client side react runs on 3000 so do not use 3000
//const port = process.env.PORT || 5000;
//app.listen(port, () => {
//  console.log(`Listening on port ${port}`);
//});

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

//define endpoint for client to access
//app.get('/api/pronounce', corsMiddleware,AudioController.apiGetPronounce);
exports.pronounce = functions_.https.onRequest(AudioController.apiGetPronounce);

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

//app.get('/api/translate', corsMiddleware, async (req, res) => {
//  const { word } = req.query;
//  try {
    // Translates the word to English
    //const [translation] = await translate.translate(word, 'en');

    // Sends the translated word back to the client-side
    //res.send({ translation });
  //} catch (e) {
  //  console.error(`Failed to translate ${word} to English: ${e}`);
  //  res.status(500).send({ error: `Failed to translate ${word} to English` });
 // }
//});

exports.translate = functions_.https.onRequest(async (req, res) => {
  // Apply the CORS middleware
  corsMiddleware(req, res, async () => {
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
});

app.get('/api/generate-text', corsMiddleware, async (req, res) => {
  //const { prompt, length } = req.body;
  const { prompt } = req.query;
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{role: "user", content: prompt}],
  });
  const text = completion.data.choices[0].message;
  res.send({ text });
});


app.get('/api/generate-image', corsMiddleware,async (req,res) => {
  const { prompt } = req.query;
  try {
    const response = await openai.createImage({
      prompt: prompt,
      n: 1,
      size: "512x512",
    });
    const imageUrl = response.data.data[0].url;
    console.log(prompt);
    console.log('Generated image URL:', imageUrl);
    res.send({ imageUrl }); // Send the image URL back to the client
  } catch (e) {
    console.error(`Failed to generate image from prompt "${prompt}": ${e}`);
    res.sendStatus(500); // Send an error status code back to the client
    return null;
  }
});

// Export the Express app as a Firebase Cloud Function
exports.api = functions_.https.onRequest(app);

