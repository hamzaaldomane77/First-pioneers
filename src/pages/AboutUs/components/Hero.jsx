import React from 'react'
import Redbackground from "../../../assets/images/Redbackground.png"
import Aboutushumans from "../../../assets/images/aboutushumans.png"
import Aboutusframes from "../../../assets/images/aboutusframes.png"
import { useInView } from 'react-intersection-observer'

export default function Hero() {

  const { ref, inView } = useInView({
    threshold: 0.1, 
    triggerOnce: true, 
  });

  return (
    <section
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${Redbackground})` }}
      ref={ref} 
    >
      {/* العنوان */}
      <h1 className='text-[#BB2632] text-center pt-20 pb-12 text-5xl md:text-4xl sm:text-3xl'></h1>

      <div className="w-full flex flex-col-reverse md:flex-row items-center justify-center px-11">
        {/* الصور */}
       

        {/* النص */}
        <div className={`w-full md:w-1/2 text-white px-11 transition-all duration-1000 ${inView ? 'translate-x-0 opacity-100' : '-translate-x-40 opacity-0'}`}> 
        <h1 className='text-[#BB2632] text-[50px] py-6'>About Us</h1>
          <p className="text-lg leading-8 text-black sm:text-sm md:text-base">
            In today’s fast-paced and fiercely competitive world, keeping your brand visible and impactful is no easy feat.
            Data and information have become the lifeblood of modern business & the fuel that drives success. But without the right expertise, even the most valuable insights can go to waste.
            That’s where we come in…!
            As a leading marketing research and studies agency in Syria and the Middle East, we don’t just deliver data; we deliver results.
            Our team specializes in crafting custom, research-driven strategies that resonate with your audience, creating powerful messaging tools that captivate, and executing studies with precision to ensure your brand doesn’t just compete, it dominates.
            We are more than just a service provider; we are your trusted partner in growth. Together, we'll transform obstacles into chances and concepts into reality. Let’s grow. Let’s thrive. Let’s make your brand.
          </p>
        
       
        
        </div>
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center relative">
          {/* صورة humans */}
          <img
            src={Aboutushumans}
            alt="About Us"
            className={`w-[700px] sm:w-[350px] md:w-[500px] object-cover z-10 transition-all duration-1000 ${inView ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
          />

          {/* صورة frames */}
          <img
            src={Aboutusframes}
            alt="Frames"
            className={`absolute w-[750px] sm:w-[400px] md:w-[550px] z-20 transition-all duration-1000 delay-500 ${inView ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
          />
        </div>
      </div>
    </section>
  )
}
