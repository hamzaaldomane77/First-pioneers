import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getEducationResources, getEducationResourceCategories, setAPILanguage } from '../../services/api';
import { Tag, Search, X } from 'lucide-react';

export default function ResourcesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [resources, setResources] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        setAPILanguage(i18n.language);

        const [resourcesResponse, categoriesResponse] = await Promise.all([
          getEducationResources(currentPage, 10, 'desc', 'id', selectedCategory),
          getEducationResourceCategories()
        ]);

        setResources(resourcesResponse.resources);
        setCategories(categoriesResponse);
        setTotalPages(Math.ceil(resourcesResponse.pagination.total / 10));
      } catch (error) {
        console.error('Error fetching resources:', error);
        setError(error.message || t('common.error', 'Failed to load content'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, selectedCategory, i18n.language, t]);

  const handleCategoryClick = (categoryId) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
      searchParams.delete('category');
    } else {
      setSelectedCategory(categoryId);
      searchParams.set('category', categoryId);
    }
    setSearchParams(searchParams);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    searchParams.delete('category');
    setSearchParams(searchParams);
    setCurrentPage(1);
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
      <h1 className="text-4xl font-bold text-[#BB2632] mb-8 text-center">
        {isRTL ? 'الموارد التعليمية' : 'Educational Resources'}
      </h1>

      {/* Categories Filter */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            {isRTL ? 'تصفية حسب التصنيفات' : 'Filter by Categories'}
          </h2>
          {selectedCategory && (
            <button
              onClick={clearFilters}
              className="text-[#BB2632] hover:underline flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              {isRTL ? 'مسح التصفية' : 'Clear Filters'}
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`px-3 py-1 rounded-full flex items-center gap-2 transition-colors duration-300 ${
                selectedCategory === category.id
                  ? 'bg-[#BB2632] text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <Tag className="w-4 h-4" />
              <span className="text-sm font-medium">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {resources.map((resource) => (
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
              <h3 className="text-xl font-semibold mb-3 text-[#BB2632] hover:opacity-80 transition-opacity">
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${
                currentPage === page
                  ? 'bg-[#BB2632] text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 