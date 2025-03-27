import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getEducationResources, getEducationResourceCategories, setAPILanguage } from '../../services/api';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Filter, Tag, Search } from 'lucide-react';

export default function ResourcesPage() {
  const [resources, setResources] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredResources, setFilteredResources] = useState([]);

  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredResources(resources);
    } else {
      const filtered = resources.filter(resource =>
        resource.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredResources(filtered);
    }
  }, [searchQuery, resources]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setAPILanguage(i18n.language);
        const categoriesData = await getEducationResourceCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, [i18n.language]);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        setError(null);
        setAPILanguage(i18n.language);
        
        const { resources: resourcesData, pagination } = await getEducationResources(
          currentPage,
          9,
          sortDirection,
          sortBy,
          selectedCategory
        );
        
        setResources(resourcesData);
        setFilteredResources(resourcesData);
        setTotalPages(Math.ceil(pagination.total / 9));
      } catch (error) {
        console.error('Error fetching resources:', error);
        setError(error.message || t('common.error', 'Failed to load content'));
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [currentPage, sortDirection, sortBy, selectedCategory, i18n.language, t]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
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
        <div className="bg-red-500 bg-opacity-75 p-4 rounded-lg">
          <p className="text-white">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-6 md:px-12" dir={isRTL ? 'rtl' : 'ltr'}>
      <h1 className="text-4xl font-bold text-center text-[#BB2632] mb-12">
        {isRTL ? 'الموارد التعليمية' : 'Educational Resources'}
      </h1>

      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
          <div className="relative w-full md:w-96">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isRTL ? 'ابحث عن موارد...' : 'Search resources...'}
              className="w-full pl-12 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BB2632] focus:border-transparent"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-[#BB2632] font-semibold"
          >
            <Filter className="w-5 h-5" />
            {isRTL ? 'خيارات التصفية' : 'Filter Options'}
          </button>
        </div>

        {showFilters && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isRTL ? 'التصنيف' : 'Category'}
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">{isRTL ? 'جميع التصنيفات' : 'All Categories'}</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isRTL ? 'ترتيب حسب' : 'Sort By'}
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="created_at">{isRTL ? 'تاريخ الإنشاء' : 'Creation Date'}</option>
                  <option value="title">{isRTL ? 'العنوان' : 'Title'}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isRTL ? 'اتجاه الترتيب' : 'Sort Direction'}
                </label>
                <select
                  value={sortDirection}
                  onChange={(e) => setSortDirection(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="desc">{isRTL ? 'تنازلي' : 'Descending'}</option>
                  <option value="asc">{isRTL ? 'تصاعدي' : 'Ascending'}</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredResources.map((resource) => (
          <Link
            to={`/resources/${resource.id}`}
            key={resource.id}
            className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105"
          >
            <div className="relative h-48">
              <img
                src={resource.image}
                alt={resource.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-[#BB2632]">
                {resource.title}
              </h3>
              <p className="text-gray-600 mb-4 line-clamp-3">
                {resource.description}
              </p>
              {resource.categories && resource.categories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {resource.categories.map((category) => (
                    <div
                      key={category.id}
                      className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2"
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedCategory(category.id);
                        setCurrentPage(1);
                      }}
                    >
                      <Tag className="w-4 h-4 text-[#BB2632]" />
                      <span className="text-sm font-medium text-gray-700">
                        {category.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-12">
          <div className="flex justify-center items-center gap-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-full ${
                currentPage === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-[#BB2632] hover:bg-[#BB2632] hover:text-white'
              }`}
            >
              {isRTL ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
            </button>

            <div className="flex gap-2 overflow-x-auto px-4 max-w-xs md:max-w-md">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                    currentPage === page
                      ? 'bg-[#BB2632] text-white'
                      : 'text-[#BB2632] hover:bg-[#BB2632] hover:text-white'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-full ${
                currentPage === totalPages
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-[#BB2632] hover:bg-[#BB2632] hover:text-white'
              }`}
            >
              {isRTL ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
            </button>
          </div>
          <p className="text-center text-gray-600 mt-4">
            {isRTL 
              ? `الصفحة ${currentPage} من ${totalPages}`
              : `Page ${currentPage} of ${totalPages}`
            }
          </p>
        </div>
      )}
    </div>
  );
} 