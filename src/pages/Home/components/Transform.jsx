import React from 'react';
import Redbackground from "../../../assets/images/Redbackground.png";
import mancontactus from "../../../assets/images/mancontactus.png";
import womancontactus from "../../../assets/images/womancontactus.png";
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function Transform() {
    const { ref, inView } = useInView({
        threshold: 0.3,
        triggerOnce: true,
    });

    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';

    return (
        <section
            className={`min-h-[500px] bg-cover bg-center flex flex-col items-center justify-between px-10 lg:px-36 transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
            style={{ backgroundImage: `url(${Redbackground})` }}
            ref={ref}
            dir={isRTL ? 'rtl' : 'ltr'}
        >
            {/* النص - أعلى */}
           <div className='flex flex-col'>
           <div className="text-center order-1">
                <h1 className="text-3xl md:text-[30px] mb-5 pt-11">
                    {t('transform.title')} <br />
                </h1>
                <p className="text-lg mb-8">
                    {t('transform.description')}
                </p>
                <button className="bg-[#BB2632] text-white py-3 px-6 rounded-full hover:scale-110 transition">
                    {t('transform.button')}
                </button>
            </div>

            {/* الصور - أسفل */}
            <div className="flex flex-row items-center justify-center gap-5 order-2 mt-10 lg:flex-wrap md:mx-16">
                <motion.img
                    src={womancontactus}
                    alt="Woman Contact Us "
                    className="w-[150px] md:w-[300px] object-contain md:mx-20"
                    initial={{ opacity: 0, x: isRTL ? 100 : -100 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 1 }}
                />
                <motion.img
                    src={mancontactus}
                    alt="Man Contact Us"
                    className="w-[150px] md:w-[300px] object-contain md:mx-20"
                    initial={{ opacity: 0, x: isRTL ? -100 : 100 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 1 }}
                />
            </div>
           </div>
        </section>
    );
}