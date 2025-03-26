import React, { useState, useEffect } from 'react';
import Whitebackground from "../../../assets/images/Whitebackground.png";
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { getMissions, getVisions, setAPILanguage } from '../../../services/api';

export default function Vision() {
  const [missions, setMissions] = useState({
    vision: '',
    mission: ''
  });
  const [visionDescription, setVisionDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        setAPILanguage(i18n.language);
        
        const [missionsData, visionsData] = await Promise.all([
          getMissions(),
          getVisions()
        ]);
        
        setMissions(missionsData || { vision: '', mission: '' });
        setVisionDescription(visionsData || '');
      } catch (error) {
        setError(error.message || 'Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [i18n.language]);

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#BB2632]"></div>
      </section>
    );
  }

  return (
    <section
      className="min-h-screen bg-cover bg-center py-40"
      style={{ backgroundImage: `url(${Whitebackground})` }}
      ref={ref}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="text-center">
        <motion.h1
          className="text-[#BB2632] text-center pt-32 pb-12 text-3xl md:text-4xl sm:text-3xl"
          variants={fadeInUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {t('vision.title', 'Our Vision')}
        </motion.h1>
        <motion.div
          className="max-w-3xl mx-auto px-4"
          variants={fadeInUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          transition={{ delay: 0.3 }}
        >
          {error ? (
            <p className="text-red-600">{t('common.error', error)}</p>
          ) : (
            <>
              <p className="text-lg leading-relaxed mb-6">
                {missions.vision}
              </p>
              {visionDescription && (
                <p className="text-lg leading-relaxed">
                  {visionDescription}
                </p>
              )}
            </>
          )}
        </motion.div>
      </div>

      <div className="py-20 pb-16 text-center">
        <motion.h1
          className="text-[#BB2632] text-center pt-32 text-5xl md:text-4xl sm:text-3xl pb-12"
          variants={fadeInUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          transition={{ delay: 0.6 }}
        >
          {t('mission.title', 'Our Mission')}
        </motion.h1>
        <motion.div
          className="max-w-3xl mx-auto px-4"
          variants={fadeInUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          transition={{ delay: 0.9 }}
        >
          {error ? (
            <p className="text-red-600">{t('common.error', error)}</p>
          ) : (
            <p className="text-lg leading-relaxed text-[#000000]">
              {missions.mission}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}