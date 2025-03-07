import React from 'react';
import Redbackground from "../../../assets/images/Redbackground.png";
import Service1 from "../../../assets/images/service1.png";
import { useInView } from 'react-intersection-observer';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const servicesData = [
  {
    id: 1,
    image: Service1,
    title: "Feasibility Studies",
    description: "Make smarter decisions! Analyze potential risks and outcomes to assess the viability of your projects so you can invest with confidence."
  },
  {
    id: 2,
    title: "Market Assessment",
    description: "Test the waters before you dive in! Evaluate consumer response to new product ideas using both quantitative and qualitative methods."
  },
  {
    id: 3,
    title: "Customer Satisfaction Surveys",
    description: "Gain critical insights into satisfaction levels to enhance service quality and boost business performance."
  }
];

export default function Services() {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  return (
    <section
      className={`min-h-screen bg-cover bg-center transition-all duration-1000 p-6 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
      style={{ backgroundImage: `url(${Redbackground})` }}
      ref={ref}
    >
      <div>
        <h1 className="text-[#BB2632] text-5xl text-center pt-24">Our Services</h1>
        <p className='text-center text-3xl mt-4 mb-8'>Are you ready to take your business to the next level?</p>
        <p className='text-center text-sm mb-8 text-[#010203] leading-8'>
          Our comprehensive suite of market research and marketing services is tailor-made to meet your unique needs and drive your success. Whether you're launching a new product, refining your brand, or exploring new opportunities, we’ve got you covered with innovative solutions that deliver real results. Here’s how we can help you stand out, connect, and grow:
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-10">
        {servicesData.map(service => (
          <a href="/services-details" key={service.id} className="overflow-hidden shadow-lg rounded-lg transition-all duration-500 hover:scale-105 cursor-pointer group block">
            <div className="relative">
              <img src={service.image} alt={service.title} className="w-full h-60 object-cover transition-transform duration-500 group-hover:scale-110" />
            </div>
            <div className="p-6 text-center">
              <h3 className="text-lg font-semibold transition-all duration-500 group-hover:text-[#BB2632]">{service.title}</h3>
              <p className="text-sm text-[#333333] my-4">{service.description}</p>
              <span className="text-[#BB2632] font-semibold relative inline-block">
                Explore Service
                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#BB2632] transition-all duration-500 group-hover:w-full"></span>
              </span>
            </div>
          </a>
        ))}
      </div>
      <div className='text-[#BB2632] text-center mt-8 p-12'>
        <Link href="/all-services" className="hover:text-[#BB2632] flex justify-center items-center gap-2 transition-all duration-500 group">
          View All Services
          <ArrowRight className="w-5 h-5 text-[#BB2632] transition-all duration-500 " />
          
        </Link>
      </div>
    </section>
  );
}