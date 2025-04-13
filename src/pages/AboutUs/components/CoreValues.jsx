import React from 'react';
import Redbackground from "../../../assets/images/Redbackground.png";
import befirst from "../../../assets/images/befirst.png";
import creativity from "../../../assets/images/creativity.png";
import Powerfulinformation from "../../../assets/images/Powerfulinformation.png";
import Client from "../../../assets/images/Client.png";
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';

import { useTranslation } from 'react-i18next';

export default function CoreValues() {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });
  
  const { t } = useTranslation();


  const coreValues = [
    {
      id: 1,
      image: befirst,
      title: t('coreValues.values.beFirst.title'),
      description: t('coreValues.values.beFirst.description'),
    },
    {
      id: 2,
      image: creativity,
      title: t('coreValues.values.creativity.title'),
      description: t('coreValues.values.creativity.description'),
    },
    {
      id: 3,
      image: Powerfulinformation,
      title: t('coreValues.values.powerfulInfo.title'),
      description: t('coreValues.values.powerfulInfo.description'),
    },
    {
      id: 4,
      image: Client,
      title: t('coreValues.values.clientCentric.title'),
      description: t('coreValues.values.clientCentric.description'),
    },
  ];

  return (
    <section
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${Redbackground})` }}
      ref={ref}
    >
      <div className="text-center">
        <h1 className="text-[#BB2632] text-center pt-32 pb-12 text-5xl md:text-4xl sm:text-3xl">
          {t('coreValues.title')}
        </h1>
        <p className="text-black px-6 lg:px-64">
          {t('coreValues.description')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-8 px-5 lg:px-20 py-20">
        {coreValues.map((value) => (
          <motion.div
            key={value.id}
            className="flex flex-col items-center text-center p-6"
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: value.id * 0.2 }}
          >
            <motion.img
              src={value.image}
              alt={value.title}
              className="lg:w-[600px] lg:h-[400px] mb-4 sm:w-[600px] sm:h-[400px]"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={inView ? { scale: 1, opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: value.id * 0.3 }}
            />
            <h2 className="text-xl font-bold mb-4 text-red-700">{value.title}</h2>
            <p className="text-black bahnschrift ">{value.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
