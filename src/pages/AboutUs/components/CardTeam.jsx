import React from 'react';
import Redbackground from "../../../assets/images/Redbackground.png";
import Service1 from "../../../assets/images/service1.png";
import { useInView } from 'react-intersection-observer';


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

export default function CardTeam() {
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
      <div className='py-20'>
        <h1 className="text-[#BB2632] lg:text-5xl text-center pt-24">Meet Our Team</h1>
        <p className='text-center lg:text-xl mt-4 mb-8'>We are proud to present to you our team of experts which covers most of the fields in the world of research</p>
        
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-10 pb-32">
        {servicesData.map(service => (
          <a href="/services-details" key={service.id} className="overflow-hidden shadow-lg rounded-lg transition-all duration-500 hover:scale-105 cursor-pointer group block">
            <div className="relative">
              <img src={service.image} alt={service.title} className="w-full h-60 object-cover transition-transform duration-500 " />
            </div>
            <div className="p-6 text-center">
              <h3 className="text-lg font-semibold transition-all duration-500 ">{service.title}</h3>
              <p className="text-sm text-[#333333] my-4">{service.description}</p>
      
            </div>
          </a>
        ))}
      </div>
      
    </section>
  );
}