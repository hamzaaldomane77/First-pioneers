import React from 'react';
import Redbackground from "../../../assets/images/Redbackground.png";
import { useInView } from 'react-intersection-observer';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import '../../../styles/clients.css';

import { motion } from 'framer-motion';

// تقليل عدد الشعارات إلى خمسة فقط
const logos = [
  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Sass_Logo_Color.svg/1280px-Sass_Logo_Color.svg.png",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Tailwind_CSS_Logo.svg/1024px-Tailwind_CSS_Logo.svg.png",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Unofficial_JavaScript_logo_2.svg/1024px-Unofficial_JavaScript_logo_2.svg.png",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/HTML5_logo_and_wordmark.svg/1024px-HTML5_logo_and_wordmark.svg.png"
];

export default function Clients() {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  // تحديد ما إذا كانت اللغة هي العربية باستخدام i18n
  const isRTL = document.documentElement.dir === 'rtl';

  return (
    <section
      className={`min-h-screen bg-cover bg-center transition-all duration-1000 p-6 lg:pl-28 overflow-x-hidden lg:pb-40 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
      style={{ backgroundImage: `url(${Redbackground})` }}
      ref={ref}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <h1 className={`text-[#BB2632] text-3xl md:text-5xl text-center pt-20 md:pt-44 pb-6 md:pb-11 lg:pr-5 ${isRTL ? 'font-medium' : ''}`}>Our Clients</h1>
      <p className={`text-center text-sm mb-8 md:mb-14 text-[#010203] leading-6 md:leading-8 pb-12 lg:pr-8 ${isRTL ? 'leading-relaxed' : ''}`}>
        Here are some of our clients, which we were proud to be able to help them achieve huge progress.
      </p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 0.5 }}
        className="max-w-[95%] mx-auto" 
      >
        {/* الآن نستخدم اتجاه RTL المناسب للغة العربية */}
        <div dir={isRTL ? "rtl" : "ltr"}>
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
                slidesPerView: 5,
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
            {logos.map((logo, index) => (
              <SwiperSlide key={index} className="flex justify-center items-center py-5">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="logo-container flex justify-center items-center p-2 mx-1"
                >
                  <img 
                    src={logo} 
                    alt={`Client Logo ${index + 1}`} 
                    className="w-8 h-8 sm:w-12 sm:h-12 md:w-20 md:h-20 lg:w-24 lg:h-24 object-contain" 
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