import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { getServiceById, setAPILanguage } from '../../services/api';
import Redbackground from "../../assets/images/Redbackground.png";
import Whitebackground from "../../assets/images/Whitebackground.png";
import companyLogo from '../../assets/images/logo.png';

export default function ServicesDetails() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const BackArrowIcon = isRTL ? ArrowRight : ArrowLeft;
  
  useEffect(() => {
    const fetchServiceDetails = async () => {
      if (!id) {
        setError(isRTL ? 'معرف الخدمة غير متوفر' : 'Service ID is not available');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        setAPILanguage(i18n.language);
        const data = await getServiceById(id);
        setService(data);
      } catch (error) {
        console.error('Error in ServiceDetails component:', error);
        setError(error.message || (isRTL ? 'فشل تحميل المحتوى' : 'Failed to load content'));
      } finally {
        setLoading(false);
      }
    };

    fetchServiceDetails();
  }, [id, i18n.language, isRTL]);

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

  if (!service) {
    return (
      <section
        className="min-h-screen bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${Redbackground})` }}
      >
        <div className="bg-white bg-opacity-75 p-4 rounded-lg">
          <p className="text-gray-600">
            {isRTL ? 'لم يتم العثور على الخدمة المطلوبة' : 'Requested service not found'}
          </p>
        </div>
      </section>
    );
  }

  const singleImageExplores = service.explores?.filter(explore => explore.image && !explore.second_image) || [];
  const doubleImageExplores = service.explores?.filter(explore => explore.image && explore.second_image) || [];

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      <section 
        className="min-h-screen bg-cover bg-center relative flex items-center justify-center"
        style={{ 
          backgroundImage: `url(${service.image || companyLogo})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        
        <div className="absolute top-4 left-4 right-4 z-10">
          <div className="container mx-auto">
            <Link 
              to="/ServicesTools" 
              className={`inline-flex items-center text-white hover:text-[#BB2632] transition-colors bg-black/20 px-4 rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <BackArrowIcon className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {isRTL ? 'العودة إلى الخدمات' : 'Back to Services'}
            </Link>
          </div>
        </div>
        
        <div className="container mx-auto z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            {service.title}
          </h1>
          <p className={`text-white text-lg md:text-xl max-w-3xl mx-auto ${isRTL ? 'leading-loose' : ''}`}>
            {service.excerpt}
          </p>
        </div>
      </section>

      {singleImageExplores.length > 0 && (
        <section>
          <div className="container mx-auto">
            {singleImageExplores.map((explore, index) => {
              const bgImage = index % 2 === 0 ? Redbackground : Whitebackground;
              const textColor = index % 2 === 0 ? 'text-black' : 'text-black';
              
              return (
                <div 
                  key={explore.id}
                  className="py-12 bg-cover bg-center"
                  style={{ backgroundImage: `url(${bgImage})` }}
                >
                  <div className="container mx-auto px-4">
                    <div className={`flex flex-col ${index % 2 !== 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8`}>
                      <div className="md:w-1/2">
                        <img 
                          src={explore.image} 
                          alt={explore.title} 
                          className="w-full h-auto rounded-lg shadow-lg"
                        />
                      </div>
                      
                      <div className={`md:w-1/2 ${textColor}`}>
                        <h3 className={`text-2xl font-bold mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                          {explore.title}
                        </h3>
                        <p className={`${isRTL ? 'text-right leading-loose' : 'text-left'}`}>
                          {explore.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
      
      {doubleImageExplores.length > 0 && (
        <section>
          <div className="container mx-auto">
            {doubleImageExplores.map((explore, index) => {
              const bgImage = index % 2 === 0 ? Redbackground : Whitebackground;
              const textColor = index % 2 === 0 ? 'text-black' : 'text-gray-800';
              
              return (
                <div 
                  key={explore.id}
                  className="py-12 bg-cover bg-center"
                  style={{ backgroundImage: `url(${bgImage})` }}
                >
                  <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                      <div className="md:col-span-1 order-2 md:order-1">
                        <img 
                          src={explore.image} 
                          alt={explore.title} 
                          className="w-full h-70 object-cover"
                        />
                      </div>
                      
                      <div className={`md:col-span-1 order-1 md:order-2 text-center ${textColor}`}>
                        <h3 className="text-2xl font-bold mb-4">{explore.title}</h3>
                        <p className={`${isRTL ? 'leading-loose' : ''}`}>{explore.description}</p>
                      </div>
                      
                      <div className="md:col-span-1 order-3">
                        <img 
                          src={explore.second_image} 
                          alt={`${explore.title} - secondary`} 
                          className="w-full h-70 object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}