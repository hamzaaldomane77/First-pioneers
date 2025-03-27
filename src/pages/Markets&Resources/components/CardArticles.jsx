import React from 'react';

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

export default function CardArticles() {
    

    return (
        <section className="pb-16">
            <h1 className="= text-start pt-32 pb-5 pl-14 text-xl">Similar Articles:</h1>
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
                                
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
           
        </section>
    );
}
