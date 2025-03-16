import React from 'react';
import Redbackground from "../../../assets/images/Redbackground.png";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useInView } from "react-intersection-observer";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { MoveLeft, MoveRight } from "lucide-react";

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

  return (
      <section
        className={`min-h-screen bg-cover bg-center transition-all duration-1000 p-6 h-[1000px] overflow-hidden ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
        style={{ backgroundImage: `url(${Redbackground})` }}
        ref={ref}
      >
        <h1 className="text-[#BB2632] text-5xl text-center pt-32 pb-11">Trends In Markets</h1>
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
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index} className="flex justify-center w-[500px] py-10">
              <div className="w-full max-w-[550px] p-5 flex flex-col items-center text-center">
                <img src={testimonial.image} alt={testimonial.name} className="w-[605px] h-[350px] mb-4 rounded-xl" />
                <h2 className="text-[#BB2632] text-xl font-bold">{testimonial.name}</h2>
                <p className="text-gray-600 italic text-sm">{testimonial.profession}</p>
                <p className="text-gray-800 text-base mt-4">{testimonial.text}</p>
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