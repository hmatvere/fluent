/*
Author: Henri Matvere
*/

import Head from "next/head";
import React, { useState, useEffect, useRef } from 'react';
import "regenerator-runtime/runtime"
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useRouter } from 'next/router';
import ReactModal from 'react-modal';
import * as textToSpeech from '@google-cloud/text-to-speech';
import ISynthesizeSpeechRequest from '@google-cloud/text-to-speech';
import Footer from "../components/Footer";
import Header from "../components/Header";
import Services from "../components/Services";
import axios from 'axios';
import parse from 'csv-parse';
import { debug } from "util";
import { Translate } from '@google-cloud/translate/build/src/v2';
import { levels } from '../lib/levels';


const LANGUAGE_MAP: {[key: string]: string} = {
	'हिन्दी': 'hi-IN',
	'ne-IP': 'ne-NP',
	'ગુજરાતી': 'gu-IN'
  };

const LANG_: {[key: string]: string} = {
	'Hindi': 'hi-IN',
	'Nepali': 'ne-NP',
	'Gujarati': 'gu-IN',
};
export { LANGUAGE_MAP };

//नमस्ते

const Game = () => {

	// Retrieve langCode from localStorage on page load
	//const storedLangCode = localStorage.getItem('langCode');
	const storedLangCode = typeof localStorage !== 'undefined' ? localStorage.getItem('langCode') : undefined;
	const langCode = storedLangCode || 'hi-IN'; // set default to 'hi-IN' if no value is stored

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
	const [guess, setGuess] = useState<string>('');
	const [words, setWords] = useState<string[]>([]);
	const [currentWord, setCurrentWord] = useState<string | null>(null)
	const [points, setPoints] = useState(0)
	const [isPlaying, setIsPlaying] = useState(false)
	const [isGuessing, setIsGuessing] = useState(false)
	const [translatedWord, setTranslatedWord] = useState("");
	const [isSpeaking, setIsSpeaking] = useState(false);
	const [currentTranscript, setCurrentTranscript] = useState('');
	const [listening, setListening] = useState(false);
	const [level, setLevel] = useState(levels[0]);
	const [targetPoints, setTargetPoints] = useState<number>(level.pointsTillNextLevel );
	const { transcript,resetTranscript } = useSpeechRecognition();
	const [gameStarted, setGameStarted] = useState(false);
	const [time, setTime] = useState(17);
	const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
	


	  useEffect(() => {
		const startListening = async () => {
		  try {
			await SpeechRecognition.startListening({
			  continuous: true,
			  language: langCode,
			});
		  } catch (error) {
			console.error('Error starting speech recognition:', error);
		  }
		};
	
		startListening();
	  }, [languageCode]);
	
	  useEffect(() => {
		  setGuess(transcript);
		  console.log("transcript1:",[transcript])
	  }, [transcript]);

	//------------------------------------------------------ just debugging IGNORE
	useEffect(() => {console.log('Current transcript:', transcript);}, [transcript]);
	  const logTranscript = () => {console.log("Current transcript:", transcript);};
	  // Add a useEffect hook to call logTranscript whenever the transcript value changes
	  useEffect(() => {logTranscript();}, [transcript]);
	//just to see if mic is listening
	useEffect(() => {console.log('Listening:', listening);}, [listening]);
//------------------------------------------------------ just debugging IGNORE

	
	//---------------------------------------------------------  non html5 version  below
	function playText(text: string, langCode: string) {
		SpeechRecognition.abortListening();
		console.log("langCode::", langCode);
		axios
		  .get("https://us-central1-subtle-seat-368211.cloudfunctions.net/pronounce", {
			headers: {
			  "Access-Control-Allow-Origin": "*",
			  "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, PATCH, DELETE",
			  "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
			},
			params: {
			  text: text,
			  langCode: langCode,
			},
			responseType: "blob",
		  })
		  .then((response) => {
			const binaryData = response.data;
				const blob = new Blob([binaryData], { type: 'audio/mpeg' });
				const url = URL.createObjectURL(blob);
				const newAudio = new Audio(url);
				newAudio.preload = "none";
				console.log("url:", url);
				console.log("audio.src", newAudio.src);
				console.log("audio:", newAudio);
				//const audio = new Audio(response.data);
				//console.log(response.data);
				newAudio.play();

				// resume listening after the audio finishes playing
				newAudio.addEventListener('ended', () => {
					SpeechRecognition.startListening({ continuous: true, language: langCode });
				});

				setAudio(newAudio);
				
		  })
		  .catch((error) => {
			console.error(error);
		  });
	  }
	
	useEffect(() => {
		if (words.length === 0) return
		if (currentWord === null) setCurrentWord(words[0])
	}, [words])

	const startGame = () => {
		//setGuess([]);
		setGuess('');
		resetTranscript();
		handleStart();
		setIsPlaying(true)
		//this below is used for testing 
		//setWords(HindiWords)
		fetchRandomWord(level.id);
	}


	const levelUp = () => {
		// Implement an animation or graphic here for the level transition
		console.log("7")
		// Update the level state
		const nextLevelIndex = levels.findIndex((l) => l.id === level.id) + 1;
		if (nextLevelIndex < levels.length) {
			console.log("767")
		  setLevel(levels[nextLevelIndex]);
		  setTargetPoints(levels[nextLevelIndex].pointsTillNextLevel); // Set the target points for the next level
		} else {
		  //user is max level, they keep going till they get bored. Do it where a certain number of wrong guesses in a row
		  //e.g 4 means its game over, and you have to start from scratch
		}
	  };


	// const handleGuess = (transcript: string) => {
	// 	if (transcript.trim() !== '') {
	// 	  setGuess((prevGuess) => [...prevGuess, transcript.trim()]);
	// 	  setCurrentTranscript('');
	// 	  resetTranscript();
	// 	}
	//   };

	async function getTranslatedWord(word: string) {
		console.log('Received a translation request!');
		const response = await axios.get('https://us-central1-subtle-seat-368211.cloudfunctions.net/expressApi/translate', 
		{ 
			//these can be removed from the client side
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
				'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
			  },
			params: { word } });
		const translation = response.data.translation;
		console.log("translation:",response);
		//const response = await axios.get('/translate', { params: { word } });
		return response.data.translation;
		//return response.data;
	}

	//generate definition for word, also if able to use it to generate gujarati words
	async function generateText(prompt: string) {
		const response = await axios.get('https://us-central1-subtle-seat-368211.cloudfunctions.net/expressApi/generate-text', 
		{
			//these can be removed from the client side
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
				'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
			  },
			params : {prompt}});
		return response.data.text;
	}

	//generate image based on prompt.
	async function generateImage(prompt: string) {
		try {
			const response = await axios.get('https://us-central1-subtle-seat-368211.cloudfunctions.net/expressApi/generate-image', 
			{
				//these can be removed from the client side
				headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
				'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
			  },
				params: { prompt }});
			console.log("3",response.data);
			console.log("4",transcript);
			console.log("5");
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
	const fetchRandomWord = async (length: number) => {
		try {
			const response = await axios.get(
				dictionaryLink,
				{ responseType: 'text' }
			);
			parse(response.data, { columns: true, trim: true }, async function (err: any, data: any[]) {
				if (err) throw err;
				let strings = data.map((row: { hword: any; }) => row.hword);
				//console.log("yes@@",data[0].hword);
				//console.log(hindiWords[0]); // hindiWords is not loaded.
				//console.log("yes",hindiWords[Math.floor(Math.random() * hindiWords.length)]);

				//subset of words due to level
				const filteredWords = strings.filter(word => word.length <= level.wordLength);
				const currentWord_ = filteredWords[Math.floor(Math.random() * filteredWords.length)];
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
			const lastGuess = guess;
			console.log("word we spoke: " + lastGuess.toLowerCase())
			console.log(lastGuess.toLowerCase(), " : ", currentWord.toLowerCase());
			if (lastGuess.toLowerCase() === currentWord.toLowerCase()) {
				setGuess('');
  				setPoints((prevPoints) => {
    				const updatedPoints = prevPoints + 1;
    				console.log("1");
    				console.log(updatedPoints);

    				if (updatedPoints >= targetPoints) {
      					levelUp();
    					}
					return updatedPoints;
  					});
			}
			setGuess('');
			//resetTranscript()
			console.log("transcript:", transcript)
			setGuess('');
			setIsGuessing(false)
			const currentIndex = words.indexOf(currentWord)
			//setCurrentWord(words[currentIndex + 1])
			fetchRandomWord(level.id)
			console.log("setGuess('')")
		}
	}

	//when time runs out its game over
	const Timer = ({ gameStarted, time }: { gameStarted: boolean, time: number }) => {
	
	  
		useEffect(() => {
		  if (gameStarted && time > 0) {
			const timer = setTimeout(() => {
			  setTime(time - 1);
			}, 1000);
	  
			return () => clearTimeout(timer);
		   } else if (gameStarted && time === 0){
			
			const inputLanguageName = Object.keys(LANG_).find(key => LANG_[key] === language);

			
			if (audio) {
				audio.pause();
			  }


			console.log("inputLanguageName:",inputLanguageName);
			router.push({
				pathname: '/pronounciation-game-over',
				query: { inputLanguageName, points },
			  });
		  }
		}, [gameStarted, time]);
	  
		const minutes = Math.floor(time / 60).toString().padStart(2, '0');
		const seconds = (time % 60).toString().padStart(2, '0');

		
	  
		return (
		  <div className="timer">
			<div className="time-left" style={{ width: `${(time / 60) * 100}%` }}></div>
			<div className="time-display">{`${minutes}:${seconds}`}</div>
		  </div>
		);
	  };

	  
	  const handleStart = () => {
		setGameStarted(true);
	  };

	return (
		//bg-neutral-900 text-white h-screen snap-y snap-mandatory overflow-scroll z-0 scrollbar-hide
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
				<div className="text-xl mb-4">
							<span className="ml-4">Difficulty: {level.name}</span>
						</div>
				{isPlaying ? (
					<div className="flex flex-col items-center">
						<div className="text-xl mb-4">
							<span>Language: {lang}</span>
							<Timer gameStarted={gameStarted} time={time} />
							<span className="ml-4">Points: {points}</span>
							<span className="ml-4">Difficulty increase after {targetPoints} {targetPoints === 1 ? 'point' : 'points'}</span>
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
								guessWord();
								resetTranscript();
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
		</div>
	);
}

export default Game
