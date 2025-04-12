import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getEducationResources, getEducationResourceCategories, setAPILanguage } from '../../services/api';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Filter, Tag, Search, X } from 'lucide-react';

export default function ResourcesPage() {
  const [resources, setResources] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortBy, setSortBy] = useState({ value: 'newest', label: 'Newest First' });
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  const [filteredResources, setFilteredResources] = useState([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  // Combine and deduplicate categories from both sources
  const uniqueCategories = React.useMemo(() => {
    const uniqueMap = new Map();

    // Add categories from the API
    if (Array.isArray(categories)) {
      categories.forEach(category => {
        if (category && category.id && category.name) {
          uniqueMap.set(category.id, {
            id: category.id,
            name: category.name,
            description: category.description
          });
        }
      });
    }

    // Add categories from resources
    resources.forEach(resource => {
      if (resource.categories && Array.isArray(resource.categories)) {
        resource.categories.forEach(category => {
          if (category && category.id && category.name && !uniqueMap.has(category.id)) {
            uniqueMap.set(category.id, {
              id: category.id,
              name: category.name,
              description: category.description
            });
          }
        });
      }
    });

    // Convert to array and sort by name
    return Array.from(uniqueMap.values())
      .sort((a, b) => a.name.localeCompare(b.name, i18n.language));
  }, [categories, resources, i18n.language]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setAPILanguage(i18n.language);
        const categoriesData = await getEducationResourceCategories();
        if (Array.isArray(categoriesData)) {
          setCategories(categoriesData);
        } else {
          console.error('Invalid categories data format:', categoriesData);
          setCategories([]);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, [i18n.language]);

  // Fetch resources
  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        setError(null);
        setAPILanguage(i18n.language);
        
        const response = await getEducationResources(
          currentPage,
          9,
          sortBy.value === 'newest' ? 'desc' : 'asc',
          'created_at',
          selectedCategory?.id || null
        );

        if (!response || !response.resources) {
          throw new Error('Invalid response format');
        }

        const resources = response.resources;
        
        // Apply local filtering for search query
        let filtered = resources;
        if (searchQuery.trim()) {
          filtered = filtered.filter(resource =>
            resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            resource.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        // Apply category filtering if a category is selected
        if (selectedCategory) {
          filtered = filtered.filter(resource =>
            resource.categories?.some(cat => cat.id === selectedCategory.id)
          );
        }

        setResources(resources);
        setFilteredResources(filtered);
        setTotalPages(Math.ceil(filtered.length / 9));
      } catch (error) {
        console.error('Error fetching resources:', error);
        setError(error.message || t('common.error', 'Failed to load content'));
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [currentPage, sortBy.value, selectedCategory, i18n.language, t]);

  // Update search effect to handle both search and category filtering
  useEffect(() => {
    let filtered = resources;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(resource =>
        resource.categories?.some(cat => cat.id === selectedCategory.id)
      );
    }

    setFilteredResources(filtered);
    setTotalPages(Math.ceil(filtered.length / 9));
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchQuery, selectedCategory, resources]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    setShowCategoryDropdown(false);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSortBy({ value: 'newest', label: t('resources.sortOptions.newest') });
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
      <h1 className="text-4xl font-bold text-center text-[#BB2632] mb-12">
        {t('resources.allResources', 'All Resources')}
      </h1>

      {/* Search and Filters */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('resources.searchPlaceholder', 'Search by title or description...')}
              className={`w-full ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BB2632] focus:border-transparent`}
            />
            <Search className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5`} />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-[#BB2632] font-semibold whitespace-nowrap"
          >
            <Filter className="w-5 h-5" />
            {t('resources.filterOptions', 'Filter Options')}
          </button>
        </div>

        {showFilters && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('resources.category', 'Category')}
                </label>
                <div className="relative">
                  <button
                    onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                    className="w-full p-2 border rounded-lg text-left flex justify-between items-center bg-white"
                  >
                    <span>{selectedCategory ? selectedCategory.name : t('resources.selectCategory', 'Select Category')}</span>
                    <ChevronRight className={`w-5 h-5 transform transition-transform ${showCategoryDropdown ? 'rotate-90' : ''} ${isRTL ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {showCategoryDropdown && uniqueCategories.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
                      {uniqueCategories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => handleCategorySelect(category)}
                          className={`w-full p-3 text-left hover:bg-gray-50 ${
                            selectedCategory?.id === category.id ? 'bg-blue-50 text-[#BB2632]' : ''
                          }`}
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('resources.sortBy', 'Sort By')}
                </label>
                <select
                  value={sortBy.value}
                  onChange={(e) => setSortBy({ value: e.target.value, label: e.target.options[e.target.selectedIndex].text })}
                  className="w-full p-2 border rounded-lg bg-white"
                >
                  <option value="newest">{t('resources.sortOptions.newest', 'Newest First')}</option>
                  <option value="oldest">{t('resources.sortOptions.oldest', 'Oldest First')}</option>
                </select>
              </div>
            </div>

            {/* Clear Filters */}
            {(searchQuery || selectedCategory || sortBy.value !== 'newest') && (
              <div className="flex justify-end mt-4">
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 text-[#BB2632] hover:text-red-700"
                >
                  <X className="w-5 h-5" />
                  {t('resources.clearFilters', 'Clear Filters')}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Resources Grid */}
      {filteredResources.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg mb-4">{t('resources.noResults', 'No resources found')}</p>
          <button
            onClick={clearFilters}
            className="px-6 py-2 bg-[#BB2632] text-white rounded-lg hover:bg-[#A31F29] transition-colors"
          >
            {t('resources.clearFilters', 'Clear Filters')}
          </button>
        </div>
      ) : (
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
                {/* Categories on image */}
                {resource.categories && resource.categories.length > 0 && (
                  <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
                    {resource.categories.map((category) => (
                      <div
                        key={category.id}
                        className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-2 shadow-sm"
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
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3 text-[#BB2632] hover:opacity-80 transition-opacity">
                  {resource.title}
                </h3>
                {resource.excerpt && (
                  <p className="text-gray-600 mb-4 line-clamp-3 bahnschrift text-[16px]">
                    {resource.excerpt}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12">
          <div className="flex justify-center items-center gap-4">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-full ${
                currentPage === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-[#BB2632] hover:bg-[#BB2632] hover:text-white'
              }`}
              aria-label={t('resources.previousPage', 'Previous page')}
            >
              {isRTL ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
            </button>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${
                    currentPage === page
                      ? 'bg-[#BB2632] text-white'
                      : 'text-[#BB2632] hover:bg-[#BB2632] hover:text-white'
                  }`}
                  aria-label={t('resources.pageNumber', 'Page {{number}}', { number: page })}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-full ${
                currentPage === totalPages
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-[#BB2632] hover:bg-[#BB2632] hover:text-white'
              }`}
              aria-label={t('resources.nextPage', 'Next page')}
            >
              {isRTL ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
            </button>
          </div>
          <p className="text-center text-gray-600 mt-4">
            {t('resources.pageInfo', 'Page {{current}} of {{total}}', {
              current: currentPage,
              total: totalPages
            })}
          </p>
        </div>
      )}
    </div>
  );
} 