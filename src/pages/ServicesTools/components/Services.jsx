import React, { useState, useEffect } from 'react';
import Redbackground from "../../../assets/images/Redbackground.png";
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { getServices, setAPILanguage } from '../../../services/api';
import { useTranslation } from 'react-i18next';

export default function Services() {
  const [servicesData, setServicesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);
        setAPILanguage(i18n.language);
        
        const response = await getServices();
        setServicesData(response.services);
      } catch (error) {
        console.error('Error in Services component:', error);
        setError(error.message || t('common.error', 'Failed to load content'));
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
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

  return (
    <section
      className={`min-h-screen bg-cover bg-center transition-all duration-1000 p-6 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
      style={{ backgroundImage: `url(${Redbackground})` }}
      ref={ref}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div>
        <h1 className="text-[#BB2632] text-5xl text-center pt-24 pb-16">
          {isRTL ? 'خدماتنا' : 'Our Services'}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-10">
        {servicesData.map(service => (
          <Link to={`/servicesdetils/${service.id}`} key={service.id} className="overflow-hidden shadow-lg rounded-lg transition-all duration-500 hover:scale-105 cursor-pointer group block">
            <div className="relative">
              <img src={service.image} alt={service.title} className="w-full h-60 object-cover transition-transform duration-500 group-hover:scale-110" />
            </div>
            <div className="p-6 text-center">
              <h3 className="text-lg font-semibold transition-all duration-500 group-hover:text-[#BB2632]">{service.title}</h3>
              <p className="text-sm text-[#333333] my-4">{service.excerpt}</p>
              <span className="text-[#BB2632] font-semibold relative inline-block">
                {isRTL ? 'استكشاف الخدمة' : 'Explore Service'}
                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#BB2632] transition-all duration-500 group-hover:w-full"></span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}