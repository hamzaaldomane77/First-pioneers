import React, { useState, useEffect } from 'react';
import Redbackground from "../../../assets/images/Redbackground.png";
import Testimonialsbg from "../../../assets/images/Testimonialsbg.png";
import Coma1 from "../../../assets/images/Coma1.png";
import Coma2 from "../../../assets/images/Coma2.png";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useInView } from "react-intersection-observer";
import { useTranslation } from 'react-i18next';
import { getTestimonials, setAPILanguage } from '../../../services/api';
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { MoveLeft, MoveRight } from "lucide-react";

const comaArabicStyle = {
  left: '4px',
  right: 'auto'
};

const comaArabicMdStyle = {
  left: '340px'
};

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        setError(null);
        setAPILanguage(i18n.language);
        
        const data = await getTestimonials();
        setTestimonials(data);
      } catch (error) {
        console.error('Error in Testimonials component:', error);
        setError(error.message || t('common.error', isRTL ? 'فشل تحميل المحتوى' : 'Failed to load content'));
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, [i18n.language, t]);

  if (loading) {
    return (
      <section
        className="min-h-screen bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${Redbackground})` }}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </section>
    );
  }

  if (error) {
    return (
      <section
        className="min-h-screen bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${Redbackground})` }}
      >
        <div className="bg-white bg-opacity-75 p-4 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return (
      <section
        className="min-h-screen bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${Redbackground})` }}
      >
        <div className="bg-white bg-opacity-75 p-4 rounded-lg">
          <p className="text-gray-600">{isRTL ? 'لا توجد شهادات متاحة' : 'No testimonials available'}</p>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`min-h-screen bg-cover bg-center transition-all duration-1000 p-6 h-[1000px] overflow-x-hidden ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
      style={{ backgroundImage: `url(${Redbackground})` }}
      ref={ref}
    >
      <h1 className="text-[#BB2632] text-5xl text-center pt-44 pb-11">
        {isRTL ? 'آراء العملاء' : 'Testimonials'}
      </h1>
      <div className="relative max-w-[1120px] mx-auto">
        <div dir="ltr">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={50}
            slidesPerView={1}
            navigation={{ nextEl: '.custom-next', prevEl: '.custom-prev' }}
            pagination={{ clickable: true, el: '.custom-pagination' }}
            autoplay={{ delay: 3000 }}
            className="py-20"
          >
            {testimonials.map((testimonial, index) => (
              <SwiperSlide key={index}>
                <div className="w-full md:w-[1120px] h-auto md:h-[425px] mx-auto rounded-xl shadow-lg grid grid-cols-1 md:grid-cols-2 overflow-y-hidden relative"
                  style={{ backgroundImage: `url(${Testimonialsbg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                  <img 
                    src={Coma1} 
                    alt="Coma 1" 
                    className={`absolute top-[140px] md:top-[140px] w-10 h-10 md:w-16 md:h-16 lg:left-[700px] right-9
                      ${isRTL ? 'left-[380px] md:left-[660px] ' : 'right-14 md:right-[640px] '}`}
                  />
                  <div className="p-5 md:p-10 md:pr-28 relative flex flex-col md:flex-row items-center md:items-start">
                    <img 
                      src={testimonial.avatar}
                      alt={testimonial.name} 
                      className="w-16 h-16 md:w-20 md:h-20 rounded-full mb-4 md:mb-0 md:mr-5 object-cover"
                    />
                    <div className="text-center md:text-left">
                      <h2 className="text-[#BB2632] text-2xl md:text-3xl font-bold">{testimonial.name}</h2>
                      <p className="text-gray-600 italic text-sm md:text-base">{testimonial.position}</p>
                      <p className="text-gray-500 text-xs md:text-sm">{testimonial.company_name}</p>
                      <p 
                        dir={isRTL ? "rtl" : "ltr"} 
                        className="text-lg md:text-2xl w-full md:w-[700px] pt-8 md:pt-16 pr-0 md:pr-32 text-center md:text-left"
                      >
                        {testimonial.content}
                      </p>
                    </div>
                  </div>
                  <img 
                    src={Coma2} 
                    alt="Coma 2" 
                    className="absolute top-[350px] md:top-[300px] left-4 md:left-5 w-8 h-8 md:w-14 md:h-14" 
                  />
                  <div className="pl-0 md:pl-64 flex justify-center items-center mt-8 md:mt-0">
                    <img 
                      src={testimonial.company_logo} 
                      alt={`${testimonial.company_name} Logo`} 
                      className="w-40 md:w-60 pb-10 pt-16 object-contain max-h-40" 
                    />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <button className="custom-prev absolute left-[-60px] top-[190px] transform -translate-y-1/2 rounded-full p-3 bg-[#ea3c4b] transition-transform duration-300 ease-in-out hover:scale-110 hidden md:block">
            <MoveLeft className="w-5 h-5 text-white" />
          </button>
          <button className="custom-next absolute right-[-60px] top-[190px] transform -translate-y-1/2 rounded-full p-3 bg-[#dd3d4a] transition-transform duration-300 ease-in-out hover:scale-110 hidden md:block">
            <MoveRight className="w-5 h-5 text-white" />
          </button>
          <div className="custom-pagination m-10 [&>.swiper-pagination-bullet]:bg-[#BB2632] [&>.swiper-pagination-bullet]:mx-5 [&>.swiper-pagination-bullet]:shadow-lg [&>.swiper-pagination-bullet]:shadow-[#BB2632]/100 transition-opacity duration-300 hover:opacity-75 text-center pr-24">
          </div>
        </div>
      </div>
    </section>
  );
}