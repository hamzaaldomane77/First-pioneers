import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getBlogs, setAPILanguage } from '../../services/api';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';
import { Search, ArrowRight, ArrowLeft, SlidersHorizontal, X } from 'lucide-react';
import parse from 'html-react-parser';

// مكون بطاقة المدونة
const BlogCard = ({ blog, isRTL }) => {
  const { t } = useTranslation();
  
  return (
    <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="w-full md:w-1/3 h-[200px] md:h-auto">
        <img 
          src={blog.cover_image} 
          alt={blog.title} 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = t("blog.placeholderImage");
          }}
        />
      </div>
      
      <div className="w-full md:w-2/3 p-6 flex flex-col">
        {blog.categories && blog.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {blog.categories.map((category, index) => (
              <span
                key={index}
                className="text-sm text-[#BB2632] font-medium bg-red-50 px-3 py-1 rounded-full"
              >
                {category}
              </span>
            ))}
          </div>
        )}
        
        <h3 className="text-lg font-semibold mb-3 line-clamp-2">{blog.title}</h3>
        
        <div className="mt-auto flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {blog.author_name && <span className="block pb-2">{blog.author_name}</span>}
            {blog.author_position && <span className="block text-gray-400">{blog.author_position}</span>}
            
            {blog.excerpt && (
              <p className="text-gray-600 text-sm mb-4 py-5 bahnschrift text-[16px] line-clamp-2">
                {blog.excerpt}
              </p>
            )}
          </div>
          
          <Link 
            to={`/Blogdetails/${blog.slug}`}
            className="inline-flex items-center text-[#BB2632] font-semibold hover:text-red-700 transition-colors duration-300 pt-32 text-[15px]"
          >
            {t("blog.viewarticle")}
            {isRTL ? (
              <ArrowLeft className="w-4 h-4 mr-2" />
            ) : (
              <ArrowRight className="w-4 h-4 ml-2" />
            )}
          </Link>
        </div>
      </div>
    </div>
  );
};

