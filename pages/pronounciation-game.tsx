/*
Author: Henri Matvere
*/

import Head from "next/head";
import React, { useState, useEffect, useRef } from 'react';
import "regenerator-runtime/runtime"
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useRouter } from 'next/router';
import ReactModal from 'react-modal';
//import styles from '../styles/FeedbackGraphic.module.css';
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
//import * as FileSaver from 'file-saver';
import Footer from "../components/Footer";
import Header from "../components/Header";
import Services from "../components/Services";
import axios from 'axios';
//import csv from 'csv-parser';
import parse from 'csv-parse';
//import parse from 'csv-parse/lib/es5';
//import * as TextEncoder from 'text-encoding';
//import * as parse from 'csv-parse/lib/sync';
import { debug } from "util";
//import Translate from '@google-cloud/translate';
//import { Translate } from '@google-cloud/translate';
import { Translate } from '@google-cloud/translate/build/src/v2';

//const LANGUAGE_MAP = {
//	'हिन्दी': 'hi-IN', //हिन्दी
//	'ne-IP': 'ne-NP', //नेपाली भाषा
//	'ગુજરાતી': 'gu-IN' //ગુજરાતી
//}

const LANGUAGE_MAP: {[key: string]: string} = {
	'हिन्दी': 'hi-IN',
	'ne-IP': 'ne-NP',
	'ગુજરાતી': 'gu-IN'
  };



const LANG_ = {
	'Hindi': 'hi-IN',
	'Nepali': 'ne-NP',
	'Gujarati': 'gu-IN',
};
export { LANGUAGE_MAP };
//const HindiWords = ['नमस्ते', 'अलविदा', 'नमस्ते आ']

//नमस्ते

