import React, { useState, useEffect, useMemo } from 'react';
import Select from 'react-select';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { Search, ArrowRight, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getBlogs, setAPILanguage } from '../../services/api';
import { Link } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/pagination';

const BlogCard = ({ cover_image, title, categories, first_description, author_name, author_position, slug }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  return (
  <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
    <div className="w-full md:w-1/3 h-[200px] md:h-auto">
      <img 
          src={cover_image} 
        alt={title} 
        className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = t("blog.placeholderImage");
          }}
      />
    </div>
    
    <div className="w-full md:w-2/3 p-6 flex flex-col">
        {categories && categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {categories.map((category, index) => (
              <span
                key={index}
                className="text-sm text-[#BB2632] font-medium bg-red-50 px-3 py-1 rounded-full"
              >
                {category}
        </span>
            ))}
          </div>
        )}
        <h3 className="text-lg font-semibold mb-3 line-clamp-2">{title}</h3>
       
        <div className="mt-auto flex justify-between items-center ">
          <div className="text-sm text-gray-500">
            {author_name && <span className="block pb-2">{author_name}</span>}
            {author_position && <span className="block text-gray-400">{author_position}</span>}
         

          {first_description && (
          <p className="text-gray-600 text-sm mb-4 py-5">
            {first_description.split(' ').slice(0, 35).join(' ')}
            {first_description.split(' ').length > 35 ? '...' : ''}
          </p>
        )}
         </div>
          <Link 
            to={`/Blogdetails/${slug}`}
            className="inline-flex items-center text-[#BB2632] font-semibold hover:text-red-700 transition-colors duration-300 pt-32"
          >
            {t("blog.viewBlog")}
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

export default function AllBlog() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateFilter, setDateFilter] = useState({ value: 'newest', label: t('blog.filterOptions.newest') });
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);

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

  const filterOptions = useMemo(() => [
    { value: 'newest', label: t('blog.filterOptions.newest') },
    { value: 'oldest', label: t('blog.filterOptions.oldest') },
    { value: 'category', label: t('blog.filterOptions.byCategory') }
  ], [t]);

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

  // تحديث تسميات الفلترات عند تغيير اللغة
  useEffect(() => {
    setDateFilter(prev => ({
      ...prev,
      label: prev.value === 'newest' ? t('blog.filterOptions.newest') : prev.value === 'oldest' ? t('blog.filterOptions.oldest') : t('blog.filterOptions.byCategory')
    }));
  }, [t]);

  const filteredBlogs = useMemo(() => {
    let filtered = [...blogs];

    // تطبيق البحث
    if (searchQuery) {
      filtered = filtered.filter(blog => 
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.first_description?.toLowerCase().includes(searchQuery.toLowerCase())
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
        return b.id - a.id;
      } else if (dateFilter.value === 'oldest') {
        return a.id - b.id;
      } else if (dateFilter.value === 'category') {
        // ترتيب حسب اسم أول تصنيف
        const categoryA = a.categories[0] || '';
        const categoryB = b.categories[0] || '';
        return categoryA.localeCompare(categoryB, i18n.language);
      }
      return 0;
    });

    return filtered;
  }, [blogs, searchQuery, selectedCategories, dateFilter, i18n.language]);

  // حساب عدد الصفحات
  const totalPages = Math.ceil(filteredBlogs.length / 6);

  const currentBlogs = filteredBlogs.slice(currentPage * 6, (currentPage + 1) * 6);

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
        {t('blog.stayInformed')}
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
                setSelectedCategories(selected);
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
                setCurrentPage(0);
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
      </div>

   
      {currentBlogs.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          {t('blog.noArticles')}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6">
            {currentBlogs.map((blog) => (
                    <BlogCard key={blog.id} {...blog} />
                  ))}
                </div>

          {/* ترقيم الصفحات */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }).reverse().map((_, index) => {
                  const pageNumber = totalPages - index;
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber - 1)}
                      className={`w-10 h-10 rounded-full ${
                        currentPage === pageNumber - 1
                          ? 'bg-[#BB2632] text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      } text-center flex items-center justify-center text-sm font-medium transition-colors duration-300`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>
        </div>
          )}
        </>
      )}
    </div>
  );
}
