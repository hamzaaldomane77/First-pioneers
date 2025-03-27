import React from "react";
import { useInView } from "react-intersection-observer";

const ContentSection = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const mainImage = "https://t3.ftcdn.net/jpg/02/04/52/72/360_F_204527293_o9ut8AIm2PaXQg22sSqLMH354X8weheJ.jpg";
  const bottomImages = [
    "https://t3.ftcdn.net/jpg/02/04/52/72/360_F_204527293_o9ut8AIm2PaXQg22sSqLMH354X8weheJ.jpg",
    "https://source.unsplash.com/random/600x400/?meeting",
    "https://source.unsplash.com/random/600x400/?presentation",
  ];

  return (
    <section
      ref={ref}
      className={`max-w-6xl mx-auto px-4 py-16 transition-all duration-1000 ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
      }`}
    >
      {/* Top Three Tags */}
      <div className="flex flex-wrap gap-3 mb-6">
        {["Market Research", "Competitor Analysis", "Business Strategy"].map(
          (tag, index) => (
            <span
              key={index}
              className="bg-white text-[#BB2632] border border-[#BB2632] px-4 py-1 rounded-full text-sm font-medium hover:bg-[#BB2632] hover:text-white hover:d"
            >
              {tag}
            </span>
          )
        )}
      </div>

      {/* Main Title */}
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        How to Improve Your Business Strategies Using Advanced Market Research
      </h1>

      {/* Subtitle */}
      <h2 className="text-xl text-gray-600 mb-8">
        Discover Modern Methods for Market Analysis and More Effective Decision Making
      </h2>

      {/* Long Description Text */}
      <div className="prose max-w-none text-gray-700 mb-10">
        <p className="mb-4">
          Market research is one of the most important tools that enables companies to understand
          their customers' needs and discover new opportunities in the market. In today's
          competitive business world, general market knowledge is no longer sufficient;
          it has become necessary to obtain accurate and detailed data about consumer
          behavior and market trends.
        </p>
        <p className="mb-4">
          Advanced market research helps companies develop products and services that better
          meet customer needs, leading to increased sales and improved overall company
          performance. These studies also enable decision-makers to identify potential
          risks and challenges before investing in new projects.
        </p>
        <p>
          Through the use of modern technologies in data collection and analysis,
          companies can gain deep insights into consumer behavior and market trends,
          helping them make more effective and proactive decisions.
        </p>
      </div>

      {/* Single Image */}
      <div className="mb-10">
        <img
          src={mainImage}
          alt="Market Data Analysis"
          className="w-full h-auto rounded-lg shadow-lg"
        />
        <p className="text-sm text-gray-500 mt-2 text-center">
          Market Data Analysis Using Modern Technologies
        </p>
      </div>

      {/* Additional Text */}
      <div className="prose max-w-none text-gray-700 mb-12">
        <p className="mb-4">
          To maximize the benefits of market research, companies must follow an organized
          methodology that includes defining study objectives, designing appropriate data
          collection tools, analyzing results accurately, and deriving practical
          recommendations.
        </p>
        <p>
          The process of conducting advanced market research requires specialized skills
          and experience in statistical analysis and consumer behavior understanding.
          Therefore, many companies seek the assistance of specialized experts in this
          field to ensure accurate and reliable results.
        </p>
      </div>

      {/* Bottom Three Images */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {bottomImages.map((image, index) => (
          <div key={index} className="overflow-hidden rounded-lg shadow-md">
            <img
              src={image}
              alt={`Illustration ${index + 1}`}
              className="w-full h-64 object-cover transition-transform duration-500 hover:scale-110"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ContentSection; 