import Head from "next/head";
import React, { useState, useEffect, useRef } from 'react';
import "regenerator-runtime/runtime"
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import ReactModal from 'react-modal';
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
import HindiReadWords from "../components/HindiReadWords";
import LanguageSelectModal from '../components/languageselectmodal';
import Services from "../components/Services";
import styles from "../styles/Home.module.css";
import axios from 'axios';
//import csv from 'csv-parser';
import parse from 'csv-parse';
//import parse from 'csv-parse/lib/es5';
import * as TextEncoder from 'text-encoding';
//import * as parse from 'csv-parse/lib/sync';
import { debug } from "util";
//import Translate from '@google-cloud/translate';
//import { Translate } from '@google-cloud/translate';
import { Translate } from '@google-cloud/translate/build/src/v2';

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
	const [translatedWord, setTranslatedWord] = useState("");
	const [translateError, setTranslateError] = useState(null);
	const audioRef = useRef<HTMLAudioElement>(null);
	const [isFinishedSpeaking, setIsFinishedSpeaking] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(true);




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


	const { transcript, listen } = useSpeechRecognition({ commands })

	const { resetTranscript } = useSpeechRecognition()

	//---------------------------------------------------------  non html5 version  below
	function playText(text: string, langCode: string) {
		//SpeechRecognition.abortListening();
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
		setGuess('');
		handleReset();
		setIsPlaying(true)
		//this below is used for testing 
		//setWords(HindiWords)
		fetchRandomWord();
	}


	async function getTranslatedWord(word: string) {
		console.log('Received a translation request!');
		const response = await axios.get('http://localhost:5000/api/translate', { params: { word } });
		const translation = response.data.translation;
		console.log(translation);
		//const response = await axios.get('/translate', { params: { word } });
		return response.data.translation;
		//return response.data;
	}


	const { parse } = require('csv-parse');
	//grab word
	const fetchRandomWord = async () => {
		try {
			const response = await axios.get(
				'https://raw.githubusercontent.com/bdrillard/english-hindi-dictionary/master/English-Hindi%20Dictionary.csv',
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
				setCurrentWord(currentWord_);
				playText(currentWord_, 'hi-IN');
			});
		} catch (error) {
			console.log(error);
		}
	}

	const guessWord = () => {
		console.log(currentWord, "<-currentword")
		if (currentWord) {
			console.log("word we spoke: " + guess.toLowerCase())
			console.log(guess.toLowerCase(), " : ", currentWord.toLowerCase());
			if (guess.toLowerCase() === currentWord.toLowerCase()) {
				setPoints(points + 1)
				console.log("1")
				console.log(points)
				setGuess('');
			}
			setGuess('');
			//resetTranscript()
			console.log("transcript:", transcript)
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
		<div className="bg-neutral-900 text-white h-screen snap-y snap-mandatory overflow-scroll z-0 scrollbar-hide">
		  <Head>
			<title>Word Guessing Game</title>
			<link rel="icon" href="/favicon.ico" />
		  </Head>
		  <Header />
		  <main className="max-w-3xl mx-auto py-8 text-center">
			{isModalOpen && (
			  <LanguageSelectModal
				isOpen={isModalOpen}
				setIsOpen={setIsModalOpen}
				language={language}
				setLanguage={setLanguage}
			  />
			)}
			<h1 className="text-3xl font-bold mb-8">
			  Pronunciation skills
			</h1>
			{isPlaying ? (
			  <div className="flex flex-col items-center">
				<div className="text-xl mb-4">
				  <span>Language: Hindi</span>
				  <span className="ml-4">Points: {points}</span>
				</div>
				<div className="text-2xl mb-8">
				  <span></span>
				  <div>
					<span style={{ marginRight: "15px" }}>Hindi: {currentWord}</span>
					<span>English: {translatedWord}</span>
				  </div>
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
			  href="https://github.com"
			  target="_blank"
			  rel="noopener noreferrer"
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
