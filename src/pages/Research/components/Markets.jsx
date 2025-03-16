import React from 'react';
import Redbackground from "../../../assets/images/Redbackground.png";
import { useInView } from "react-intersection-observer";
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Service1 from "../../../assets/images/service1.png";

const servicesData = [
    {
      id: 1,
      image: Service1,
      title: "Feasibility Studies",
      link: "#",
      description: "Make smarter decisions! Analyze potential risks and outcomes to assess the viability of your projects so you can invest with confidence."
    },
  
    {
      id: 2,
      image: Service1,
      title: "Market Assessment",
      link: "#",
      description: "Test the waters before you dive in! Evaluate consumer response to new product ideas using both quantitative and qualitative methods."
    },
    {
      id: 3,
      title: "Customer Satisfaction Surveys",
      link: "#",
      description: "Gain critical insights into satisfaction levels to enhance service quality and boost business performance."
    }
];

export default function Markets() {
    const { ref, inView } = useInView({
        threshold: 0.3,
        triggerOnce: true,
    });

    return (
        <section className={`min-h-screen bg-cover bg-center transition-all duration-1000 p-6 overflow-hidden ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`} style={{ backgroundImage: `url(${Redbackground})` }} ref={ref}>
            <h1 className="text-[#BB2632] text-5xl text-center pt-32 pb-20">Words In Markets</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-10">
                {servicesData.slice(0, 3).map(service=> (
                    <Link to="/services-details" key={service.id} className="overflow-hidden shadow-lg rounded-lg transition-all duration-500 hover:scale-105 cursor-pointer group block">
                        <div className="relative">
                            {service.image && <img src={service.image} alt={service.title} className="w-full h-60 object-cover transition-transform duration-500 group-hover:scale-110" />}
                        </div>
                        <div className="p-6 text-center">
                            <h3 className="text-lg font-semibold transition-all duration-500 group-hover:text-[#BB2632]">{service.title}</h3>
                            <p className="text-sm text-[#333333] my-4">{service.description}</p>
                            <span className="text-[#BB2632] font-semibold relative inline-block pb-4  pr-6 pt-4 cursor-pointer">
                                View Article
                                <span className="absolute left-0 right-0 bottom-4 w-0 h-[2px] bg-[#BB2632] transition-all duration-500 group-hover:w-[95px]"></span>
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
            <div className='text-[#BB2632] text-center mt-8 p-12'>
                <Link to="/all-services" className=" hover:text-[#BB2632] flex justify-center items-center gap-2 transition-all duration-500 group">
                    View All Markets
                    <ArrowRight className="w-5 h-5 text-[#BB2632] transition-all duration-500 " />
                </Link>
            </div>
        </section>
    );
}
