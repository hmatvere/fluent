import React from 'react'
import { Cursor, useTypewriter } from 'react-simple-typewriter';
import BackgroundCircles from './BackgroundCircles';


type Props = {}

function Hero({}: Props) {
    const [text] = useTypewriter ({
        words: [
            "Welcome To Fluent",
            "We Will Turn You Into A Bilingual",
            "...Scroll Down To Learn More",
        ],
        loop: 0,
        delaySpeed: 2000,
      });

  return (
    <div className='h-screen flex flex-col space-y-8 items-center justify-center'>
        <BackgroundCircles />
        <h1>
            <span>{text}</span>
            <Cursor cursorColor='#00E7F2' />
        </h1>
    </div>
  )
}

export default Hero;