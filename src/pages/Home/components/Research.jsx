import React from 'react';
import Whitebackground from "../../../assets/images/Whitebackground.png";
import OurResearch from "../../../assets/images/OurResearch.png";
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
export default function Research() {
  const { t } = useTranslation();
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const researchItems = [
    {
      title: t('research.items.blog.title'),
      text: t('research.items.blog.text')
    },
    {
      title: t('research.items.reports.title'),
      text: t('research.items.reports.text')
    },
    {
      title: t('research.items.learn.title'),
      text: t('research.items.learn.text')
    }
  ];

  return (
    <section
      className="min-h-screen bg-cover bg-center p-8 md:p-16"
      style={{ backgroundImage: `url(${Whitebackground})` }}
      ref={ref}
    >
      <h1 className="text-[#BB2632] text-3xl md:text-5xl text-center pt-10 md:pt-20 pb-6 md:pb-8">
        {t('research.title')}
      </h1>
      <p className='text-center text-sm mb-8 md:mb-14 text-[#010203] leading-6 md:leading-8'>
        {t('research.subtitle')}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <img src={OurResearch} alt={t('research.title')} className='w-full max-w-[800px] mx-auto' />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {researchItems.map((item, index) => (
            <div key={index} className="mb-4 md:mb-6 ">
              <h2 className="font-bold text-[#000000] text-base md:text-lg">{item.title}</h2>
              <p className="text-sm text-[#010203] leading-6 md:leading-7 bahnschrift">{item.text}</p>
            </div>
          ))}

          <Link to="/research-and-insights">
          <button className="bg-[#BB2632] text-white py-2 md:py-3 rounded-full mt-4 md:mt-6 hover:bg-[#ea3c4b] transition-all px-6 md:px-10">
            {t('research.button')}
          </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}