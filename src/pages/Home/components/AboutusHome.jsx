import React, { useState, useEffect } from 'react'
import Whitebackground from "../../../assets/images/Whitebackground.png"
import Aboutushumans from "../../../assets/images/aboutushumans.png"
import Aboutusframes from "../../../assets/images/aboutusframes.png"
import { useInView } from 'react-intersection-observer'
import { useTranslation } from 'react-i18next'
import { getAboutHeroData, setAPILanguage } from '../../../services/api'
import { Link } from 'react-router-dom'

export default function AboutusHome() {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        setLoading(true);
        setError(null);
        setAPILanguage(i18n.language);
        
        const data = await getAboutHeroData();
        setDescription(data);
      } catch (error) {
        setError(error.message || t('common.error', 'Failed to load content'));
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, [i18n.language, t]);

  return (
    <section
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${Whitebackground})` }}
      ref={ref}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
     
      <h1 className={`text-[#BB2632] text-center pt-32 pb-12 text-5xl md:text-4xl sm:text-3xl`}>
        {isRTL ? 'من نحن' : 'Who We Are'}
      </h1>

      <div className="w-full flex flex-col-reverse md:flex-row items-center justify-center px-0">
       
        <div className={`w-full md:w-1/2 px-11 transition-all duration-1000 ${inView ? 'translate-x-0 opacity-100' : '-translate-x-40 opacity-0'} ${loading ? 'animate-pulse' : ''}`}> 
          {error ? (
            <div className="bg-red-500 bg-opacity-75 p-4 rounded-lg mb-4">
              <p className="text-white">{error}</p>
            </div>
          ) : (
            <div 
              className={`text-lg leading-8 text-black sm:text-sm md:text-base whitespace-pre-line bahnschrift pt-10  `}
              dangerouslySetInnerHTML={{ 
                __html: loading ? t('loading', 'Loading...') : description 
              }}
            />
          )}
          
          <Link to='/AboutUs' className={`text-xl font-bold cursor-pointer text-[#BB2632] pt-6 sm:text-base md:text-lg text-end pt-6${isRTL ? 'text-right' : 'text-left'}`}>
            {isRTL ? 'تعرف على المزيد عن فريقنا وخبراتنا' : 'Learn more about our team and expertise'}
          </Link>
        </div>

        <div className="w-full md:w-1/2 flex flex-col items-center justify-center relative">
          
          <img
            src={Aboutushumans}
            alt={isRTL ? "من نحن" : "About Us"}
            className={`w-[700px] sm:w-[350px] md:w-[500px] object-cover z-10 transition-all duration-1000 ${inView ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
          />

        
          <img
            src={Aboutusframes}
            alt={isRTL ? "إطارات" : "Frames"}
            className={`absolute w-[750px] sm:w-[400px] md:w-[550px] z-20 transition-all duration-1000 delay-500 ${inView ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
          />
        </div>
      </div>
    </section>
  )
}
