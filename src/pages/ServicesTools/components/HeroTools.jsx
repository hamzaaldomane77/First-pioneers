import React from 'react';
import heroTools from "../../../assets/images/heroTools.png";
import { useInView } from 'react-intersection-observer';

export default function HeroServices() {

    const { ref, inView } = useInView({
      threshold: 0.3,
      triggerOnce: true,
    });

    return (
      <section
        className={`relative z-0 h-[450px] bg-cover bg-center flex items-center justify-center text-center text-white transition-all duration-1000 p-6 lg:pl-28 lg:pb-36 overflow-y-hidden pb-10 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
        style={{ backgroundImage: `url(${heroTools})` }}
        ref={ref}
      >
        <div className="max-w-3xl">
          <h1 className="text-3xl mb-5 md:text-[44px] leading-snug pt-20">
            Usage & Attitude Studies
          </h1>
          <p className="text-lg md:text-xl pt-10 pb-8">
            We offer a wide range of services designed to help businesses make data-driven decisions and achieve their goals. Explore our offerings below
          </p>
          <button className='bg-[#BB2632] p-4 px-12 text-white border-spacing-7 rounded-2xl leading-2'>
            Main CTA
          </button>
        </div>
      </section>
    );
}