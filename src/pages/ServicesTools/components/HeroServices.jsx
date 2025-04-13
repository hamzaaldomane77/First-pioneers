import React from 'react'
import heroServices from "../../../assets/images/heroServices.png";
import { useInView } from 'react-intersection-observer';
import { useTranslation } from 'react-i18next';

export default function HeroServices() {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';

    const { ref, inView } = useInView({
      threshold: 0.3,
      triggerOnce: true,
    });

    return (
      <section
        className={`relative z-0 h-[450px] bg-cover bg-center flex items-center justify-center text-center text-white transition-all duration-1000 p-6 lg:pl-28 lg:pb-40 overflow-y-hidden ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
        style={{ backgroundImage: `url(${heroServices})` }}
        ref={ref}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="max-w-3xl">
          <h1 className="text-3xl mb-5 md:text-[44px] leading-snug pt-20">
            {t('servicesTools.hero.title')}
          </h1>
          <p className="text-lg md:text-xl pt-10">
            {t('servicesTools.hero.description')}
          </p>
        </div>
      </section>
    )
}
