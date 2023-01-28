import Head from "next/head";
import React, { useState, useEffect } from 'react';
import "regenerator-runtime/runtime"
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
//import * as googleTTS from 'google-tts-api'; 
//const textToSpeech = require('@google-cloud/text-to-speech');
//import * as textToSpeech from '@google-cloud/text-to-speech';
//import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import * as textToSpeech from '@google-cloud/text-to-speech';
import ISynthesizeSpeechRequest from '@google-cloud/text-to-speech';
import * as FileSaver from 'file-saver';
import Footer from "../components/Footer";
import Header from "../components/Header";
import HindiReadWords from "../components/HindiReadWords";
import Services from "../components/Services";
import styles from "../styles/Home.module.css";
import axios from 'axios';
//import csv from 'csv-parser';
import parse from 'csv-parse';
//import parse from 'csv-parse/lib/es5';
import * as TextEncoder from 'text-encoding';
//import * as parse from 'csv-parse/lib/sync';
import { debug } from "util";

const LANGUAGE_MAP = {
  'हिन्दी': 'hi-IN', //हिन्दी
  'ne-IP': 'ne-NP', //नेपाली भाषा
  'ગુજરાતી': 'gu-IN' //ગુજરાતી
}

const HindiWords = ['नमस्ते', 'अलविदा', 'नमस्ते आ']

//नमस्ते

const Game = () => {


  const [language, setLanguage] = useState('hi-IN')
  const [guess, setGuess] = useState('')
  const [words, setWords] = useState([])
  const [currentWord, setCurrentWord] = useState(null)
  const [points, setPoints] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isGuessing, setIsGuessing] = useState(false)
  const [dictionaryWords, setDictionaryWords] = useState([]);
  //const fs = require('fs');
  //const util = require('util');


  //google tts test
  //const client = new TextToSpeechClient();

  // Creates a client
  // const client = new textToSpeech.TextToSpeechClient();

  // async function quickStart() {
  //   // The text to synthesize
  //   const text = 'hello, world!';
  
    
  
  //   // Construct the request
  //   const request = {
  //     input: {text: text},
  //     // Select the language and SSML voice gender (optional)
  //     voice: {languageCode: 'en-US', ssmlGender: 'NEUTRAL'},
  //     // select the type of audio encoding
  //     audioConfig: {audioEncoding: 'MP3'},
  //   } as ISynthesizeSpeechRequest;
  
  //   // Performs the text-to-speech request
  //   const response = await client.synthesizeSpeech(request);
  
  //   // Get the audio content from the response
  //   const audioContent = response[0].audioContent;
  
  //   // Create an HTML5 audio element
  //   const audio = new Audio();
  
  //   // Set the audio content as the source of the audio element
  //   audio.src = 'data:audio/mp3;base64,' + Buffer.from(audioContent).toString('base64');
  
  //   // Play the audio
  //   audio.play();
  // }
  

  const commands = Object.keys(LANGUAGE_MAP).map(language => ({
    command: language,
    callback: () => {
      setLanguage(LANGUAGE_MAP[language])
      SpeechRecognition.startListening({
        continuous: true,
        language: LANGUAGE_MAP[language]
      })
    },
    matchInterim: true
  }))


  const googleTTS = require('google-tts-api'); // CommonJS
  const { transcript } = useSpeechRecognition({ commands })
  const { resetTranscript } = useSpeechRecognition()

  
  useEffect(() => {
    setGuess(transcript);
  }, [transcript]);

  const handleReset = () => {
    resetTranscript();
  };

  useEffect(() => {
    SpeechRecognition.startListening({
      continuous: true,
      language: 'hi-IN'
    })
  }, [])

  useEffect(() => {
    if (words.length === 0) return
    if (currentWord === null) setCurrentWord(words[0])
  }, [words])

  const startGame = () => {
    setIsPlaying(true)
    //this below is used for testing 
    //setWords(HindiWords)
    fetchRandomWord();
  }
  const { parse } = require('csv-parse');
  //grab word 
  const fetchRandomWord = async () => {
    try {
      const response = await axios.get(
          'https://raw.githubusercontent.com/bdrillard/english-hindi-dictionary/master/English-Hindi%20Dictionary.csv',
          { responseType: 'text' }
      );
      parse(response.data, {columns: true, trim: true}, function(err, data){
          if(err) throw err;
          let hindiWords = data.map(row => row.hword);
          //console.log("yes@@",data[0].hword);
          //console.log(hindiWords[0]); // hindiWords is not loaded.
          //console.log("yes",hindiWords[Math.floor(Math.random() * hindiWords.length)]);
          setCurrentWord(hindiWords[Math.floor(Math.random() * hindiWords.length)]);
      });
  } catch (error) {
      console.log(error);
  }
}

  const guessWord = () => {
    console.log(currentWord,"<-currentword")
    if(currentWord){
      console.log("word we spoke: "+guess.toLowerCase())
      console.log(guess.toLowerCase()," : ",currentWord.toLowerCase());
      if (guess.toLowerCase() === currentWord.toLowerCase()) {
        setPoints(points + 1)
        console.log("1")
        console.log(points)
        setGuess('');
      }
      resetTranscript()
      console.log("transcript:",transcript)
      setGuess('');
      setIsGuessing(false)
      const currentIndex = words.indexOf(currentWord)
      //setCurrentWord(words[currentIndex + 1])
      fetchRandomWord()
     
      console.log("setGuess('')")
   
    }
  }

  



  const startGuessing = async () => {
    setGuess('');
    setIsGuessing(true)
    setTimeout(() => {
      setGuess('');
    }, 1000);

    //speakText("Hello World", "AIzaSyCx_k0uXPoIOZWIo6qVUm9uasyK8ql6Mt4")
   // console.log("hellow")
  // get audio URL
  //   const url = googleTTS.getAudioUrl('Hello World', {
  //     lang: 'en-GB',
  //     slow: false,
  //     host: 'https://translate.google.com',
  // });

  //   const audio = new Audio(url);
  //   audio.play();
  //   console.log(url); 

}

  

   //https://stackoverflow.com/questions/74805486/error-hydration-failed-with-react-speech-recognition
 // if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
  //  return null
 // }

  return (

    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {isPlaying ? (
        <>
          <div>
            <span>language: {language}</span>
            <span>points: {points}</span>
          </div>
          <div>
            <span>current word: {currentWord}</span>
            {isGuessing ? (
              <div>
                <span>{guess}</span> 
                <button onClick={() => {
                            handleReset();
                            guessWord();
                }}>Guess word</button>
              </div>
            ) : (
              <button onClick={startGuessing}>Start guessing</button>
            )}
          </div>
        </>
      ) : (
        <button onClick={startGame}>Start game</button>
      )}
    </div>
  )
}
export default Game