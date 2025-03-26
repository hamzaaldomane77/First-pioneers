import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer';
import heroTools from "../../../assets/images/heroTools.png";

const HeroTools = ({ serviceData }) => {
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  useEffect(() => {
    // إذا تم تمرير بيانات الخدمة مباشرة، نستخدمها
    if (serviceData) {
      setData(serviceData);
      return;
    }

    // في حالة عدم وجود بيانات مباشرة، نحاول الحصول عليها من التخزين المحلي
    try {
      const storedData = localStorage.getItem('currentServiceDetails');
      if (storedData) {
        setData(JSON.parse(storedData));
      }
    } catch (error) {
      console.error('Error loading service data from localStorage:', error);
    }
  }, [serviceData]);

  const handleGoBack = () => {
    navigate('/ServicesTools');
  };

  // تحديد الخلفية بناءً على وجود صورة الخدمة
  const backgroundStyle = data?.image 
    ? { backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${data.image})` }
    : { backgroundImage: `url(${heroTools})` };

  return (
    <section
      className={`min-h-screen bg-cover bg-center bg-fixed transition-all duration-1000 relative ${inView ? 'opacity-100' : 'opacity-0'}`}
      style={backgroundStyle}
      ref={ref}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="w-full h-full flex flex-col relative pt-8 pb-20">
        <div className="container mx-auto px-4">
          <button
            onClick={handleGoBack}
            className="mb-12 mt-2 flex items-center text-white font-semibold hover:text-[#BB2632] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isRTL ? 'ml-2 rotate-180' : 'mr-2'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {isRTL ? 'العودة إلى جميع الخدمات' : 'Back to All Services'}
          </button>
          
          {data?.image && (
            <div className="mb-16 max-w-2xl mx-auto">
              <img
                src={data.image}
                alt={data.title}
                className="w-full h-auto rounded-xl shadow-2xl"
              />
            </div>
          )}

          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 px-4">
              {data?.title || (isRTL ? 'تفاصيل الخدمة' : 'Service Details')}
            </h1>
            
            <div className="mt-8 px-4">
              <p className="text-xl text-white mb-10">
                {data?.excerpt || ''}
              </p>
              
              <button className="bg-[#BB2632] hover:bg-[#a01f2a] transition-colors text-white py-4 px-10 text-xl rounded-lg shadow-lg">
                {isRTL ? 'الإجراء الرئيسي' : 'Main CTA'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroTools;