import React, { useState, useEffect } from 'react';
import Redbackground from "../../../assets/images/Redbackground.png";
import Aboutushumans from "../../../assets/images/aboutushumans.png";
import Aboutusframes from "../../../assets/images/aboutusframes.png";
import { useInView } from 'react-intersection-observer';
import { useTranslation } from 'react-i18next';
import { getAboutHeroData, setAPILanguage } from '../../../services/api';

export default function Hero() {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const { ref, inView } = useInView({
    threshold: 0.1,
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
        setRetryCount(0);
      } catch (error) {
        setError(error.message || t('common.error', 'Failed to load content'));
        
        if (retryCount < 3) {
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, 2000);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, [i18n.language, retryCount, t]);

  return (
    <section 
      className="min-h-screen bg-cover bg-center "
      style={{ backgroundImage: `url(${Redbackground})` }}
      ref={ref}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="w-full flex flex-col-reverse md:flex-row items-center justify-center px-11 py-32">
        <div 
          className={`w-full md:w-1/2 px-11 transition-all duration-1000 
            ${inView ? 'translate-x-0 opacity-100' : '-translate-x-40 opacity-0'}
            ${loading ? 'animate-pulse' : ''}`}
        >
          <h1 className={`text-[#BB2632] text-[50px] py-6 `}>
            {isRTL ? 'من نحن' : 'About Us'}
          </h1>
          
          {error ? (
            <div className="bg-red-500 bg-opacity-75 rounded-lg mb-4">
              <p className="text-white">{error}</p>
              {retryCount >= 3 && (
                <p className="text-white mt-2 text-sm">
                  {t('common.maxRetries', 'Maximum retry attempts reached')}
                </p>
              )}
            </div>
          ) : (
            <div 
              className={`text-lg leading-8 text-black sm:text-sm md:text-base whitespace-pre-line about-us`}
              dangerouslySetInnerHTML={{ 
                __html: loading ? t('loading', 'Loading...') : description 
              }}
            />
          )}
        </div>

        <div className="w-full md:w-1/2 flex flex-col items-center justify-center relative">
          {/* صورة humans */}
          <img
            src={Aboutushumans}
            alt={t('about.humans_alt', 'About Us Illustration')}
            className={`w-[700px] sm:w-[350px] md:w-[500px] object-cover z-10 transition-all duration-1000 
              ${inView ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
          />

          {/* صورة frames */}
          <img
            src={Aboutusframes}
            alt={t('about.frames_alt', 'Decorative Frames')}
            className={`absolute w-[750px] sm:w-[400px] md:w-[550px] z-20 transition-all duration-1000 delay-500 
              ${inView ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
          />
        </div>
      </div>
    </section>
  );
}
