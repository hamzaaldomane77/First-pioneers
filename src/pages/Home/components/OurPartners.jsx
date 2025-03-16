import React from 'react';
import Whitebackground from "../../../assets/images/Whitebackground.png";
import { useInView } from 'react-intersection-observer';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import { motion } from 'framer-motion';

const logos = [
  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png",
    "https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg",
    "https://img.freepik.com/free-vector/bird-colorful-logo-gradient-vector_343694-1365.jpg"
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
      <p className='text-center text-sm pb-10' dir={isRTL ? "rtl" : "ltr"}>Get to know more about our partners</p>
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <div dir="ltr">
          <Swiper
            slidesPerView={3}
            spaceBetween={20}
            centeredSlides={false}
            breakpoints={{
              640: {
                slidesPerView: 3,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            modules={[Autoplay]}
            className="mySwiper"
          >
            {logos.map((logo, index) => (
              <SwiperSlide key={index} className="flex justify-center items-center py-5 lg:m-0 pr-1">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-28 h-28 md:w-40 md:h-40 lg:w-80 lg:h-[200px] flex justify-center items-center lg:pl-36 ${
                    index === 1 ? 'transform scale-110 z-10' : 'transform scale-90 z-0'
                  }`}
                >
                  <img src={logo} alt={`Client Logo ${index + 1}`} className="w-full h-full object-contain" />
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </motion.div>
    </section>
  );
}