import React from 'react';
import { motion } from 'framer-motion';

type Props = {}

function BackgroundCircles({}: Props) {
  return (
    <motion.div
    initial={{
        opacity: 0,
    }}
    animate={{
        scale: [1, 2, 2, 3, 1],
        opacity: [0.1, 0.2, 0.4, 0.8, 0.1, 1.0],
    }}
    transition={{
        duration: 2.5,
    }}
    className='relative justify-center items-center flex'>
        {/* <div className='absolute border border-[#333333] rounded-full h-[200px] w-[200px] mt-52 animate-pulse'/> */}
        <div className='border border-[#00e6f210] rounded-full h-[300px] w-[300px] mt-52 absolute animate-ping'/> 
        <div className='border border-[#00e6f233] rounded-full h-[400px] w-[400px] mt-52 animate-ping absolute'/>
        <div className='border border-[#00e6f233] rounded-full h-[550px] w-[550px] mt-52 animate-pulse absolute'/>
        <div className='rounded-full border border-[#00E7F2] opacity-20 h-[900px] w-[900px] absolute mt-52 animate-pulse'/>
    </motion.div>
  )
}

export default BackgroundCircles;