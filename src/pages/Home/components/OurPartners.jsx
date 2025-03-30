import React, { useState, useEffect } from 'react';
import Whitebackground from "../../../assets/images/Whitebackground.png";
import { useInView } from 'react-intersection-observer';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { getPartners, setAPILanguage } from '../../../services/api';

export default function OurPartners() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setLoading(true);
        setAPILanguage(i18n.language);
        const data = await getPartners();
        setPartners(data);
      } catch (error) {
        console.error('Error fetching partners:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, [i18n.language]);

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#BB2632]"></div>
      </section>
    );
  }

  if (!partners.length) {
    return null;
  }

  return (
    <section
      className={`min-h-screen bg-cover bg-center transition-all duration-1000 p-6 overflow-x-hidden ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
      style={{ backgroundImage: `url(${Whitebackground})` }}
      ref={ref}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <h1 className="text-[#BB2632] text-5xl text-center pt-20 pb-11">{t('partners.title', 'Our Partners')}</h1>
      <p className='text-center text-lg pb-12 max-w-3xl mx-auto'>
        {t('partners.description', 'Get to know more about our partners')}
      </p>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 0.5 }}
        className="max-w-4xl mx-auto px-4"
      >
        <div dir="ltr">
          <Swiper
            slidesPerView={3}
            spaceBetween={30}
            centeredSlides={false}
            loop={true}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            modules={[Autoplay]}
            className="partners-swiper"
            breakpoints={{
              320: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
              640: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 40,
              },
            }}
          >
            {partners.map((partner) => (
              <SwiperSlide key={partner.id} className="flex justify-center items-center py-5 ">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="logo-container flex justify-center items-center mx-auto rounded-lg p-4 "
                >
                  <img 
                    src={partner.image} 
                    alt={`Partner ${partner.id}`} 
                    className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 object-contain " 
                  />
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </motion.div>
    </section>
  );
}