import React from 'react';
import Redbackground from "../../../assets/images/Redbackground.png";
import befirst from "../../../assets/images/befirst.png";
import creativity from "../../../assets/images/creativity.png";
import Powerfulinformation from "../../../assets/images/Powerfulinformation.png";
import Client from "../../../assets/images/Client.png";
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';

export default function CoreValues() {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  // مصفوفة تحتوي على البيانات الخاصة بكل قسم
  const coreValues = [
    {
      id: 1,
      image: befirst,
      title: "Be First, Be Bold, Be Unstoppable",
      description: "As the first authorised company to deliver cutting-edge market research and marketing services in a ten-tier retailer game (more in 5%), we’ve redefined what it means to look for possibilities. Our innovative approach ensures we remain the industry leader in delivering exceptional results.",
    },
    {
      id: 2,
      image: creativity,
      title: "Creativity That Breaks Barriers",
      description: "We don’t just think outside the box, we reinvent it. Our team thrives on crafting bold, groundbreaking concepts and pioneering research models that deliver exceptional, game-changing results. When you work with us, you’re not just getting insights; you’re unlocking a world of possibilities.",
    },
    {
      id: 3,
      image: Powerfulinformation,
      title: "Powerful Information That Drives Action",
      description: "Knowledge is power, and we deliver it in its most potent form. Through a dynamic mix of advanced tools and proven methodologies, we provide actionable, data-driven insights that empower you to tackle challenges head-on and make decisions with confidence. Your success is fueled by our expertise.",
    },
    {
      id: 4,
      image: Client,
      title: "Client-Centric to the Core",
      description: "Your goals are our mission. At First Pioneers, we don’t just serve clients; we partner with them. Our client-first philosophy is woven into everything we do. Going above and beyond isn’t just a promise; it’s who we are. Your success is our legacy.",
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
          Our Core Values
        </h1>
        <p className="text-black px-6 lg:px-64">
          At First Pioneers, our values are the foundation of everything we do. They guide our decisions, shape our culture, and drive us to deliver exceptional results for our clients. We believe in the power of data to transform businesses, and we’re committed to helping you achieve your goals with integrity, innovation, and excellence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-8 px-10 lg:px-20 py-20">
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
            <h2 className="text-xl font-bold mb-4">{value.title}</h2>
            <p className="text-gray-600">{value.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
