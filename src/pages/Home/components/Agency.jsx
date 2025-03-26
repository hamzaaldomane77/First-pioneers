import React from 'react'
import Whitebackground from "../../../assets/images/Whitebackground.png"
import Agency from "../../../assets/images/Agency.png"

import { useInView } from 'react-intersection-observer'
import { Link } from 'react-router-dom';

export default function AboutusHome() {

  const { ref, inView } = useInView({
    threshold: 0.3, 
    triggerOnce: true, 
  });

  return (
    <section
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${Whitebackground})` }}
      ref={ref}
    >

      <h1 className='text-[#BB2632] text-center pt-32 pb-12 text-5xl md:text-4xl sm:text-3xl'>Proud To Be An Authorized Agency</h1>

      <div className="w-full flex flex-col-reverse md:flex-row items-center justify-center px-11">
       
       

        <div className={`w-full md:w-1/2 text-white px-11 transition-all duration-1000  py-10 ${inView ? 'translate-x-0 opacity-100' : '-translate-x-40 opacity-0'}`}> 
          <p className="text-2xl leading-8 text-black">
          First Pioneers Marketing Research with its Arabic official name
(AL-MOBTAKIRON AL-AWAEL CO. LTD)
is the only member from Syrian Arab Republic register in ESOMAR World Research
          </p>
        
          <p className='text-xl font-bold cursor-pointer text-[#BB2632] pt-6 sm:text-base md:text-lg py-5'>
          Learn more about our team and expertise
          </p>
        <Link to="https://directory.esomar.org/"><button className='bg-red-700 text-white border-2 border-white rounded-full px-8 py-3 text-lg'>Find Us In ESOMAR Directory</button></Link>
        </div>
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center relative">
          
          <img
            src={Agency}
            alt="About Us"
            className={`w-[700px] sm:w-[350px] md:w-[500px] object-cover z-10 transition-all duration-1000 ${inView ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
          />
        </div>
      </div>
    </section>
  )
}
