import React from 'react';
import Whitebackground from "../../../assets/images/Whitebackground.png";
import { useInView } from 'react-intersection-observer';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import { motion } from 'framer-motion';

// اختيار ثلاث شعارات فقط
const logos = [
  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png",
  "https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Bootstrap_logo.svg/1280px-Bootstrap_logo.svg.png"
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
      <h1 className="text-[#BB2632] text-5xl text-center pt-20 pb-11">Our Partners</h1>
      <p className='text-center text-lg pb-12 max-w-3xl mx-auto' dir={isRTL ? "rtl" : "ltr"}>
        Get to know more about our partners
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
              disableOnInteraction: true,
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
            {logos.map((logo, index) => (
              <SwiperSlide key={index} className="flex justify-center items-center py-5">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="partner-logo-container flex justify-center items-center rounded-lg mx-auto"
                >
                  <img 
                    src={logo} 
                    alt={`Partner Logo ${index + 1}`} 
                    className="w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 object-contain" 
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