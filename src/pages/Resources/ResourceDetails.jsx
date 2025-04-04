import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getEducationResourceById, setAPILanguage } from '../../services/api';
import { ArrowLeft, ArrowRight, Calendar, Tag } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ResourceDetails() {
  const { id } = useParams();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    const fetchResourceDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        setAPILanguage(i18n.language);
        
        const resourceData = await getEducationResourceById(id);
        setResource(resourceData);
      } catch (error) {
        console.error('Error fetching resource details:', error);
        setError(error.message || t('common.error', 'Failed to load content'));
      } finally {
        setLoading(false);
      }
    };

    fetchResourceDetails();
  }, [id, i18n.language, t]);

  const handleNextImage = () => {
    if (resource?.images?.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % resource.images.length);
    }
  };

  const handlePrevImage = () => {
    if (resource?.images?.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + resource.images.length) % resource.images.length);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#BB2632]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-500 bg-opacity-75 p-4 rounded-lg">
          <p className="text-white">{error}</p>
        </div>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">
            {isRTL ? 'المورد غير موجود' : 'Resource Not Found'}
          </h2>
          <Link
            to="/resources"
            className="text-[#BB2632] hover:underline flex items-center justify-center gap-2"
          >
            {isRTL ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
            {isRTL ? 'العودة إلى الموارد التعليمية' : 'Back to Resources'}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-6 md:px-12" dir={isRTL ? 'rtl' : 'ltr'}>
      <Link
        to="/resources"
        className="text-[#BB2632] hover:underline flex items-center gap-2 mb-8"
      >
        {isRTL ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
        {isRTL ? 'العودة إلى الموارد التعليمية' : 'Back to Resources'}
      </Link>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Main Image */}
          <div className="relative h-96">
            <img
              src={resource.image}
              alt={resource.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-8">
            {/* Title and Description */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-[#BB2632] mb-4">
                {resource.title}
              </h1>
              <p className="text-gray-700 leading-relaxed bahnschrift text-[16px]">
                {resource.description}
              </p>
            </div>

            {/* Categories */}
            {resource.categories && resource.categories.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">
                  {isRTL ? 'التصنيفات' : 'Categories'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {resource.categories.map((category) => (
                    <div
                      key={category.id}
                      className="bg-gray-50 p-4 rounded-lg border border-gray-100"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Tag className="w-5 h-5 text-[#BB2632]" />
                        <h4 className="font-semibold text-[#BB2632]">
                          {category.name}
                        </h4>
                      </div>
                      {category.description && (
                        <p className="text-gray-600 text-sm bahnschrift text-[16px]">
                          {category.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Images Gallery */}
            {resource.images && resource.images.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">
                  {isRTL ? 'معرض الصور' : 'Image Gallery'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {resource.images.map((image) => (
                    <div
                      key={image.id}
                      className="relative h-48 rounded-lg overflow-hidden cursor-pointer"
                      onClick={() => {
                        setCurrentImageIndex(resource.images.findIndex(img => img.id === image.id));
                      }}
                    >
                      <img
                        src={image.image}
                        alt={image.alt_text}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 