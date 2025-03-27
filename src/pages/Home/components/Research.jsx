import React from 'react';
import Whitebackground from "../../../assets/images/Whitebackground.png";
import OurResearch from "../../../assets/images/OurResearch.png";
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';

const researchItems = [
  {
    title: "Explore Our Blog",
    text: "Stay informed with the latest trends, insights, and expert perspectives in market research. Our blog features thought-provoking articles, industry updates, and practical tips to help you make smarter, data-driven decisions."
  },
  {
    title: "Read and Download Our Reports",
    text: "Access in-depth research reports tailored to your industry. From market trends to consumer behavior, our downloadable resources provide the insights you need to stay ahead of the competition."
  },
  {
    title: "Learn How Research Work",
    text: "Expand your knowledge with our collection of educational articles. Whether you're new to market research or a seasoned professional, these resources offer valuable guidance on methodologies, tools, and best practices."
  }
];

export default function Research() {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  return (
    <section
      className="min-h-screen bg-cover bg-center p-8 md:p-16" // تعديل الهوامش لتناسب الشاشات الصغيرة
      style={{ backgroundImage: `url(${Whitebackground})` }}
      ref={ref}
    >
      <h1 className="text-[#BB2632] text-3xl md:text-5xl text-center pt-10 md:pt-20 pb-6 md:pb-8">Our Research And Insights</h1>
      <p className='text-center text-sm mb-8 md:mb-14 text-[#010203] leading-6 md:leading-8'>
        Strikethrough asset auto invite thumbnail connection bullet connection draft. Style text figjam subtract link share line component link main.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <img src={OurResearch} alt="Our Research" className='w-full max-w-[800px] mx-auto' /> {/* تعديل عرض الصورة */}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {researchItems.map((item, index) => (
            <div key={index} className="mb-4 md:mb-6"> {/* تعديل الهوامش */}
              <h2 className="font-bold text-[#BB2632] text-base md:text-lg">{item.title}</h2> {/* تعديل حجم الخط */}
              <p className="text-sm text-[#010203] leading-6 md:leading-7">{item.text}</p> {/* تعديل ارتفاع السطر */}
            </div>
          ))}

          <button className="bg-[#BB2632] text-white py-2 md:py-3 rounded-full mt-4 md:mt-6 hover:bg-[#ea3c4b] transition-all px-6 md:px-10">
            More Research and Insights
          </button>
        </motion.div>
      </div>
    </section>
  );
}