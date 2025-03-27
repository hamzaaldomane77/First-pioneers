import React, { useState, useEffect } from 'react';
import Whitebackground from "../../../assets/images/Whitebackground.png";
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { getImpacts, setAPILanguage } from '../../../services/api';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Impact() {
  const [impacts, setImpacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 6;

  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    const fetchImpacts = async () => {
      try {
        setLoading(true);
        setError(null);
        setAPILanguage(i18n.language);
        
        const response = await getImpacts();
        setImpacts(response);
        setTotalPages(Math.ceil(response.length / itemsPerPage));
      } catch (error) {
        console.error('Error in Impact component:', error);
        setError(error.message || t('common.error', 'Failed to load content'));
      } finally {
        setLoading(false);
      }
    };

    fetchImpacts();
  }, [i18n.language, t]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // حساب العناصر التي سيتم عرضها في الصفحة الحالية
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return impacts.slice(startIndex, endIndex);
  };

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#BB2632]"></div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen flex items-center justify-center">
        <div className="bg-red-500 bg-opacity-75 p-4 rounded-lg">
          <p className="text-white">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section
      className="min-h-screen bg-cover bg-center overflow-hidden py-20"
      style={{ backgroundImage: `url(${Whitebackground})` }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <h1 className="text-[#BB2632] text-5xl text-center mb-20">
        {isRTL ? 'تأثيرنا' : 'Our Impact'}
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-10">
        {getCurrentPageItems().map((impact, index) => (
          <motion.div
            key={impact.id}
            className="bg-white overflow-hidden "
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            <div className="relative">
              <img 
                src={impact.image} 
                alt={impact.title}
                className="w-full h-full"
              />
            </div>
            
            <div className="p-6 flex flex-col gap-4">
              <h2 className="text-[#BB2632] text-2xl font-bold text-center py-4">
                {impact.title}
              </h2>
              
              <p className="text-gray-600 text-center bahnschrift">
                {impact.description}
              </p>
              
              {impact.services && impact.services.length > 0 && (
                <div className="mt-4">
                 
                  <div className="flex flex-col gap-2">
                    {impact.services.map((service) => (
                      <div
                        key={service.id}
                        className=" px-4  text-center bahnschrift"
                      >
                        {service.title}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12">
          <div className="flex justify-center items-center gap-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-full ${
                currentPage === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-[#BB2632] hover:bg-[#BB2632] hover:text-white'
              }`}
            >
              {isRTL ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
            </button>

            <div className="flex gap-2 overflow-x-auto px-4 max-w-xs md:max-w-md">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                    currentPage === page
                      ? 'bg-[#BB2632] text-white'
                      : 'text-[#BB2632] hover:bg-[#BB2632] hover:text-white'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-full ${
                currentPage === totalPages
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-[#BB2632] hover:bg-[#BB2632] hover:text-white'
              }`}
            >
              {isRTL ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
            </button>
          </div>
          <p className="text-center text-gray-600 mt-4">
            {isRTL 
              ? `الصفحة ${currentPage} من ${totalPages}`
              : `Page ${currentPage} of ${totalPages}`
            }
          </p>
        </div>
      )}
    </section>
  );
}