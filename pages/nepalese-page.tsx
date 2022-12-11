import Head from "next/head";
//import React from 'react';
import React, { useState, useEffect } from 'react';
import "regenerator-runtime/runtime"
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
//import React, { useState,useEffect } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import HindiReadWords from "../components/HindiReadWords";
import Services from "../components/Services";
import styles from "../styles/Home.module.css";


//const texts = document.querySelector(".texts"); placeholder but here we will pass the location we will be writing

//const texts = document.querySelector(".texts");

const LANGUAGE_MAP = {
  'हिन्दी': 'hi-IN',   //हिन्दी
  'ne-IP': 'ne-NP',   //नेपाली भाषा
  'ગુજરાતી' : 'gu-IN'   //ગુજરાતી
}
const Dictaphone = () => {
  const [language, setLanguage] = useState('ne-NP')
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
  const { transcript } = useSpeechRecognition({ commands })

  useEffect(() => {
    SpeechRecognition.startListening({
      continuous: true,
      language: 'ne-NP'
    })
  }, [])
  
  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return null
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <span>language: {language}</span>
      <span>{transcript}</span>
    </div>
  )
}

export default Dictaphone

// const Dictaphone = () => {
//   const {
//     transcript,
//     listening,
//     resetTranscript,
//     browserSupportsSpeechRecognition
//   } = useSpeechRecognition();

//   if (!browserSupportsSpeechRecognition) {
//     return <span>Browser doesn't support speech recognition.</span>;
//   }

//   return (
    
//     //<div>
//     //  <p>Microphone: {listening ? 'on' : 'off'}</p>
//     //  <button onClick={SpeechRecognition.startListening}>Start</button>
//     //  <button onClick={SpeechRecognition.stopListening}>Stop</button>
//     //  <button onClick={resetTranscript}>Reset</button>
//     //  <p>{transcript}</p>
//     //</div>

    
//           <div className="bg-neutral-900 text-white h-screen snap-y snap-mandatory overflow-scroll z-0 scrollbar-hide">
//             <Head>
//               <title></title>
//             </Head>
//             <Header />
//             {/* Hero */}
//             <section id="HindiReadWords" className="snap-start">
//               <HindiReadWords />
//             </section>
//             {/* Services */}
//             <section id="services" className="snap-center">
//               <Services />
//             </section>
//             {/* Footer */}
//             <section id="footer" className="snap-end">
//               <Footer />
//             </section>
//           </div>
        


//   );
// };
// export default Dictaphone;

//use this at the bottom to get the default view of the site

// export default function Home() {
//   return (
//     <div className="bg-neutral-900 text-white h-screen snap-y snap-mandatory overflow-scroll z-0 scrollbar-hide">
//       <Head>
//         <title>Fluent</title>
//       </Head>
//       <Header />
//       {/* Hero */}
//       <section id="HindiReadWords" className="snap-start">
//         <HindiReadWords />
//       </section>
//       {/* Services */}
//       <section id="services" className="snap-center">
//         <Services />
//       </section>
//       {/* Footer */}
//       <section id="footer" className="snap-end">
//         <Footer />
//       </section>
//     </div>
//   );
// }