import React from 'react';
import Redbackground from "../../../assets/images/Redbackground.png";
import Came1 from "../../../assets/images/Came1.png";
import Came2 from "../../../assets/images/Came2.png";
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';

export default function WillGet() {
    const { ref, inView } = useInView({
        threshold: 0.3,
        triggerOnce: true,
    });

    return (
        <section
            className={`min-h-[500px] bg-cover bg-center flex flex-col items-center justify-between px-10 lg:px-36 transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
            style={{ backgroundImage: `url(${Redbackground})` }}
            ref={ref}
        >
            {/* النص - أعلى */}
           <div className='flex flex-col'>
           <div className="text-center order-1">
                <h1 className="text-3xl md:text-[30px] mb-5 pt-11 text-[#BB2632]">
                How You Will Get It With Us?
                </h1>
                <p className="text-sm mb-8 text-[#010203]">
                Strikethrough asset auto invite thumbnail connection bullet connection draft. Style text figjam subtract link share line component link main. Strikethrough asset auto invite thumbnail connection bullet connection draft. Style text figjam subtract link share line component link main.
                Strikethrough asset auto invite thumbnail connection bullet connection draft. Style text figjam subtract link share line component link main.
                </p>
                <button className="bg-[#BB2632] text-white py-3 px-6 rounded-full hover:scale-110 transition">
                    Contact Us
                </button>
            </div>

            {/* الصور - أسفل */}
            <div className="flex flex-row items-center justify-center gap-5 order-2 mt-10 lg:flex-wrap md:mx-16">
                <motion.img
                    src={Came1}
                    alt="Woman Contact Us "
                    className="w-[150px] md:w-[300px] object-contain md:mx-20"
                    initial={{ opacity: 0, x: -100 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 1 }}
                />
                <motion.img
                    src={Came2}
                    alt="Man Contact Us"
                    className="w-[150px] md:w-[300px] object-contain md:mx-20"
                    initial={{ opacity: 0, x: 100 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 1 }}
                />
            </div>
           </div>
        </section>
    );
}