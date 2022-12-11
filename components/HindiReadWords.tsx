import React from 'react'
import { Cursor, useTypewriter } from 'react-simple-typewriter';
import BackgroundCircles from './BackgroundCircles';
import Image from 'next/image';
import "regenerator-runtime/runtime"
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';


// type Props = {}

// // const Dictaphone = () => {
// //     const {
// //       transcript,
// //       listening,
// //       resetTranscript,
// //       browserSupportsSpeechRecognition
// //     } = useSpeechRecognition();

// //     if (!browserSupportsSpeechRecognition) {
// //       return <span>Browser doesn't support speech recognition.</span>;
// //     }

// //     return (

// //       <div>
// //         <p>Microphone: {listening ? 'on' : 'off'}</p>
// //         <button onClick={SpeechRecognition.startListening}>Start</button>
// //         <button onClick={SpeechRecognition.stopListening}>Stop</button>
// //         <button onClick={resetTranscript}>Reset</button>
// //         <p>{transcript}</p>
// //       </div>

// //     );
// //   };
// //   export default Dictaphone;

// //READ THIS DONT FORGET, basically we need to do our code above and shove it in HindiReadWords somehow well maybe not use that function or idk

// function HindiReadWords({ }: Props) {
// 	const [text] = useTypewriter({
// 		words: [
// 			"Please pronounce - संगणक sanganak", //i want to write into this field using speech to text api.
// 		],
// 		loop: 0,
// 		delaySpeed: 2000,
// 	});

// 	const {
// 		transcript,
// 		listening,
// 		resetTranscript,
// 		browserSupportsSpeechRecognition
// 	} = useSpeechRecognition();


// 	if (!browserSupportsSpeechRecognition) {
// 		//this is the first thing that causes - Unhandled runtime error - Error: Hydration failed because the initial UI does not match what was rendered on the server. ignore for now
// 		return <span>Browser doesn't support speech recognition.</span>;
// 	}


// 	return (
// 		<div className='h-screen flex flex-col space-y-8 items-center justify-center text-center overflow-hidden'>
// 			<BackgroundCircles />
// 			<Image
// 				src='/../public/fluent.png'
// 				alt='Fluent Logo'
// 				width={300}
// 				height={300}
// 			/>
// 			<h1 className='text-5xl lg:text-3xl font-semibold px-10'>
// 				<span className='mr-3'>{text}</span>
// 				<Cursor cursorColor='#00E7F2' />
// 			</h1>
// 			<div>
// 				<p>Microphone: {listening ? 'on' : 'off'}</p>
// 				<button onClick={SpeechRecognition.startListening}>Start</button>
// 				<button onClick={SpeechRecognition.stopListening}>Stop</button>
// 				<button onClick={resetTranscript}>Reset</button>
// 				<p>{transcript}</p>
// 			</div>
// 		</div>
// 	)
// }

// export default HindiReadWords;