import React from 'react';
import Redbackground from "../../../assets/images/Redbackground.png";
import { useInView } from "react-intersection-observer";
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Service1 from "../../../assets/images/service1.png";
import { useTranslation } from 'react-i18next';
// استيراد مكونات Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
// استيراد تنسيقات Swiper
import 'swiper/css';
import 'swiper/css/navigation';

const servicesData = [
    {
      id: 1,
      image: Service1,
      titleKey: "markets.services.feasibilityStudies.title",
      link: "#",
      descriptionKey: "markets.services.feasibilityStudies.description"
    },
  
    {
      id: 2,
      image: Service1,
      titleKey: "markets.services.marketAssessment.title",
      link: "#",
      descriptionKey: "markets.services.marketAssessment.description"
    },
    {
      id: 3,
      titleKey: "markets.services.customerSatisfaction.title",
      link: "#",
      descriptionKey: "markets.services.customerSatisfaction.description"
    }
];

export default function Markets() {
    const { ref, inView } = useInView({
        threshold: 0.3,
        triggerOnce: true,
    });
    
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';
    
    // تحديد أيقونة السهم المناسبة حسب اتجاه اللغة
    const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

    return (
        <section 
            className={`min-h-screen bg-cover bg-center transition-all duration-1000 p-6 overflow-hidden ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`} 
            style={{ backgroundImage: `url(${Redbackground})` }} 
            ref={ref}
            dir={isRTL ? 'rtl' : 'ltr'}
        >
            <h1 className={`text-[#BB2632] text-5xl text-center pt-32 pb-20 ${isRTL ? 'font-medium' : ''}`}>{t('markets.title')}</h1>
            
            <div className="px-4 md:px-10">
                <Swiper
                    modules={[Navigation, Autoplay]}
                    spaceBetween={30}
                    slidesPerView={1}
                    autoplay={{ delay: 3000, disableOnInteraction: false }}
                    navigation
                    dir={isRTL ? 'rtl' : 'ltr'}
                    rtl={isRTL}
                    className="markets-swiper"
                    breakpoints={{
                        640: {
                            slidesPerView: 2,
                        },
                        1024: {
                            slidesPerView: 3,
                        }
                    }}
                >
                    {servicesData.map(service => (
                        <SwiperSlide key={service.id}>
                            <Link to="/services-details" className="overflow-hidden shadow-lg rounded-lg transition-all duration-500 hover:scale-105 cursor-pointer group block h-full">
                                <div className="relative">
                                    {service.image && <img src={service.image} alt={t(service.titleKey)} className="w-full h-60 object-cover transition-transform duration-500 group-hover:scale-110" />}
                                </div>
                                <div className={`p-6 text-center ${isRTL ? 'text-right' : 'text-left'}`}>
                                    <h3 className={`text-lg font-semibold transition-all duration-500 group-hover:text-[#BB2632] ${isRTL ? 'mb-2' : ''}`}>{t(service.titleKey)}</h3>
                                    <p className={`text-sm text-[#333333] my-4 ${isRTL ? 'leading-relaxed' : ''}`}>{t(service.descriptionKey)}</p>
                                    <span className={`text-[#BB2632] font-semibold relative inline-block pb-4 ${isRTL ? 'pr-0 pl-6' : 'pl-0 pr-6'} pt-4 cursor-pointer`}>
                                        {t('markets.viewArticle')}
                                        <span className={`absolute ${isRTL ? 'right-0 left-auto' : 'left-0 right-auto'} bottom-4 w-0 h-[2px] bg-[#BB2632] transition-all duration-500 group-hover:w-full`}></span>
                                    </span>
                                </div>
                            </Link>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
            
            <div className={`text-[#BB2632] text-center mt-8 p-12`}>
                <Link to="/all-services" className="hover:text-[#BB2632] inline-flex justify-center items-center gap-2 transition-all duration-500 group">
                    {t('markets.viewAllMarkets')}
                    <ArrowIcon className={`w-5 h-5 text-[#BB2632] transition-all duration-500 ${isRTL ? 'mr-1' : 'ml-1'}`} />
                </Link>
            </div>
        </section>
    );
}
