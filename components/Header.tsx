import React from 'react'
import { SocialIcon } from 'react-social-icons';
import { motion } from 'framer-motion';


type Props = {}

const Header: React.FC = () => {
  return (
    <header className='top-0 p-5 items-start sticky flex justify-between max-w-7xl mx-auto z-20 xl:items-center'>
        <motion.div 
        initial={{
            opacity: 0,
            x: -500,
            scale: 0.5
        }}
        animate={{
          opacity: 1, 
          x: 0, 
          scale: 1
        }}
        transition={{duration: 1.5}}
         className='flex flex-row items-center'>{/* Socials */}
        <SocialIcon url="https://twitter.com/FluentApp" fgColor='gray' bgColor='transparent'/>
        <SocialIcon url="https://www.instagram.com/fluentapp/" fgColor='gray' bgColor='transparent'/>
        <SocialIcon url="https://www.youtube.com/channel/UCZQZ1Z1Z1Z1Z1Z1Z1Z1Z1Z1" fgColor='gray' bgColor='transparent'/>
        <SocialIcon url="https://www.facebook.com/FluentApp" fgColor='gray' bgColor='transparent'/>
        </motion.div>

    <motion.div
      initial={{
        opacity: 0,
        x: 500,
        scale: 0.5
    }}
      animate={{
        opacity: 1,
        x: 0,
        scale: 1
    }}
      transition={{duration: 1.5}}
    className='flex flex-row items-center text-gray-300 cursor-pointer'>
        <SocialIcon className='cursor-pointer' network='email' fgColor='gray' bgColor='transparent'/>
        <p className="uppercase hidden md:inline-flex text-sm text-gray-400">Contact Us</p>
    </motion.div>



    </header>
  );
};

export default Header;