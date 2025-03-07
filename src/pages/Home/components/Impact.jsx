import React, { useRef, useEffect } from 'react';
import Whitebackground from "../../../assets/images/Whitebackground.png";
import famile from "../../../assets/images/famile.png";
import { motion } from 'framer-motion';

const data = [
  {
    title: "Health Market",
    percent: "20% in one month",
    services: ["Market Research", "Customer Satisfaction", "Feasibility Studies"],
    image: "../../../assets/images/doctor.png"
  },
  {
    title: "Technology Market",
    percent: "30% in two weeks",
    services: ["Market Research", "Customer Satisfaction", "Feasibility Studies"],
    image: "../../../assets/images/woman.png"
  },
  
  {
    title: "Consumer Market",
    percent: "45% in three months",
    services: ["Market Research", "Customer Satisfaction", "Feasibility Studies"],
    image: famile
  }
];

export default function Impact() {
  const ref = useRef();

  return (
    <section
      className="min-h-screen bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: `url(${Whitebackground})` }}
      ref={ref}
    >
      <h1 className="text-[#BB2632] text-5xl text-center pt-24">Our Impact</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-10 py-20">
        {data.map((item, index) => (
          <motion.div
            key={index}
            className="p-8 rounded-lg  text-center bg-white"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.3 }}
          >
            <img src={item.image} alt={item.title} className="w-[400px] h-[409px] mx-auto mb-6 object-cover" />
            <h2 className="text-[#BB2632] text-2xl font-bold">{item.title}</h2>
            <p className="my-4">We helped a client to increase their sales by <strong>{item.percent}</strong></p>
            <p className="font-semibold">We did it by providing the following services:</p>
            {item.services.map((service, i) => (
              <p key={i} className="text-gray-600">{service}</p>
            ))}
          </motion.div>
        ))}
      </div>
    </section>
  );
}