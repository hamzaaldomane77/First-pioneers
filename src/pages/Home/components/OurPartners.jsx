import React from 'react';
import Whitebackground from "../../../assets/images/Whitebackground.png";
import { useInView } from 'react-intersection-observer';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import '../../../styles/clients.css';
import { motion } from 'framer-motion';

// تحديث قائمة الشعارات لتكون 5 شعارات فريدة
const logos = [
  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png",
  "https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Bootstrap_logo.svg/1280px-Bootstrap_logo.svg.png",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/1869px-Python-logo-notext.svg.png",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/PHP-logo.svg/2560px-PHP-logo.svg.png"
];

export default function OurPartners() {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  // تحديد ما إذا كانت اللغة هي العربية
  const isRTL = document.documentElement.dir === 'rtl';

  return (
    <section
      className={`min-h-screen bg-cover bg-center transition-all duration-1000 p-6 overflow-x-hidden ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
      style={{ backgroundImage: `url(${Whitebackground})` }}
      ref={ref}
    >
      <h1 className="text-[#BB2632] text-3xl md:text-5xl text-center pt-20 md:pt-28 pb-6 md:pb-11">Our Partners</h1>
      <p className='text-center text-sm mb-8 md:mb-14 text-[#010203] leading-6 md:leading-8 pb-8 md:pb-12' dir={isRTL ? "rtl" : "ltr"}>
        Get to know more about our partners
      </p>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 0.5 }}
        className="max-w-[95%] mx-auto"
      >
        {/* استبعاد Swiper من تنسيق RTL للحفاظ على نفس التخطيط */}
        <div dir="ltr">
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
                    alt={`Partner Logo ${index + 1}`} 
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