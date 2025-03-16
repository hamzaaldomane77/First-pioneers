import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import "./Blog.css"
// توسيع بيانات المقالات مع المزيد من العلامات والتواريخ
const blogData = [
  {
    id: 1,
    image: "https://modo3.com/thumbs/fit630x300/38504/1637571438/%D9%85%D8%A7_%D9%87%D9%8A_%D8%A3%D9%86%D9%88%D8%A7%D8%B9_%D8%A7%D9%84%D8%B4%D8%A8%D9%83%D8%A7%D8%AA.jpg",
    title: "How to Conduct Effective Market Research",
    tag: "Market Research",
    tags: ["markets", "research", "business"],
    date: "2024-03-01",
    views: 1500,
    description: "Learn the essential steps and methodologies for conducting effective market research that drives business growth and innovation...",
  },
  {
    id: 2,
    image: "https://source.unsplash.com/600x400/?marketing",
    title: "Understanding Consumer Behavior",
    tag: "Consumers",
    tags: ["consumers", "social_media", "sales"],
    date: "2024-02-28",
    views: 2000,
    description: "Dive deep into the psychology of consumer behavior and learn how to leverage these insights for your business strategy...",
  },
  {
    id: 3,
    image: "https://source.unsplash.com/600x400/?social-media",
    title: "Social Media Marketing Strategies",
    tag: "Social Media",
    tags: ["social_media", "marketing", "digital"],
    date: "2024-02-25",
    views: 1800,
    description: "Explore effective social media marketing strategies that can help boost your brand's online presence and engagement...",
  },
  {
    id: 4,
    image: "https://source.unsplash.com/600x400/?sales",
    title: "Boosting Sales Through Digital Channels",
    tag: "Sales",
    tags: ["sales", "digital", "business"],
    date: "2024-02-20",
    views: 2200,
    description: "Learn how to leverage digital channels to increase your sales and reach a wider audience in today's competitive market...",
  },
  {
    id: 5,
    image: "https://source.unsplash.com/600x400/?consumer-research",
    title: "Consumer Research Techniques",
    tag: "Consumers",
    tags: ["consumers", "research", "markets"],
    date: "2024-02-15",
    views: 1600,
    description: "Discover modern techniques for conducting consumer research and gathering valuable insights about your target audience...",
  },
  {
    id: 6,
    image: "https://source.unsplash.com/600x400/?market-analysis",
    title: "Market Analysis Fundamentals",
    tag: "Market Research",
    tags: ["markets", "analysis", "business"],
    date: "2024-02-10",
    views: 1900,
    description: "Master the fundamentals of market analysis and learn how to make data-driven decisions for your business...",
  },
  {
    id: 7,
    image: "https://source.unsplash.com/600x400/?digital-marketing",
    title: "Digital Marketing Trends 2024",
    tag: "Social Media",
    tags: ["social_media", "digital", "marketing"],
    date: "2024-02-05",
    views: 2500,
    description: "Stay ahead of the curve with the latest digital marketing trends and strategies for 2024...",
  },
  {
    id: 8,
    image: "https://source.unsplash.com/600x400/?sales-strategy",
    title: "Sales Strategy Optimization",
    tag: "Sales",
    tags: ["sales", "strategy", "business"],
    date: "2024-02-01",
    views: 1700,
    description: "Learn how to optimize your sales strategy and increase conversion rates through proven methodologies...",
  },
  {
    id: 9,
    image: "https://source.unsplash.com/600x400/?market-trends",
    title: "Emerging Market Trends",
    tag: "Market Research",
    tags: ["markets", "trends", "analysis"],
    date: "2024-01-28",
    views: 2100,
    description: "Explore emerging market trends and learn how to position your business for future success...",
  },
  {
    id: 10,
    image: "https://source.unsplash.com/600x400/?consumer-behavior",
    title: "Modern Consumer Behavior Analysis",
    tag: "Consumers",
    tags: ["consumers", "behavior", "research"],
    date: "2024-01-25",
    views: 1850,
    description: "Understanding modern consumer behavior patterns and their impact on business strategies...",
  },
  {
    id: 11,
    image: "https://source.unsplash.com/600x400/?social-strategy",
    title: "Social Media Success Stories",
    tag: "Social Media",
    tags: ["social_media", "success", "case_studies"],
    date: "2024-01-20",
    views: 2300,
    description: "Real-world examples of successful social media marketing campaigns and what we can learn from them...",
  },
  {
    id: 11,
    image: "https://source.unsplash.com/600x400/?social-strategy",
    title: "Social Media Success Stories",
    tag: "Social Media",
    tags: ["social_media", "success", "case_studies"],
    date: "2024-01-20",
    views: 2300,
    description: "Real-world examples of successful social media marketing campaigns and what we can learn from them...",
  },
  {
    id: 11,
    image: "https://source.unsplash.com/600x400/?social-strategy",
    title: "Social Media Success Stories",
    tag: "Social Media",
    tags: ["social_media", "success", "case_studies"],
    date: "2024-01-20",
    views: 2300,
    description: "Real-world examples of successful social media marketing campaigns and what we can learn from them...",
  },
  {
    id: 11,
    image: "https://source.unsplash.com/600x400/?social-strategy",
    title: "Social Media Success Stories",
    tag: "Social Media",
    tags: ["social_media", "success", "case_studies"],
    date: "2024-01-20",
    views: 2300,
    description: "Real-world examples of successful social media marketing campaigns and what we can learn from them...",
  },
  {
    id: 11,
    image: "https://source.unsplash.com/600x400/?social-strategy",
    title: "Social Media Success Stories",
    tag: "Social Media",
    tags: ["social_media", "success", "case_studies"],
    date: "2024-01-20",
    views: 2300,
    description: "Real-world examples of successful social media marketing campaigns and what we can learn from them...",
  },
  
  {
    id: 12,
    image: "https://source.unsplash.com/600x400/?sales-success",
    title: "Building a Strong Sales Team",
    tag: "Sales",
    tags: ["sales", "team", "management"],
    date: "2024-01-15",
    views: 1950,
    description: "Essential strategies for building and managing a high-performing sales team in today's market...",
  }
];

const filterOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'most_read', label: 'Most Read' }
];

const tagOptions = [
  { value: 'consumers', label: 'Consumers' },
  { value: 'markets', label: 'Markets' },
  { value: 'social_media', label: 'Social Media' },
  { value: 'sales', label: 'Sales' }
];

// مكون البطاقة
const BlogCard = ({ image, title, tag, description }) => (
  <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
    {/* حاوية الصورة */}
    <div className="w-full md:w-1/3 h-[200px] md:h-auto">
      <img 
        src={image} 
        alt={title} 
        className="w-full h-full object-cover"
      />
    </div>
    
    {/* حاوية المحتوى */}
    <div className="w-full md:w-2/3 p-6 flex flex-col">
      <div className="mb-3">
        <span className="inline-block px-3 py-1 text-xs font-semibold text-[#BB2632] bg-red-50 rounded-full">
          {tag}
        </span>
      </div>
      <h3 className="text-lg font-semibold mb-3 line-clamp-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{description}</p>
      <button className="mt-auto text-[#BB2632] font-semibold hover:text-red-700 transition-colors duration-300">
        View Article
      </button>
    </div>
  </div>
);

export default function AllBlog() {
  const [dateFilter, setDateFilter] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBlogData, setFilteredBlogData] = useState(blogData);

  // وظيفة التصفية
  const filterBlogs = () => {
    let filtered = [...blogData];

  
    if (searchQuery) {
      filtered = filtered.filter(blog => 
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }


    if (selectedTags.length > 0) {
      filtered = filtered.filter(blog => 
        selectedTags.some(tag => blog.tags.includes(tag.value))
      );
    }

    
    if (dateFilter) {
      switch (dateFilter.value) {
        case 'newest':
          filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
          break;
        case 'oldest':
          filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
          break;
        case 'most_read':
          filtered.sort((a, b) => b.views - a.views);
          break;
        default:
          break;
      }
    }

    setFilteredBlogData(filtered);
  };

  
  useEffect(() => {
    filterBlogs();
  }, [dateFilter, selectedTags, searchQuery]);

  const customStyles = {
    control: (base) => ({
      ...base,
      borderColor: '#e5e7eb',
      '&:hover': {
        borderColor: '#BB2632'
      }
    }),
    option: (base, { isFocused, isSelected }) => ({
      ...base,
      backgroundColor: isSelected ? '#BB2632' : isFocused ? 'rgba(187, 38, 50, 0.1)' : null,
      color: isSelected ? 'white' : '#374151'
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: 'rgba(187, 38, 50, 0.1)'
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: '#BB2632'
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: '#BB2632',
      ':hover': {
        backgroundColor: '#BB2632',
        color: 'white'
      }
    })
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-26">
      <h1 className='text-center text-3xl py-8'>Stay Informed with Our Blog</h1>
      
      
      <div className="bg-white rounded-lg shadow-md px-10  mb-8 ">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-24 relative  z-20">
          
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2 z-30">
              Search Articles
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full p-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:border-[#BB2632]"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>

        
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <Select
              options={filterOptions}
              value={dateFilter}
              onChange={setDateFilter}
              styles={customStyles}
              placeholder="Select sorting option..."
              isClearable
            />
          </div>

        
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Tags
            </label>
            <Select
              options={tagOptions}
              value={selectedTags}
              onChange={setSelectedTags}
              styles={customStyles}
              placeholder="Select tags..."
              isMulti
            />
          </div>
        </div>
      </div>

   
      {filteredBlogData.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No articles found matching your criteria.
        </div>
      ) : (
        <div className="relative">
          <Swiper
            modules={[Pagination]}
            pagination={{
              clickable: true,
              renderBullet: function (index, className) {
                return `<span class="${className}">${index + 1}</span>`;
              },
            }}
            slidesPerView={1}
            spaceBetween={30}
            className="blog-swiper"
          >
            {Array.from({ length: Math.ceil(filteredBlogData.length / 6) }).map((_, pageIndex) => (
              <SwiperSlide key={pageIndex}>
                <div className="grid grid-cols-1 gap-y-14">
                  {filteredBlogData.slice(pageIndex * 6, (pageIndex + 1) * 6).map((blog) => (
                    <BlogCard key={blog.id} {...blog} />
                  ))}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  );
}
