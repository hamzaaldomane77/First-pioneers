import React from 'react'
import Whitebackground from "../../../assets/images/Whitebackground.png"
import Agency from "../../../assets/images/Agency.png"
import { useTranslation } from 'react-i18next'
import { useInView } from 'react-intersection-observer'
import { Link } from 'react-router-dom';

export default function AboutusHome() {
  const { t } = useTranslation();
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
      <h1 className='text-[#BB2632] text-center pt-32 pb-12 text-5xl md:text-4xl sm:text-3xl'>
        {t('agency.title')}
      </h1>

      <div className="w-full flex flex-col-reverse md:flex-row items-center justify-center px-11">
        <div className={`w-full md:w-1/2 text-white px-11 transition-all duration-1000 text-center py-10 ${inView ? 'translate-x-0 opacity-100' : '-translate-x-40 opacity-0'}`}> 
          <h1 className="text-3xl leading-8 text-black bahnschrift text-center">
            {t('agency.description')}
          </h1>
        
       
         <div className='pt-10'>
         <Link to="https://directory.esomar.org/" className=''>
            <button className='bg-red-700 text-white border-2 border-white rounded-full px-8 py-3 text-lg'>
              {t('agency.findUs')}
            </button>
          </Link>
         </div>
        </div>
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center relative">
          <img
            src={Agency}
            alt={t('agency.title')}
            className={`w-[700px] sm:w-[350px] md:w-[500px] object-cover z-10 transition-all duration-1000 ${inView ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
          />
        </div>
      </div>
    </section>
  )
}