const AllBlog = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // حالة البحث والتصفية
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [dateFilter, setDateFilter] = useState({ value: 'newest', label: t('blog.filterOptions.newest') });
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError(null);
        // تحديث لغة API قبل جلب البيانات
        setAPILanguage(i18n.language);
        const data = await getBlogs();
        setBlogs(data);
        setCurrentPage(0); // إعادة تعيين الصفحة الحالية عند تحديث البيانات
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlogs();
  }, [i18n.language]);

  // استخراج جميع التصنيفات الفريدة
  const uniqueCategories = useMemo(() => {
    if (!blogs.length) return [];
    const categories = new Set();
    blogs.forEach(blog => {
      blog.categories.forEach(category => categories.add(category));
    });
    return Array.from(categories).map(category => ({
      value: category,
      label: category
    }));
  }, [blogs]);

  // تحديث تسميات الفلترات عند تغيير اللغة
  useEffect(() => {
    setDateFilter(prev => ({
      ...prev,
      label: prev.value === 'newest' ? t('blog.filterOptions.newest') : t('blog.filterOptions.oldest')
    }));
  }, [t]);

  const filterOptions = useMemo(() => [
    { value: 'newest', label: t('blog.filterOptions.newest') },
    { value: 'oldest', label: t('blog.filterOptions.oldest') }
  ], [t]);

  // تطبيق التصفية
  const filteredBlogs = useMemo(() => {
    let filtered = [...blogs];
    
    // تطبيق البحث
    if (searchQuery) {
      filtered = filtered.filter(blog => 
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // تطبيق فلتر التصنيفات
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(blog => 
        selectedCategories.every(cat => 
          blog.categories.includes(cat.value)
        )
      );
    }
    
    // تطبيق الترتيب
    filtered.sort((a, b) => {
      if (dateFilter.value === 'newest') {
        return new Date(b.created_at) - new Date(a.created_at);
      } else if (dateFilter.value === 'oldest') {
        return new Date(a.created_at) - new Date(b.created_at);
      }
      return 0;
    });

    return filtered;
  }, [blogs, searchQuery, selectedCategories, dateFilter]);

  // حساب عدد الصفحات
  const totalPages = Math.ceil(filteredBlogs.length / 6);
  
  // الحصول على المدونات الحالية للصفحة
  const currentBlogs = filteredBlogs.slice(currentPage * 6, (currentPage + 1) * 6);
  
  // مسح التصفية
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setDateFilter({ value: 'newest', label: t('blog.filterOptions.newest') });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#BB2632]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12" dir={isRTL ? 'rtl' : 'ltr'}>
      <h1 className="text-center text-3xl font-bold text-[#BB2632] mb-8">
        {t('blog.allBlogsTitle')}
      </h1>
      
      {/* فلترات البحث */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('blog.searchArticles')}
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(0);
                }}
                placeholder={t('blog.searchPlaceholder')}
                className={`w-full p-2 ${isRTL ? 'pr-4 pl-10' : 'pl-4 pr-10'} border border-gray-300 rounded-md focus:outline-none focus:border-[#BB2632]`}
              />
              <Search className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-1/2 transform -translate-y-1/2 text-gray-400`} size={20} />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('blog.filterOptions.byCategory')}
            </label>
            <Select
              isMulti
              options={uniqueCategories}
              value={selectedCategories}
              onChange={(selected) => {
                setSelectedCategories(selected || []);
                setCurrentPage(0);
              }}
              noOptionsMessage={() => t('blog.filterOptions.noOptions')}
              className={`basic-multi-select ${isRTL ? 'rtl-select' : ''}`}
              classNamePrefix="select"
              theme={(theme) => ({
                ...theme,
                direction: isRTL ? 'rtl' : 'ltr',
              })}
              styles={{
                control: (base) => ({
                  ...base,
                  padding: '2px',
                  textAlign: isRTL ? 'right' : 'left',
                }),
                placeholder: (base) => ({
                  ...base,
                  textAlign: isRTL ? 'right' : 'left',
                  marginLeft: isRTL ? 'auto' : '0',
                  marginRight: isRTL ? '0' : 'auto',
                }),
                option: (base) => ({
                  ...base,
                  textAlign: isRTL ? 'right' : 'left',
                  direction: isRTL ? 'rtl' : 'ltr',
                }),
                multiValue: (base) => ({
                  ...base,
                  direction: isRTL ? 'rtl' : 'ltr',
                }),
              }}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('blog.sortBy')}
            </label>
            <Select
              options={filterOptions}
              value={dateFilter}
              onChange={(selected) => {
                setDateFilter(selected);
              }}
              placeholder={t('blog.filterOptions.selectSorting')}
              className={`${isRTL ? 'rtl-select' : ''}`}
              classNamePrefix="select"
              theme={(theme) => ({
                ...theme,
                direction: isRTL ? 'rtl' : 'ltr',
              })}
              styles={{
                control: (base) => ({
                  ...base,
                  padding: '2px',
                  textAlign: isRTL ? 'right' : 'left',
                }),
                placeholder: (base) => ({
                  ...base,
                  textAlign: isRTL ? 'right' : 'left',
                  marginLeft: isRTL ? 'auto' : '0',
                  marginRight: isRTL ? '0' : 'auto',
                }),
                option: (base) => ({
                  ...base,
                  textAlign: isRTL ? 'right' : 'left',
                  direction: isRTL ? 'rtl' : 'ltr',
                }),
              }}
            />
          </div>
        </div>
        
        {/* زر مسح الفلاتر */}
        {(searchQuery || selectedCategories.length > 0 || dateFilter.value !== 'newest') && (
          <div className="mt-4 flex justify-end">
            <button 
              onClick={clearFilters}
              className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-[#BB2632] rounded-lg transition"
            >
              <X className="w-5 h-5" />
              {t('blog.filterOptions.clearFilters')}
            </button>
          </div>
        )}
        
        {/* عرض عدد النتائج */}
        <div className="mt-4 text-gray-600">
          {t('blog.filterOptions.showing')} {filteredBlogs.length} {t('blog.filterOptions.of')} {blogs.length} {t('blog.filterOptions.blogs')}
        </div>
      </div>
      
      {/* قائمة المدونات */}
      {currentBlogs.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <p className="text-gray-500 text-lg">{t('blog.filterOptions.noResults')}</p>
          <button 
            onClick={clearFilters}
            className="mt-4 px-6 py-2 bg-[#BB2632] text-white rounded-lg hover:bg-red-700 transition"
          >
            {t('blog.filterOptions.clearFilters')}
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6">
            {currentBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} isRTL={isRTL} />
            ))}
          </div>
          
          {/* ترقيم الصفحات */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index)}
                    className={`w-10 h-10 rounded-full ${
                      currentPage === index
                        ? 'bg-[#BB2632] text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    } text-center flex items-center justify-center text-sm font-medium transition-colors duration-300`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AllBlog;
