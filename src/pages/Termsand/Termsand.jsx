import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getTermsAndConditions, setAPILanguage } from '../../services/api';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const Termsand = () => {
  const [termsData, setTermsData] = useState({
    title: '',
    description: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  useEffect(() => {
    const fetchTermsAndConditions = async () => {
      try {
        setLoading(true);
        setError(null);
        setAPILanguage(i18n.language);
        
        const data = await getTermsAndConditions();
        setTermsData({
          title: data.title || '',
          description: data.description || ''
        });
      } catch (err) {
        console.error('Error fetching terms and conditions:', err);
        setError(err.message || 'Failed to load terms and conditions');
      } finally {
        setLoading(false);
      }
    };

    fetchTermsAndConditions();
  }, [i18n.language]);

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
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <section 
      className="min-h-screen flex flex-col justify-center items-center px-4"
      dir={isRTL ? 'rtl' : 'ltr'}
      ref={ref}
    >
      <div className="max-w-4xl mx-auto">
        <motion.h1 
          className="text-3xl md:text-4xl font-bold text-[#000000] mb-8 text-center"
          variants={fadeInUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {termsData.title}
        </motion.h1>
        
        <motion.div
          className="bg-white p-6 md:p-8 lg:p-10"
          variants={fadeInUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          transition={{ delay: 0.2 }}
        >
          <div 
            className="text-start leading-7 mx-auto max-w-[1200px] w-full text-sm py-10 bahnschrift text-[16px]"
            dangerouslySetInnerHTML={{ __html: termsData.description }}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Termsand;