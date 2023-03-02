import Head from "next/head";
import React, { useState, useEffect, useRef } from 'react';
import "regenerator-runtime/runtime"
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
//import fetch from 'node-fetch';
//import { FileReader } from 'file-reader'
//import Config from 'react-native-config';
//import RNFS from 'react-native-fs';
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
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isFinishedSpeaking, setIsFinishedSpeaking] = useState(false);
  
 
  

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


 
//---------------------------------------------------------  non html5 version  below
  function playText(text: string, langCode: string) {
    axios.get('http://localhost:5000/api/pronounce', {
      params: {
        text: text,
        langCode: langCode
      },
      responseType: "blob",
    })
    .then(response => {
      const binaryData = response.data;
      const blob = new Blob([binaryData], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.preload = "none";
      console.log("url:",url);
      console.log("audio.src",audio.src);
      console.log("audio:",audio);
      //const audio = new Audio(response.data);
      //console.log(response.data);
      audio.play();
    })
    .catch(error => {
      console.error(error);
    });
};
//--------------------------------------------------------- html5 version  below


// function playText(text: string, langCode: string) {
//   const [audioUrl, setAudioUrl] = useState<string | null>(null);

//   axios
//     .get("http://localhost:5000/api/pronounce", {
//       params: {
//         text: text,
//         langCode: langCode,
//       },
//     })
//     .then((response) => {
//       const binaryData = response.data;
//       const blob = new Blob([binaryData], { type: "audio/mpeg" });
//       const url = URL.createObjectURL(blob);
//       setAudioUrl(url);
//     })
//     .catch((error) => {
//       console.error(error);
//     });

//   return (
//     <div>
//       {audioUrl ? <AudioPlayer src={audioUrl} /> : null}
//     </div>
//   );
// }



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
      parse(response.data, {columns: true, trim: true}, function(err: any, data: any[]){
          if(err) throw err;
          let hindiWords = data.map((row: { hword: any; }) => row.hword);
          //console.log("yes@@",data[0].hword);
          //console.log(hindiWords[0]); // hindiWords is not loaded.
          //console.log("yes",hindiWords[Math.floor(Math.random() * hindiWords.length)]);
          const currentWord_ = hindiWords[Math.floor(Math.random() * hindiWords.length)];
          setCurrentWord(currentWord_);

          playText(currentWord_, 'hi-IN');
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
   // setTimeout(() => {
   //   setGuess('');
    //}, 10000000);
  }

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