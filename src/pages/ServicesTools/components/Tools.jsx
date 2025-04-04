import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getToolsWeUse, setAPILanguage } from '../../../services/api';


export default function Tools() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    const fetchTools = async () => {
      try {
        setLoading(true);
        setError(null);
        setAPILanguage(i18n.language);
        
        const data = await getToolsWeUse();
        setTools(data);
      } catch (error) {
        console.error('Error in Tools component:', error);
        setError(error.message || (isRTL ? 'فشل تحميل الأدوات' : 'Failed to load tools'));
      } finally {
        setLoading(false);
      }
    };

    fetchTools();
  }, [i18n.language, isRTL]);

  if (loading) {
    return (
      <section
        ref={ref}
        className={`min-h-screen transition-all duration-1000 p-6 py-20 overflow-clip  ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
      >
        <h1 className="text-[#BB2632] text-3xl sm:text-4xl md:text-5xl text-center pt-12 sm:pt-24 pb-8 sm:pb-16">
          {isRTL ? 'أدواتنا' : 'Our Tools'}
        </h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#BB2632]"></div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section
        ref={ref}
        className={`min-h-screen transition-all duration-1000 p-6 py-20 overflow-clip ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
      >
        <h1 className="text-[#BB2632] text-3xl sm:text-4xl md:text-5xl text-center pt-12 sm:pt-24 pb-8 sm:pb-16">
          {isRTL ? 'أدواتنا' : 'Our Tools'}
        </h1>
        <div className="flex justify-center items-center">
          <p className="text-red-600">{error}</p>
        </div>
      </section>
    );
  }

  if (tools.length === 0) {
    return (
      <section
        ref={ref}
        className={`min-h-screen transition-all duration-1000 p-6 py-20 overflow-clip ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
      >
        <h1 className="text-[#BB2632] text-3xl sm:text-4xl md:text-5xl text-center pt-12 sm:pt-24 pb-8 sm:pb-16">
          {isRTL ? 'أدواتنا' : 'Our Tools'}
        </h1>
        <div className="flex justify-center items-center">
          <p className="text-gray-600">
            {isRTL ? 'لا توجد أدوات متاحة' : 'No tools available'}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      dir={isRTL ? 'rtl' : 'ltr'}
      ref={ref}
      className={`min-h-screen transition-all duration-1000 p-6 py-20 overflow-clip ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
    >
      <h1 className={`text-[#BB2632] text-3xl sm:text-4xl md:text-5xl text-center pt-12 sm:pt-24 pb-8 sm:pb-16 ${isRTL ? 'font-medium' : ''}`}>
        {isRTL ? 'أدواتنا' : 'Our Tools'}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 px-4 sm:px-5 max-w-7xl mx-auto ">
        {tools.map((tool, index) => (
          <div
            key={tool.id}
            className={`bg-white group transition-all duration-500 hover:shadow-xl sm:p-8 lg:pb-12 items-center rounded-xl ${
              index % 2 !== 0 ? 'md:transform md:translate-y-28' : ''
            }`}
          >
            <Link 
              to={`/tools/${tool.id}`}
              className="block cursor-pointer"
            >
              <div className="flex flex-col sm:flex-row items-center">
                <div className="flex-shrink-0 w-24 h-20 sm:w-32 sm:h-32 mb-4 sm:mb-0 sm:mr-6">
                  <img
                    src={tool.image}
                    alt={tool.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className={`text-center sm:text-left ${isRTL ? 'sm:text-right sm:mr-6' : ''}`}>
                  <h3 className="text-xl sm:text-2xl text-[#000000] mb-2 sm:mb-4">
                    {tool.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 bahnschrift">
                    {tool.description}
                  </p>
                  <span className="text-[#BB2632] font-semibold relative inline-block group-hover:after:w-full">
                    {isRTL ? 'استكشاف الأداة' : 'Explore Tool'}
                    <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#BB2632] transition-all duration-500 group-hover:w-full"></span>
                  </span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}