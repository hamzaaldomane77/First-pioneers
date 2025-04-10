import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { getBlogs, setAPILanguage } from '../../services/api';

const AllBlog = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError(null);
        setAPILanguage(i18n.language);
        const blogsData = await getBlogs();
        setBlogs(blogsData);

        // استخراج جميع الفئات الفريدة من المدونات
        const allCategories = new Set();
        blogsData.forEach(blog => {
          if (blog.categories && blog.categories.length > 0) {
            blog.categories.forEach(category => allCategories.add(category));
          }
        });
        setCategories(Array.from(allCategories));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [i18n.language]);

  const filterBlogsByCategory = () => {
    if (selectedCategory === 'all') {
      return blogs;
    }
    return blogs.filter(blog => 
      blog.categories && blog.categories.includes(selectedCategory)
    );
  };

  const filteredBlogs = filterBlogsByCategory();

  if (loading) {
    return (
      <div className="container mx-auto px-4 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#BB2632]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12" dir={isRTL ? 'rtl' : 'ltr'}>
      <h1 className="text-3xl font-bold mb-8 text-center">{t('blog.title')}</h1>
      
      {/* فلتر الفئات */}
      <div className="mb-10 flex flex-wrap justify-center gap-3">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-full transition-colors duration-200 ${
            selectedCategory === 'all' 
              ? 'bg-[#BB2632] text-white' 
              : 'bg-white text-[#BB2632] border border-[#BB2632]'
          }`}
        >
          {t('blog.allCategories')}
        </button>
        
        {categories.map((category, index) => (
          <button
            key={index}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full transition-colors duration-200 ${
              selectedCategory === category 
                ? 'bg-[#BB2632] text-white' 
                : 'bg-white text-[#BB2632] border border-[#BB2632]'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      
      {/* عرض المقالات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredBlogs.length > 0 ? (
          filteredBlogs.map((blog) => (
            <Link 
              to={`/blog/${blog.slug}`} 
              key={blog.id}
              className="bg-white rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:shadow-xl hover:-translate-y-2"
            >
              <div className="aspect-w-16 aspect-h-10 overflow-hidden">
                <img
                  src={blog.cover_image}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-6">
                {/* التصنيفات */}
                {blog.categories && blog.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {blog.categories.slice(0, 2).map((category, index) => (
                      <span
                        key={index}
                        className="bg-white text-[#BB2632] border border-[#BB2632] px-3 py-1 rounded-full text-xs font-medium"
                      >
                        {category}
                      </span>
                    ))}
                    {blog.categories.length > 2 && (
                      <span className="text-[#BB2632] text-xs font-medium">
                        +{blog.categories.length - 2}
                      </span>
                    )}
                  </div>
                )}
                
                {/* العنوان */}
                <h2 className="text-xl font-semibold mb-4 line-clamp-2">{blog.title}</h2>
                
                {/* المقتطف */}
                <p className="text-gray-600 mb-4 line-clamp-3">{blog.excerpt}</p>
                
                {/* معلومات الكاتب */}
                <div className="flex items-center mt-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-gray-600">
                      {blog.author_name && blog.author_name.charAt(0)}
                    </span>
                  </div>
                  <div className="ml-3 rtl:mr-3 rtl:ml-0">
                    <p className="text-sm font-medium">{blog.author_name}</p>
                    {blog.author_position && (
                      <p className="text-xs text-gray-500">{blog.author_position}</p>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-600">{t('blog.noBlogs')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllBlog;
