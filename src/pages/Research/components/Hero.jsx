import React from 'react'
import Heroref from "../../../assets/images/Heroref.png";
import { useInView } from 'react-intersection-observer';

export default function Hero() {

    const { ref, inView } = useInView({
      threshold: 0.3,
      triggerOnce: true,
    });

    return (
      <section
        className={`relative z-0 h-[450px] bg-cover bg-center flex items-center justify-center text-center text-white transition-all duration-1000 p-6 lg:pl-28  lg:pb-40 overflow-y-hidden ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
        style={{ backgroundImage: `url(${Heroref})` }}
        ref={ref}
      >
        <div className="max-w-3xl">
          <h1 className="text-3xl mb-5 md:text-[44px] leading-snug pt-20">
          Data-Driven Insights for Smarter Decisions
          </h1>
          <p className="text-lg md:text-xl pt-10 ">
          Explore our latest research, industry trends, and actionable insights.
          </p>
        </div>
      </section>
    )
}
