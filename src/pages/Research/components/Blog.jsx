import { ArrowRight } from "lucide-react";
import React from "react";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";

const blogPosts = [
  {
    image: "https://creativeschoolarabia.com/wp-content/uploads/2019/02/Moon-lunar-full-moon-amazing-creative-school-arabia-%D8%B5%D9%88%D8%B1%D8%A9-%D9%84%D9%84%D9%82%D9%85%D8%B1-%D8%AA%D8%B5%D9%88%D9%8A%D8%B1-%D8%A7%D9%84%D9%82%D9%85%D8%B1-%D8%AA%D8%B5%D9%88%D9%8A%D8%B1-%D9%81%D9%88%D8%AA%D9%88%D8%BA%D8%B1%D8%A7%D9%81%D9%8A-%D8%B5%D9%88%D8%B1%D8%A9-%D9%84%D9%84%D9%82%D9%85%D8%B1-%D9%85%D9%83%D9%88%D9%86%D8%A9-%D9%85%D9%86-50-%D8%A7%D9%84%D9%81-%D8%B5%D9%88%D8%B1%D8%A9-%D8%AA%D9%85-%D8%AA%D8%AC%D9%85%D9%8A%D8%B9%D9%87%D8%A7-%D8%A8%D8%A7%D9%84%D9%81%D9%88%D8%AA%D9%88%D8%B4%D9%88%D8%A84.jpg",
   
    title: "How to Conduct Effective Consumer Research: A Beginner's Guide",
    author: "Michael Carter, Research Methodology Expert",
    content:
      "Consumer research is the backbone of any successful marketing strategy, but getting it right can be challenging... Consumer research is the backbone of any successful marketing strategy, but getting it right can be challenging...Consumer research is the backbone of any successful marketing strategy, but getting it right can be challenging...Consumer research is the backbone of any successful marketing strategy, but getting it right can be challenging...Consumer research is the backbone of any successful marketing strategy, but getting it right can be challenging...",
    link: "#",
  },
  {
    image: "https://creativeschoolarabia.com/wp-content/uploads/2019/02/Moon-lunar-full-moon-amazing-creative-school-arabia-%D8%B5%D9%88%D8%B1%D8%A9-%D9%84%D9%84%D9%82%D9%85%D8%B1-%D8%AA%D8%B5%D9%88%D9%8A%D8%B1-%D8%A7%D9%84%D9%82%D9%85%D8%B1-%D8%AA%D8%B5%D9%88%D9%8A%D8%B1-%D9%81%D9%88%D8%AA%D9%88%D8%BA%D8%B1%D8%A7%D9%81%D9%8A-%D8%B5%D9%88%D8%B1%D8%A9-%D9%84%D9%84%D9%82%D9%85%D8%B1-%D9%85%D9%83%D9%88%D9%86%D8%A9-%D9%85%D9%86-50-%D8%A7%D9%84%D9%81-%D8%B5%D9%88%D8%B1%D8%A9-%D8%AA%D9%85-%D8%AA%D8%AC%D9%85%D9%8A%D8%B9%D9%87%D8%A7-%D8%A8%D8%A7%D9%84%D9%81%D9%88%D8%AA%D9%88%D8%B4%D9%88%D8%A84.jpg",
   
    title: "How to Conduct Effective Consumer Research: A Beginner's Guide",
    author: "Michael Carter, Research Methodology Expert",
    content:
      "Consumer research is the backbone of any successful marketing strategy, but getting it right can be challenging... Consumer research is the backbone of any successful marketing strategy, but getting it right can be challenging...Consumer research is the backbone of any successful marketing strategy, but getting it right can be challenging...Consumer research is the backbone of any successful marketing strategy, but getting it right can be challenging...Consumer research is the backbone of any successful marketing strategy, but getting it right can be challenging...",
    link: "#",
  },  
  {
    image: "https://source.unsplash.com/600x400/?technology,innovation",
  
    title: "The Future of AI in Business: Opportunities & Challenges",
    author: "Sarah Johnson, AI Specialist",
    content:
      "Artificial intelligence is revolutionizing industries worldwide. This article explores the latest AI trends...",
    link: "#",
  },
  {
    image: "https://source.unsplash.com/600x400/?finance,investment",
    
    title: "Top Investment Strategies for 2024",
    author: "David Smith, Financial Analyst",
    content:
      "Investing wisely requires knowledge and strategy. Here are the top investment approaches to maximize returns...",
    link: "#",
  },
];

export default function Blog() {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  return (
    <section
      className={`min-h-[450px] flex flex-col items-center justify-center px-6 py-20 transition-all duration-1000 ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
      }`}
      ref={ref}
    >
      <h2 className="text-center text-3xl font-bold text-[#BB2632] mb-8 pb-11">
        Stay Informed with Our Blog
      </h2>

      
      <div className="grid grid-cols-1 gap-8 max-w-5xl">
        {blogPosts.slice(0, 3).map((post, index) => (
          <article 
            key={`blog-post-${index}`}
            className="flex flex-col md:flex-row bg-white rounded-xl shadow-2xl overflow-hidden hover:shadow-[0_20px_50px_rgba(187,38,50,0.2)] transition-all duration-300 group"
          >
            <div className="md:w-1/3 overflow-hidden">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>

            <div className="md:w-2/3 pl-4 flex flex-col">
              <p className="text-sm text-[#BB2632] pt-6">Social Media - Consumer Markets - Sales</p>
              <h2 className="text-xl font-bold text-gray-800 transition-colors duration-300 group-hover:text-[#BB2632] pt-7">
                {post.title}
              </h2>
              <p className="text-sm text-gray-600 italic pt-10">{post.author}</p>
              <p className="text-gray-700 mt-2 pt-7 text-sm">{post.content}</p>
              
              <Link
                to={post.link}
                className="text-[#BB2632] font-semibold relative inline-block pb-4 text-end pr-6 pt-4"
              >
                View Article
                <span className="absolute left-[545px] bottom-4 w-0 h-[2px] bg-[#BB2632] transition-all duration-500 group-hover:w-[95px]"></span>
              </Link>
            </div>
          </article>
        ))}
      </div>
      <div className='text-[#BB2632] text-center mt-8 p-12'>
        <Link 
          to="/AllBlog" 
          className="hover:text-[#BB2632] flex justify-center items-center gap-2 transition-all duration-500 group"
        >
          View All Blogs
          <ArrowRight className="w-5 h-5 text-[#BB2632] transition-all duration-500" />
        </Link>
      </div>
    </section>
  );
}
