import React, { useState, useEffect } from 'react';
import Redbackground from "../../../assets/images/Redbackground.png";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useInView } from "react-intersection-observer";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { MoveLeft, MoveRight } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { getTrendsInMarkets, setAPILanguage } from '../../../services/api';

export default function Testimonials() {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const [trendsInMarkets, setTrendsInMarkets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    const fetchTrendsInMarkets = async () => {
      try {
        setLoading(true);
        setError(null);
        setAPILanguage(i18n.language);
        const data = await getTrendsInMarkets();
        setTrendsInMarkets(data);
      } catch (err) {
        console.error('Error fetching trends in markets:', err);
        setError(err.message || (isRTL ? 'فشل تحميل المحتوى' : 'Failed to load content'));
      } finally {
        setLoading(false);
      }
    };

    fetchTrendsInMarkets();
  }, [i18n.language, isRTL]);

  if (loading) {
    return (
      <section
        className="min-h-screen bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${Redbackground})` }}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#BB2632]"></div>
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

  if (trendsInMarkets.length === 0) {
    return (
      <section
        className="min-h-screen bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${Redbackground})` }}
      >
        <div className="bg-white bg-opacity-75 p-4 rounded-lg">
          <p className="text-gray-600">{isRTL ? 'لا توجد اتجاهات متاحة' : 'No Trends In Markets available'}</p>
        </div>
      </section>
    );
  }

  return (
      <section
        className={`min-h-screen bg-cover bg-center transition-all duration-1000 p-6 h-[1000px] overflow-hidden ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
        style={{ backgroundImage: `url(${Redbackground})` }}
        ref={ref}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <h1 className={`text-[#BB2632] text-5xl text-center pt-32 pb-11 ${isRTL ? 'font-medium' : ''}`}>
          {isRTL ? 'الإتجاهات في الأسواق'  : 'Trends In Markets'}
        </h1>
      <div className="relative max-w-[1120px] mx-auto">
        <Swiper
          spaceBetween={20}
          slidesPerView={1} // يعرض شريحة واحدة افتراضيًا
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 1 },
            1024: { slidesPerView: 2 } 
          }}
          navigation={{
            prevEl: '.custom-prev',
            nextEl: '.custom-next',
          }}
          pagination={{
            el: '.custom-pagination',
            clickable: true,
          }}
          autoplay={{
            delay: 3000, // الانتقال التلقائي كل 3 ثوانٍ
            disableOnInteraction: false, // لا يتوقف عند التفاعل مع السويبر
          }}
          modules={[Navigation, Pagination, Autoplay]}
          className="flex justify-center"
        >
          {trendsInMarkets.map((item, index) => (
            <SwiperSlide key={index} className="flex justify-center w-[500px] py-10">
              <div className="w-full max-w-[550px] p-5 flex flex-col items-center text-center">
                {item.image && (
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-[605px] h-[350px] mb-4 rounded-xl object-cover" 
                  />
                )}
                <h2 className="text-[#BB2632] text-xl font-bold">{item.title}</h2>
                <p className="text-gray-800 text-base mt-4">{item.description}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <button className="custom-prev absolute left-[-60px] top-[250px] transform -translate-y-1/2 rounded-full p-3 bg-[#ea3c4b] transition-transform duration-300 ease-in-out hover:scale-110 hidden md:block">
          <MoveLeft className="w-5 h-5 text-white" />
        </button>
        <button className="custom-next absolute right-[-60px] top-[250px] transform -translate-y-1/2 rounded-full p-3 bg-[#dd3d4a] transition-transform duration-300 ease-in-out hover:scale-110 hidden md:block">
          <MoveRight className="w-5 h-5 text-white" />
        </button>
        <div className="custom-pagination m-10 [&>.swiper-pagination-bullet]:bg-[#BB2632] [&>.swiper-pagination-bullet]:mx-5 [&>.swiper-pagination-bullet]:shadow-lg [&>.swiper-pagination-bullet]:shadow-[#BB2632]/100 transition-opacity duration-300 hover:opacity-75 text-center pr-24 pb-9"></div>
      </div>
    </section>
  );
}