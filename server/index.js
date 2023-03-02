const express = require('express');
const app = express();
const textToSpeech = require('@google-cloud/text-to-speech');
const { PassThrough } = require('stream');



//to allow request from client side 
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); //http://localhost:3000
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});




//client side react runs on 3000 so do not use 3000
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});



// Import other required libraries
const fs = require('fs');
const util = require('util');

// Your API key
const key = "AIzaSyCx_k0uXPoIOZWIo6qVUm9uasyK8ql6Mt4";
const email = "hmatvere@gmail.com"

// Creates a client
const client = new textToSpeech.TextToSpeechClient();


// Set the environment variable for the application default credentials
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
app.get('/api/pronounce', AudioController.apiGetPronounce);

module.exports = AudioController;

//------ just for testing and troubleshooting use code above
  // async function quickStart() {
  //   try {
  //       // The text to synthesize
  //       const text = 'hello, world!';
      
  //       // Construct the request
  //       const request = {
  //         input: {text: text},
  //         // Select the language and SSML voice gender (optional)
  //         voice: {languageCode: 'en-US', ssmlGender: 'NEUTRAL'},
  //         // select the type of audio encoding
  //         audioConfig: {audioEncoding: 'MP3'},
  //       };
      
  //       // Performs the text-to-speech request
  //       const [response] = await client.synthesizeSpeech(request);
  //       // Write the binary audio content to a local file
  //       const writeFile = util.promisify(fs.writeFile);
  //       await writeFile('output.mp3', response.audioContent, 'binary');
  //       console.log('Audio content written to file: output.mp3');
  //       app.get('/audio', (req, res) => {
  //           res.sendFile(`${__dirname}/output.mp3`);
  //         });
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   }
  //   quickStart();