const Game = () => {

	// Retrieve langCode from localStorage on page load
	//const storedLangCode = localStorage.getItem('langCode');
	const storedLangCode = typeof localStorage !== 'undefined' ? localStorage.getItem('langCode') : undefined;
	const langCode = storedLangCode || 'hi-IN'; // set default to 'en' if no value is stored

	

	if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
		return <span>Browser doesn't support speech recognition.</span>;
	}

	const router = useRouter();
	//const lang = router.query.lang as string; // Get the value of the lang query parameter
	const lang: keyof typeof LANG_ = router.query.lang as keyof typeof LANG_;
	// setup the language of the game
	console.log("lang:", lang);
	const languageCode = LANG_[lang];

	//hi-IN is default so that we do not cause an error upon refresh, will default to hindi when refresh
	//ideally use local storage for this but for now this will work as the user should not really need to be refreshing
	//the page anyway 
	const [language, setLanguage] = useState(languageCode || 'hi-IN')
	//const [guess, setGuess] = useState('') from before I used useState<string[]>([]);
	const [guess, setGuess] = useState<string[]>([]);
	const [words, setWords] = useState<string[]>([]);
	const [currentWord, setCurrentWord] = useState<string | null>(null)
	const [points, setPoints] = useState(0)
	const [isPlaying, setIsPlaying] = useState(false)
	const [isGuessing, setIsGuessing] = useState(false)
	const [dictionaryWords, setDictionaryWords] = useState([]);
	const [translatedWord, setTranslatedWord] = useState("");
	const [translateError, setTranslateError] = useState(null);
	const audioRef = useRef<HTMLAudioElement>(null);
	const [isSpeaking, setIsSpeaking] = useState(false);
	const [currentTranscript, setCurrentTranscript] = useState('');

	function processTranscript() {
		 setGuess((prevGuess) => [...prevGuess, currentTranscript]);
    	 setIsSpeaking(false);
    	 setCurrentTranscript('');
	  }

	  const languageCommands = Object.keys(LANGUAGE_MAP).map((language) => ({
		command: language,
		callback: () => {
		  setLanguage(LANGUAGE_MAP[language]);
		  SpeechRecognition.startListening({
			continuous: true,
			language: LANGUAGE_MAP[language],
		  });
		},
		matchInterim: true,
	  }));
	  
	  const allCommands = [
		...languageCommands,
		{
		  command: "*",
		  callback: (transcript: string) => {
			handleGuess(transcript);
		  },
		},
	  ];
	  
	  useSpeechRecognition({ commands: allCommands });

	  const { transcript, resetTranscript } = useSpeechRecognition({ commands: allCommands });

	//---------------------------------------------------------  non html5 version  below
	function playText(text: string, langCode: string) {
		//SpeechRecognition.abortListening();
		console.log("langCode::", langCode);
		axios.get('http://localhost:5000/api/index/pronounce', {
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
				console.log("url:", url);
				console.log("audio.src", audio.src);
				console.log("audio:", audio);
				//const audio = new Audio(response.data);
				//console.log(response.data);
				audio.play();

				// Disable audio listener until TTS finishes playing
				// Resume listening after the audio finishes playing
				//audio.addEventListener('ended', () => {
				//SpeechRecognition.startListening({ continuous: true, language: language });
				//});

			})
			.catch(error => {
				console.error(error);
			});
	};

	//useEffect(() => {
	//	setGuess(transcript);
	//	if (transcript) {
	//		setIsSpeaking(true);
	//	  } else {
	//		setIsSpeaking(false);
	//	  }
	//}, [transcript]);

	useEffect(() => {
		setGuess((prevGuess) => [...prevGuess, transcript]);
		if (transcript) {
			setIsSpeaking(true);
		} else {
			setIsSpeaking(false);
		}
	}, [transcript]);

	const handleReset = () => {
		resetTranscript();
	};

	useEffect(() => {
		SpeechRecognition.startListening({
			continuous: true,
			language: languageCode
		})
	}, [])

	useEffect(() => {
		if (words.length === 0) return
		if (currentWord === null) setCurrentWord(words[0])
	}, [words])

	const startGame = () => {
		setGuess([]);
		handleReset();
		setIsPlaying(true)
		//this below is used for testing 
		//setWords(HindiWords)
		fetchRandomWord();
	}

	const handleGuess = (transcript: string) => {
		if (transcript.trim() !== '') {
		  setGuess((prevGuess) => [...prevGuess, transcript.trim()]);
		  setCurrentTranscript('');
		  resetTranscript();
		}
	  };


	async function getTranslatedWord(word: string) {
		console.log('Received a translation request!');
		const response = await axios.get('http://localhost:5000/api/index/translate', { params: { word } });
		const translation = response.data.translation;
		console.log("translation:",response);
		//const response = await axios.get('/translate', { params: { word } });
		return response.data.translation;
		//return response.data;
	}

	//generate definition for word, also if able to use it to generate gujarati words
	async function generateText(prompt: string) {
		const response = await axios.get('http://localhost:5000/api/index/generate-text', {params : {prompt}});
		return response.data.text;
	}

	//generate image based on prompt.
	async function generateImage(prompt: string) {
		try {
			const response = await axios.get('http://localhost:5000/api/index/generate-image', {params: { prompt }});
			console.log("3",response.data);
			const imgURL_ = response.data.imageUrl;
			console.log("Imageurl:",imgURL_)
			return imgURL_;
		  } catch (error) {
			console.error(error);
		  }
	}
	
	//dictionaries for each language (nepali and hindi are the same)
	const hindiLink = 'https://raw.githubusercontent.com/bdrillard/english-hindi-dictionary/master/English-Hindi%20Dictionary.csv';
	const nepaliLink = 'https://raw.githubusercontent.com/bdrillard/english-hindi-dictionary/master/English-Hindi%20Dictionary.csv';
	const gujaratiLink = 'https://raw.githubusercontent.com/hmatvere/gujarati-to-english-1000-words/main/gujarati-to-english-1000-words.csv';

	//pick a language link to use
	let dictionaryLink = '';
	if (language === 'hi-IN') {
		dictionaryLink = hindiLink;
	} else if (language === 'ne-NP') {
		dictionaryLink = nepaliLink;
	} else if (language === 'gu-IN') {
		dictionaryLink = gujaratiLink;
	} else {
		console.error(`Unknown language: ${language}`);
	}

	const { parse } = require('csv-parse');
	//grab word
	const fetchRandomWord = async () => {
		try {
			const response = await axios.get(
				dictionaryLink,
				{ responseType: 'text' }
			);
			parse(response.data, { columns: true, trim: true }, async function (err: any, data: any[]) {
				if (err) throw err;
				let hindiWords = data.map((row: { hword: any; }) => row.hword);
				//console.log("yes@@",data[0].hword);
				//console.log(hindiWords[0]); // hindiWords is not loaded.
				//console.log("yes",hindiWords[Math.floor(Math.random() * hindiWords.length)]);
				const currentWord_ = hindiWords[Math.floor(Math.random() * hindiWords.length)];
				const translation = await getTranslatedWord(currentWord_);
				setTranslatedWord(translation);
				console.log(translation);
				//console.log(generatedText); // This will log the generated text to the console
				setCurrentWord(currentWord_);
				playText(currentWord_, languageCode);
				const definition = await generateText("what does "+currentWord_+" mean?")
				console.log("test:",definition)
				const wordDefinitionDiv = document.getElementById("word-definition");
				if (wordDefinitionDiv !== null) {
  					wordDefinitionDiv.innerHTML = definition.content;
				}	

			
				//generate image and display it
				console.log("1");
				try {
					console.log("2");
					const imageUrl = await generateImage(translation);
					console.log('Generated image URL:', imageUrl);
					const imageContainer = document.getElementById('image-container');
					if (imageContainer !== null) {
						const imgElement = document.createElement('img');
						imgElement.src = imageUrl;
						const existingImgElement = imageContainer.querySelector('img');
						if (existingImgElement) {
						  imageContainer.replaceChild(imgElement, existingImgElement);
						} else {
						  imageContainer.appendChild(imgElement);
						}
					  }
				  } catch (error) {
					console.log(`Error generating image: ${error}`);
				  }
				 
				
		
			});
		} catch (error) {
			console.log(error);
		}
	}

	const guessWord = () => {
		console.log(currentWord, "<-currentword")
		if (currentWord) {
			const lastGuess = guess[guess.length - 1];
			console.log("word we spoke: " + lastGuess.toLowerCase())
			console.log(lastGuess.toLowerCase(), " : ", currentWord.toLowerCase());
			if (lastGuess.toLowerCase() === currentWord.toLowerCase()) {
				setPoints(points + 1)
				console.log("1")
				console.log(points)
				setGuess([]);
			}
			setGuess([]);
			//resetTranscript()
			console.log("transcript:", transcript)
			setGuess([]);
			setIsGuessing(false)
			const currentIndex = words.indexOf(currentWord)
			//setCurrentWord(words[currentIndex + 1])
			fetchRandomWord()

			console.log("setGuess('')")

		}
	}

	const startGuessing = async () => {
		//const imageContainer = document.getElementById('image-container');
  		//const imgElement = imageContainer.querySelector('img');
  		//if (imgElement) {
    	//imageContainer.removeChild(imgElement);
  		//}
  setGuess([]);
		setGuess([]);
		//handleReset();
		setIsGuessing(true)
		// setTimeout(() => {
		//   setGuess('');
		//}, 10000000);
	}


	return (
		<div className="bg-neutral-900 text-white h-screen snap-y snap-mandatory overflow-scroll z-0 scrollbar-hide">
			<Head>
				<title>Word Guessing Game</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Header />
			<main className="max-w-3xl mx-auto py-8 text-center">

				<h1 className="text-3xl font-bold mb-8">
					Pronunciation skills
				</h1>
				{isPlaying ? (
					<div className="flex flex-col items-center">
						<div className="text-xl mb-4">
							<span>Language: {lang}</span>
							<span className="ml-4">Points: {points}</span>
						</div>
						<div className="text-2xl mb-8">
							<span></span>
							<div>
								<span style={{ marginRight: "15px" }}>{lang}: {currentWord}</span>
								<span>English: {translatedWord}</span>
							</div>
							<div id="image-container"></div>
							<div id="word-definition"></div>
						</div>
						<div>
							{isGuessing ? (
								<div>
									{guess ? (
										<>
										
											<span>{guess}</span>
										</>
									) : (
										<span>Listening for word...</span>
									)}
								</div>
							) : null} {/* Remove the button from here */}
						</div>
						<span>{guess}</span>
						<button
							className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded mt-4"
							onClick={() => {
								handleReset();
								handleGuess(currentTranscript);
								guessWord();
							}}
						>
							Guess
						</button>
					</div>
				) : (
					<div className="flex flex-col items-center">
						<button
							className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
							onClick={startGame}
						>
							Start Game
						</button>
					</div>
				)}
			</main>
			<footer className="absolute bottom-0 w-full text-center py-4">
				<a
					
				>
					<div className="text-sm text-gray-500">
						©2023 Fluent. All rights reserved.
					</div>
				</a>
			</footer>
		</div>
	);
}

export default Game
