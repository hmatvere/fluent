import React from 'react'
import { Cursor, useTypewriter } from 'react-simple-typewriter';
import BackgroundCircles from './BackgroundCircles';
import Image from 'next/image';


type Props = {}

const Hero: React.FC = () => {
    const [text] = useTypewriter({
      words: [
        "Welcome To Fluent",
        "We will turn you into a Language Wizard",
        "...Scroll down to learn more",
      ],
      loop: 0,
      delaySpeed: 2001,
    });
  return (
    <div className='h-screen flex flex-col space-y-8 items-center justify-center text-center overflow-hidden'>
        <BackgroundCircles />
        <Image
            src='/fluent.png'
            alt='Fluent Logo'
            width={300}
            height={300}
        />
        <h1 className='text-5xl lg:text-3xl font-semibold px-10'>
            <span className='mr-3'>{text}</span>
            <Cursor cursorColor='#00E7F2' />
        </h1>
        <div>


        </div>
    </div>
  )
}

export default Hero;