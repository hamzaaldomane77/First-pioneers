import React from 'react';
import { useInView } from 'react-intersection-observer';

const servicesData = [
  {
    id: 1,
    title: "Desk Research",
    description: "Leverage existing information from internal and external sources to uncover valuable insights.",
    image: "https://png.pngtree.com/png-clipart/20190611/original/pngtree-wolf-logo-png-image_2306634.jpg"
  },
  {
    id: 1,
    title: "Desk Research",
    description: "Leverage existing information from internal and external sources to uncover valuable insights.",
    image: "https://png.pngtree.com/png-clipart/20190611/original/pngtree-wolf-logo-png-image_2306634.jpg"
  },
  {
    id: 2,
    title: "In-depth Interviews",
    description: "Engage in one-on-one qualitative interviews to explore individual perspectives in detail.",
    image: "https://via.placeholder.com/150"
  },
  {
    id: 3,
    title: "Mystery Shopping",
    description: "See your business through your customers’ eyes! Evaluate services with anonymous, real-world assessments.",
    image: "https://via.placeholder.com/150"
  },
  {
    id: 4,
    title: "Personal In-Home and In-Office Interviews",
    description: "Conduct interviews in personal settings to gain deeper insights into customer behavior and preferences.",
    image: "https://via.placeholder.com/150"
  }
];

export default function Tools() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <section
      ref={ref}
      className={`min-h-screen transition-all duration-1000 p-6 py-20 overflow-clip ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
    >
      <h1 className="text-[#BB2632] text-3xl sm:text-4xl md:text-5xl text-center pt-12 sm:pt-24 pb-8 sm:pb-16">
        Our Tools
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 px-4 sm:px-5 max-w-7xl mx-auto">
        {servicesData.map((service, index) => (
          <div
            key={index} // استخدام index كمفتاح لأن id غير فريد
            className={`bg-white group transition-all duration-500 hover:shadow-xl p-6 sm:p-8 lg:pb-24 ${
              index % 2 !== 0 ? 'md:transform md:translate-y-28' : ''
            }`}
          >
            <div className="flex flex-col sm:flex-row items-center">
              {/* قسم الصورة */}
              <div className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 mb-4 sm:mb-0 sm:mr-6">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>

              {/* قسم النص */}
              <div className="text-center sm:text-left">
                <h3 className="text-xl sm:text-2xl text-[#000000] mb-2 sm:mb-4">
                  {service.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {service.description}
                </p>
                <button className="text-[#BB2632] font-semibold relative">
                  Explore Tool
                  <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#BB2632] transition-all duration-500 group-hover:w-full"></span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}