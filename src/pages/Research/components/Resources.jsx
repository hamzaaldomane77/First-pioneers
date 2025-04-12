import React, { useState, useEffect } from 'react';
import Whitebackground from "../../../assets/images/Whitebackground.png";
import { useInView } from "react-intersection-observer";
import { ArrowRight, ArrowLeft, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getEducationResources, setAPILanguage } from '../../../services/api';

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        setError(null);
        setAPILanguage(i18n.language);
        
        console.log('Fetching resources (attempt', retryCount + 1, ')...');
        const response = await getEducationResources(1, 3);
        
        // Check if response has the expected structure
        if (!response || !response.resources) {
          throw new Error('Invalid response format');
        }
        
        console.log('Received resources:', response.resources);
        setResources(response.resources);
        setRetryCount(0);
      } catch (error) {
        console.error('Error in Resources component:', error);
        setError(error.message || t('common.error', 'Failed to load content'));
        
        if (retryCount < 3) {
          console.log('Retrying in 2 seconds...');
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, 2000);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [i18n.language, retryCount, t]);

  if (loading) {
    return (
      <section className="min-h-[50vh] w-full flex items-center justify-center py-16"
        style={{ backgroundImage: `url(${Whitebackground})` }}
      >
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#BB2632] mb-4"></div>
          {retryCount > 0 && (
            <p className="text-gray-600">
              {t('common.retrying', 'Retrying')} ({retryCount}/3)...
            </p>
          )}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-[50vh] w-full flex items-center justify-center py-16"
        style={{ backgroundImage: `url(${Whitebackground})` }}
      >
        <div className="bg-red-500 bg-opacity-75 p-4 rounded-lg">
          <p className="text-white">{error}</p>
          {retryCount >= 3 && (
            <p className="text-white mt-2 text-sm">
              {t('common.maxRetries', 'Maximum retry attempts reached')}
            </p>
          )}
        </div>
      </section>
    );
  }

  if (!resources || resources.length === 0) {
    return (
      <section className="min-h-[50vh] w-full flex items-center justify-center py-16"
        style={{ backgroundImage: `url(${Whitebackground})` }}
      >
        <p className="text-gray-600">
          {t('resources.noResources', 'No resources available')}
        </p>
      </section>
    );
  }

  return (
    <section 
      className={`min-h-screen bg-cover bg-center transition-all duration-1000 px-4 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`} 
      style={{ backgroundImage: `url(${Whitebackground})` }} 
      ref={ref}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <h1 className="text-[#BB2632] text-5xl text-center pt-32 pb-20">
        {t('resources.title', 'Educational Resources')}
      </h1>
      
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {resources.map(resource => (
            <Link 
              to={`/resources/${resource.id}`} 
              key={resource.id} 
              className="overflow-hidden shadow-lg rounded-lg transition-all duration-500 hover:scale-105 cursor-pointer group block bg-white"
            >
              <div className="relative h-60">
                <img 
                  src={resource.image} 
                  alt={resource.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3 group-hover:text-[#BB2632] group-hover:opacity-80 transition-opacity">
                  {resource.title}
                </h3>
                {resource.excerpt && (
                  <p className="text-gray-600 mb-4 line-clamp-3 bahnschrift text-[16px]">
                    {resource.excerpt}
                  </p>
                )}
                {resource.categories && resource.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {resource.categories.map((category) => (
                      <div
                        key={category.id}
                        className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2"
                      >
                        <Tag className="w-4 h-4 text-[#BB2632]" />
                        <span className="text-sm font-medium text-gray-700">
                          {category.name}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="text-[#BB2632] font-semibold relative inline-block cursor-pointer group">
                  {t('resources.viewResource', 'View Details')}
                  <span className="absolute left-0 right-0 bottom-0 w-0 h-[2px] bg-[#BB2632] transition-all duration-500 group-hover:w-full"></span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="text-center mt-8 p-12 text-xl">
        <Link 
          to="/resources" 
          className="inline-flex items-center text-[#ec3a49] font-semibold hover:opacity-80 transition-opacity duration-300 text-center group"
        >
          {t('resources.allResources', 'View All Resources')}
          <ArrowIcon className={`w-5 h-5 ml-2 ${isRTL ? 'rotate-180' : ''}`} />
        </Link>
      </div>
    </section>
  );
}
