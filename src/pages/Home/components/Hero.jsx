import React from 'react';
import { motion } from 'framer-motion';
import hero from '../../../assets/images/hero.png';

export default function Hero() {
  return (
    <section
      className="h-screen w-full flex flex-col items-center justify-center text-center text-white bg-cover bg-center px-4 md:px-16 space-y-6"
      style={{ backgroundImage: `url(${hero})` }}
    >
      <motion.p 
        initial={{ opacity: 0, x: -200 }} 
        animate={{ opacity: 1, x: 0 }} 
        transition={{ duration: 1 }} 
        className="text-[58px] md:text-5xl pb-6"
      >
        Data Driven Insights for Smarter Decisions
      </motion.p>
      <motion.p 
        initial={{ opacity: 0, x: -200 }} 
        animate={{ opacity: 1, x: 0 }} 
        transition={{ duration: 1.2, delay: 0.3 }} 
        className="text-xl md:text-xl max-w-[900px] md:leading-[40px]"
      >
        Strikethrough asset auto invite thumbnail connection bullet connection draft. Style text figjam subtract link share line component link main.
      </motion.p>
      <motion.button 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 1.5, delay: 0.6 }} 
        className="bg-red-600 text-white px-6 py-3 rounded-full hover:bg-red-700 transition "
      >
        Contact Us
      </motion.button>
    </section>
  );
}
