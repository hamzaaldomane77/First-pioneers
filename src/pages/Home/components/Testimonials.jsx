import React from 'react';
import Redbackground from "../../../assets/images/Redbackground.png";
import Testimonialsbg from "../../../assets/images/Testimonialsbg.png";
import Coma1 from "../../../assets/images/Coma1.png";
import Coma2 from "../../../assets/images/Coma2.png";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useInView } from "react-intersection-observer";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { MoveLeft, MoveRight } from "lucide-react";
import { useTranslation } from "react-i18next";

const comaArabicStyle = {
  left: '4px',
  right: 'auto'
};


const comaArabicMdStyle = {
  left: '340px'
};

const testimonials = [
  {
    name: "George Ryner",
    profession: "Business man",
    text: "It was really great doing my house with you guys !!!!!! you really are PROFESSIONAL.",
    logo: "https://casamedia.com/wp-content/uploads/2023/04/adidas-1024x683.png",
    image: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    name: "Maria Johnson",
    profession: "CEO Company",
    text: "Excellent service and very professional team. Highly recommended for anyone looking for quality services!Excellent service and very professional team. Highly recommended for anyone looking for quality services!",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/1200px-Logo_NIKE.svg.png",
    image: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    name: "Maria Johnson",
    profession: "CEO Company",
    text: "Excellent service and very professional team. Highly recommended for anyone looking for quality services!Excellent service and very professional team. Highly recommended for anyone looking for quality services!",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/1200px-Logo_NIKE.svg.png",
    image: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    name: "Ahmed Ali",
    profession: "Project Manager",
    text: "A very satisfying experience! The team was cooperative and attentive to all our needs.",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/1200px-Logo_NIKE.svg.png",
    image: "https://randomuser.me/api/portraits/men/45.jpg"
  }
];

export default function Testimonials() {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  // استخدام useTranslation للتعرف على اتجاه اللغة
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <section
      className={`min-h-screen bg-cover bg-center transition-all duration-1000 p-6 h-[1000px] overflow-x-hidden ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
      style={{ backgroundImage: `url(${Redbackground})` }}
      ref={ref}
    >
      <h1 className="text-[#BB2632] text-5xl text-center pt-44 pb-11">Testimonials</h1>
      <div className="relative max-w-[1120px] mx-auto">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={50}
          slidesPerView={1}
          navigation={{ 
            nextEl: '.custom-next', 
            prevEl: '.custom-prev' 
          }}
          pagination={{ clickable: true, el: '.custom-pagination' }}
          autoplay={{ delay: 3000 }}
          rtl={isRTL}
          className="py-20 testimonials-swiper"
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index}>
              <div className="w-full md:w-[1120px] h-auto md:h-[425px] mx-auto rounded-xl shadow-lg grid grid-cols-1 md:grid-cols-2 overflow-y-hidden relative"
                style={{ backgroundImage: `url(${Testimonialsbg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <img 
                  src={Coma1} 
                  alt="Coma 1" 
                  className={`absolute top-[140px] md:top-[140px] w-10 h-10 md:w-16 md:h-16 
                    ${isRTL 
                      ? 'right-9 md:right-4 lg:right-[680px]' 
                      : 'right-9 md:right-4 lg:left-[700px]'}`}
                />
                <div className={`p-5 md:p-10 md:pr-28 relative flex flex-col md:flex-row items-center md:items-start`}>
                  <img src={testimonial.image} alt={testimonial.name} className="w-16 h-16 md:w-20 md:h-20 rounded-full mb-4 md:mb-0 md:mr-5" />
                  <div className="text-center md:text-left">
                    <h2 className="text-[#BB2632] text-2xl md:text-3xl font-bold">{testimonial.name}</h2>
                    <p className="text-gray-600 italic text-sm md:text-base">{testimonial.profession}</p>
                    <p className="text-lg md:text-2xl w-full md:w-[700px] pt-8 md:pt-16 md:pr-32 text-center md:text-left">
                      {testimonial.text}
                    </p>
                  </div>
                </div>
                <img 
                  src={Coma2} 
                  alt="Coma 2" 
                  className={`absolute top-[350px] md:top-[300px] w-8 h-8 md:w-14 md:h-14 
                    ${isRTL ? 'right-4 md:right-5' : 'left-4 md:left-5'}`} 
                />
                <div className="pl-0 md:pl-64 flex justify-center items-center mt-8 md:mt-0">
                  <img src={testimonial.logo} alt="Company Logo" className="w-40 md:w-60 pb-10 pt-16" />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <button className={`custom-prev absolute ${isRTL ? 'right-[-60px]' : 'left-[-60px]'} top-[190px] transform -translate-y-1/2 rounded-full p-3 bg-[#ea3c4b] transition-transform duration-300 ease-in-out hover:scale-110 hidden md:block`}>
          {isRTL ? <MoveRight className="w-5 h-5 text-white" /> : <MoveLeft className="w-5 h-5 text-white" />}
        </button>
        <button className={`custom-next absolute ${isRTL ? 'left-[-60px]' : 'right-[-60px]'} top-[190px] transform -translate-y-1/2 rounded-full p-3 bg-[#dd3d4a] transition-transform duration-300 ease-in-out hover:scale-110 hidden md:block`}>
          {isRTL ? <MoveLeft className="w-5 h-5 text-white" /> : <MoveRight className="w-5 h-5 text-white" />}
        </button>
        <div className="custom-pagination m-10 [&>.swiper-pagination-bullet]:bg-[#BB2632] [&>.swiper-pagination-bullet]:mx-5 [&>.swiper-pagination-bullet]:shadow-lg [&>.swiper-pagination-bullet]:shadow-[#BB2632]/100 transition-opacity duration-300 hover:opacity-75 text-center">
        </div>
      </div>
    </section>
  );
}