import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getServiceById, setAPILanguage } from '../../services/api';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import Redbackground from "../../assets/images/Redbackground.png";


export default function ServicesDetails() {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const [serviceDetails, setServiceDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isRtl = i18n.language === 'ar';
  
  const fetchServiceDetails = async () => {
    if (!id) {
      setError('Service ID is missing');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setAPILanguage(i18n.language);
      const data = await getServiceById(id);
      setServiceDetails(data);
      console.log('Service details fetched:', data);
    } catch (err) {
      console.error('Error fetching service details:', err);
      setError(err.message || 'Failed to fetch service details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceDetails();
  }, [id, i18n.language]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#BB2632]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">{t('common.error', isRtl ? 'خطأ' : 'Error')}:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
        <Link to="/ServicesTools" className="mt-4 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          {isRtl ? 'العودة إلى الخدمات' : 'Back to Services'}
        </Link>
      </div>
    );
  }

  if (!serviceDetails) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">{t('common.notice', isRtl ? 'ملاحظة' : 'Notice')}:</strong>
          <span className="block sm:inline"> {isRtl ? 'لم يتم العثور على الخدمة' : 'Service not found'}</span>
        </div>
        <Link to="/ServicesTools" className="mt-4 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          {isRtl ? 'العودة إلى الخدمات' : 'Back to Services'}
        </Link>
      </div>
    );
  }

  // تقسيم استكشافات الخدمة بناءً على نوع الصور
  const bothImagesExplores = serviceDetails.explores?.filter(explore => explore.image && explore.second_image) || [];
  const singleImageExplores = serviceDetails.explores?.filter(explore => explore.image && !explore.second_image) || [];
  const noImageExplores = serviceDetails.explores?.filter(explore => !explore.image) || [];

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="relative">
        <div className="w-full h-[80vh] bg-gray-800">
          {serviceDetails.image ? (
            <img
              src={serviceDetails.image}
              alt={serviceDetails.title}
              className="w-full h-full object-cover opacity-40"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-b from-gray-700 to-gray-900"></div>
          )}
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6">
            <div className=" bg-opacity-50 p-8 rounded-lg max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{serviceDetails.title}</h1>
              <p className="text-xl text-white">{serviceDetails.excerpt}</p>
            </div>
          </div>
        </div>
      </div>

      {/* استكشافات بصورة واحدة وبدون صور */}
      {(singleImageExplores.length > 0 || noImageExplores.length > 0) && (
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            {isRtl ? 'استكشاف هذه الخدمة' : 'Explore This Service'}
          </h2>
          
          <div className="space-y-24">
            {/* استكشافات بصورة واحدة */}
            {singleImageExplores.map((explore, index) => (
              <div key={index} className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8`}>
                <div className="w-full md:w-1/2">
                  <img 
                    src={explore.image} 
                    alt={explore.title} 
                    className="w-full h-auto rounded-lg shadow-lg"
                  />
                </div>
                <div className="w-full md:w-1/2 p-6">
                  <h3 className="text-2xl font-bold mb-4 text-gray-800">{explore.title}</h3>
                  <p className="text-gray-600">{explore.description}</p>
                </div>
              </div>
            ))}

            {/* استكشافات بدون صور */}
            {noImageExplores.map((explore, index) => (
              <div key={index} className="max-w-3xl mx-auto text-center p-6 bg-white rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold mb-4 text-gray-800">{explore.title}</h3>
                <p className="text-gray-600">{explore.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}


      {bothImagesExplores.length > 0 && (
        <section 
          className="py-16 min-h-[80vh] bg-cover bg-center text-white"
          style={{ backgroundImage: `url(${Redbackground})` }}
        >
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-red-900">
              {isRtl ? 'الميزات المميزة' : 'Special Features'}
            </h2>
            
            <div className="space-y-32">
              {bothImagesExplores.map((explore, index) => (
                <div key={index} className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12">
                  <div className="w-full md:w-1/4">
                    <img 
                      src={isRtl ? explore.image : explore.second_image} 
                      alt={`${explore.title} - ${isRtl ? 'صورة يمين' : 'left image'}`} 
                      className="w-full h-auto rounded-lg shadow-lg"
                    />
                  </div>
                  <div className="w-full md:w-1/2 text-center py-6 text-[16px] bg-opacity-50 rounded-lg p-8 bahnschrift">
                    <h3 className="text-2xl font-bold mb-4 text-red-900">{explore.title}</h3>
                    <p className="text-gray-600">{explore.description}</p>
                  </div>
                  <div className="w-full md:w-1/4">
                    <img 
                      src={isRtl ? explore.second_image : explore.image} 
                      alt={`${explore.title} - ${isRtl ? 'صورة يسار' : 'right image'}`} 
                      className="w-full h-auto rounded-lg shadow-lg"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

     
    </div>
  );
}