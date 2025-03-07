import React from 'react';
import Whitebackground from "../../../assets/images/Whitebackground.png";
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';

export default function Vision() {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  
  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <section
      className="min-h-screen bg-cover bg-center py-40"
      style={{ backgroundImage: `url(${Whitebackground})` }}
      ref={ref}
    >
      <div className="text-center">
        <motion.h1
          className="text-[#BB2632] text-center pt-32 pb-12 text-3xl md:text-4xl sm:text-3xl"
          variants={fadeInUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          Our Vision
        </motion.h1>
        <motion.p
          className="text-sm"
          variants={fadeInUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          transition={{ delay: 0.3 }} // تأخير الأنيميشن
        >
          To become the MENA’s most innovative and trusted leader in market research and studies, setting new standards of excellence and reliability.
        </motion.p>
      </div>

      <div className="py-20 pb-16 text-center">
        <motion.h1
          className="text-[#BB2632] text-center pt-32 text-5xl md:text-4xl sm:text-3xl pb-12"
          variants={fadeInUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          transition={{ delay: 0.6 }} // تأخير الأنيميشن
        >
          Our Mission
        </motion.h1>
        <motion.p
          className="text-sm text-[#000000]"
          variants={fadeInUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          transition={{ delay: 0.9 }} // تأخير الأنيميشن
        >
          We are dedicated to providing cutting-edge, integrated marketing research and studies that drive real results, and by combining creativity, innovation, and strategic expertise, we empower our clients to unlock their full potential, grow their businesses, and achieve their most ambitious marketing goals.
        </motion.p>
      </div>
    </section>
  );
}