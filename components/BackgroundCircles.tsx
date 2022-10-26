import React from 'react';
import { motion } from 'framer-motion';

type Props = {}

function BackgroundCircles({}: Props) {
  return (
    <div className='relative justify-center items-center flex'>
        <div className='absolute border border-[#00E7F2] rounded-full h-[200px] w-[200px] mt-52 animate-ping'/>
        <div className='border border-[#00E7F2] rounded-full h-[300px] w-[300px] mt-52 animate-ping absolute'/>
        <div className='border border-[#00E7F2] rounded-full h-[500px] w-[500px] mt-52 animate-ping absolute'/>
        <div className='rounded-full border border-[#00E7F2] opacity-20 h-[650px] w-[650px] absolute mt-52 animate-pulse'/>
        <div className='border border-[#00E7F2] rounded-full h-[200px] w-[200px] mt-52 animate-ping absolute'/>
    </div>
  )
}

export default BackgroundCircles;