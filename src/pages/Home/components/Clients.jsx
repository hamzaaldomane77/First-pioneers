import React, { useState, useEffect } from 'react';
import Redbackground from "../../../assets/images/Redbackground.png";
import { useInView } from 'react-intersection-observer';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { useTranslation } from 'react-i18next';
import { getClients, setAPILanguage } from '../../../services/api';
import 'swiper/css';

export default function Clients() {
  const [clientsData, setClientsData] = useState({
    description: '',
    images: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    const fetchClientsData = async () => {
      try {
        setLoading(true);
        setError(null);
        setAPILanguage(i18n.language);
        
        console.log('Fetching clients data (attempt', retryCount + 1, ')...');
        const data = await getClients();
        console.log('Received clients data:', data);
        
        setClientsData(data);
        setRetryCount(0);
      } catch (error) {
        console.error('Error in Clients component:', error);
        setError(error.message || t('common.error', 'Failed to load content'));
        
        if (retryCount < 3) {
          console.log('Retrying in 2 seconds...');
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, 2000);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchClientsData();
  }, [i18n.language, retryCount, t]);

  return (
    <section
      className={`min-h-screen bg-cover bg-center transition-all duration-1000 p-6 lg:pl-28 overflow-x-hidden lg:pb-40 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
      style={{ backgroundImage: `url(${Redbackground})` }}
      ref={ref}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <h1 className={`text-[#BB2632] text-3xl md:text-5xl text-center pt-20 md:pt-44 pb-6 md:pb-11 lg:pr-5 ${isRTL ? 'font-medium' : ''}`}>
        {isRTL ? 'عملاؤنا' : 'Our Clients'}
      </h1>
      
      {error ? (
        <div className="bg-red-500 bg-opacity-75 p-4 rounded-lg mx-auto max-w-2xl mb-8">
          <p className="text-white text-center">{error}</p>
          {retryCount >= 3 && (
            <p className="text-white mt-2 text-sm text-center">
              {t('common.maxRetries', 'Maximum retry attempts reached')}
            </p>
          )}
        </div>
      ) : (
        <div 
          className={`text-center text-lg mb-8 md:mb-14 text-[#010203] leading-6 md:leading-8 pb-12 lg:pr-8 bahnschrift${isRTL ? 'leading-relaxed' : ''} ${loading ? 'animate-pulse' : ''}`}
          dangerouslySetInnerHTML={{ 
            __html: loading ? t('loading', 'Loading...') : clientsData.description 
          }}
        />
      )}

      <div className="max-w-[95%] mx-auto">
        <Swiper
          slidesPerView={5}
          spaceBetween={20}
          breakpoints={{
            320: {
              slidesPerView: 5,
              spaceBetween: 10,
            },
            480: {
              slidesPerView: 5,
              spaceBetween: 15,
            },
            640: {
              slidesPerView: 4,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 5,
              spaceBetween: 25,
            },
            1024: {
              slidesPerView: 5,
              spaceBetween: 30,
            },
          }}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          modules={[Autoplay]}
          className="clients-swiper px-2 py-4"
          dir={isRTL ? "rtl" : "ltr"}
          rtl={isRTL}
        >
          {clientsData.images.map((image) => (
            <SwiperSlide key={image.id} className="flex justify-center items-center py-5">
              <div className="logo-container flex justify-center items-center p-2 mx-1">
                <img 
                  src={image.url} 
                  alt={t('clients.logo_alt', 'Client Logo')}
                  className="w-9 h-9 sm:w-12 sm:h-12 md:w-20 md:h-20 lg:w-32 lg:h-32 object-contain" 
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}