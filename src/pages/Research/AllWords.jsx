import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getWordsInMarkets, getWordInMarketCategories, setAPILanguage } from '../../services/api';
import { ChevronLeft, ChevronRight, Filter, Tag, Search, X } from 'lucide-react';

const AllWords = () => {
    const [words, setWords] = useState([]);
    const [filteredWords, setFilteredWords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState({ value: 'newest', label: 'Newest First' });
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [showFilters, setShowFilters] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const wordsPerPage = 9;
    
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';

    // Combine and deduplicate categories from both sources
    const uniqueCategories = useMemo(() => {
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

        // Add categories from words
        words.forEach(word => {
            if (word.categories && Array.isArray(word.categories)) {
                word.categories.forEach(category => {
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
    }, [categories, words, i18n.language]);

    // Fetch words and categories
    const fetchWordsAndCategories = useCallback(async () => {
            try {
                setLoading(true);
                setError(null);
                setAPILanguage(i18n.language);
                
            // Fetch words and categories in parallel
            const [wordsData, categoriesData] = await Promise.all([
                getWordsInMarkets(),
                getWordInMarketCategories()
            ]);
            
            if (Array.isArray(wordsData)) {
                // Process and set words
                setWords(wordsData);
                setFilteredWords(wordsData);
                setTotalPages(Math.ceil(wordsData.length / wordsPerPage));
            } else {
                throw new Error('Invalid words data format');
            }
            
            // Process and set categories
            if (Array.isArray(categoriesData)) {
                setCategories(categoriesData);
            }
            
            } catch (error) {
                console.error('Error in AllWords component:', error);
            setError(error.message || t('common.error', 'Failed to load content'));
            } finally {
                setLoading(false);
            }
    }, [i18n.language, t, wordsPerPage]);

    useEffect(() => {
        fetchWordsAndCategories();
    }, [fetchWordsAndCategories]);

    // Handle category selection
    const handleCategorySelect = useCallback((category) => {
        setSelectedCategory(category);
        setCurrentPage(1);
        setShowCategoryDropdown(false);
    }, []);

    // Apply search and sort filters
    useEffect(() => {
        if (!words.length) return;
        
        let result = [...words];
        
        // Apply search by title or excerpt
        if (searchTerm) {
            const searchTermLower = searchTerm.toLowerCase();
            result = result.filter(word => 
                (word.title && word.title.toLowerCase().includes(searchTermLower)) ||
                (word.excerpt && word.excerpt.toLowerCase().includes(searchTermLower))
            );
        }

        // Apply category filtering
        if (selectedCategory) {
            result = result.filter(word => 
                word.categories?.some(cat => cat.id === selectedCategory.id)
            );
        }

        // Apply sorting
        if (sortBy.value === 'newest') {
            result.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
        } else if (sortBy.value === 'oldest') {
            result.sort((a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0));
        }

        setFilteredWords(result);
        setTotalPages(Math.ceil(result.length / wordsPerPage));
        
        // If current page is now invalid, reset to page 1
        if (currentPage > Math.ceil(result.length / wordsPerPage)) {
            setCurrentPage(1);
        }
    }, [searchTerm, sortBy.value, selectedCategory, words, currentPage, wordsPerPage]);

    // Clear all filters
    const clearFilters = useCallback(() => {
        setSearchTerm('');
        setSelectedCategory(null);
        setSortBy({ value: 'newest', label: t('blog.filterOptions.newest', 'Newest First') });
        setCurrentPage(1);
    }, [t]);

    // Get current words for pagination
    const currentWords = useMemo(() => {
        const indexOfLastWord = currentPage * wordsPerPage;
        const indexOfFirstWord = indexOfLastWord - wordsPerPage;
        return filteredWords.slice(indexOfFirstWord, indexOfLastWord);
    }, [filteredWords, currentPage, wordsPerPage]);

    // Change page
    const paginate = useCallback((pageNumber) => {
        setCurrentPage(pageNumber);
        // Scroll to top of the page for better UX
        window.scrollTo(0, 0);
    }, []);

    const nextPage = useCallback(() => {
        if (currentPage < totalPages) {
            paginate(currentPage + 1);
        }
    }, [currentPage, totalPages, paginate]);

    const prevPage = useCallback(() => {
        if (currentPage > 1) {
            paginate(currentPage - 1);
        }
    }, [currentPage, paginate]);

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
                    {isRTL ? 'كلمات في الأسواق' : 'Words In Markets'}
                </h1>

            {/* Search and Filters */}
            <div className="max-w-6xl mx-auto mb-8">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
                    {/* Search Input */}
                    <div className="relative w-full md:w-96">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={isRTL ? 'ابحث حسب العنوان أو الوصف...' : 'Search by title or description...'}
                            className={`w-full ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BB2632] focus:border-transparent`}
                        />
                        <Search className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5`} />
                    </div>

                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 text-[#BB2632] font-semibold whitespace-nowrap"
                    >
                        <Filter className="w-5 h-5" />
                        {isRTL ? 'خيارات التصفية' : 'Filter Options'}
                    </button>
                </div>

                {showFilters && (
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Category Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {isRTL ? 'التصنيف' : 'Category'}
                                </label>
                                <div className="relative">
                                    <button
                                        onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                                        className="w-full p-2 border rounded-lg text-left flex justify-between items-center bg-white"
                                    >
                                        <span>{selectedCategory ? selectedCategory.name : (isRTL ? 'اختر التصنيف' : 'Select Category')}</span>
                                        <ChevronRight className={`w-5 h-5 transform transition-transform ${showCategoryDropdown ? 'rotate-90' : ''} ${isRTL ? 'rotate-180' : ''}`} />
                                    </button>
                                    
                                    {showCategoryDropdown && uniqueCategories.length > 0 && (
                                        <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
                                            {uniqueCategories.map((category) => (
                                                <button
                                                    key={`cat-${category.id}`}
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
                                    {isRTL ? 'الترتيب حسب' : 'Sort By'}
                                </label>
                                <select
                                    value={sortBy.value}
                                    onChange={(e) => setSortBy({ value: e.target.value, label: e.target.options[e.target.selectedIndex].text })}
                                    className="w-full p-2 border rounded-lg bg-white"
                                >
                                    <option value="newest">{isRTL ? 'الأحدث أولاً' : 'Newest First'}</option>
                                    <option value="oldest">{isRTL ? 'الأقدم أولاً' : 'Oldest First'}</option>
                                </select>
                            </div>
                        </div>

                        {/* Clear Filters */}
                        {(searchTerm || selectedCategory || sortBy.value !== 'newest') && (
                            <div className="flex justify-end mt-4">
                                <button
                                    onClick={clearFilters}
                                    className="flex items-center gap-2 text-[#BB2632] hover:text-red-700"
                                >
                                    <X className="w-5 h-5" />
                                    {isRTL ? 'مسح الفلاتر' : 'Clear Filters'}
                                </button>
                            </div>
                        )}
                    </div>
                )}
                
                {/* Showing results count */}
                <div className="mt-4 text-gray-600">
                    {isRTL 
                        ? `عرض ${filteredWords.length} من ${words.length} كلمة`
                        : `Showing ${filteredWords.length} of ${words.length} words`
                    }
                </div>
            </div>

            {/* Words Grid */}
            {filteredWords.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-gray-500 text-lg mb-4">{isRTL ? 'لا توجد نتائج مطابقة لبحثك' : 'No matching results found'}</p>
                    <button
                        onClick={clearFilters}
                        className="px-6 py-2 bg-[#BB2632] text-white rounded-lg hover:bg-[#A31F29] transition-colors"
                    >
                        {isRTL ? 'مسح الفلاتر' : 'Clear Filters'}
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {currentWords.map((word) => (
                        <Link 
                            to={`/words/${word.id}`}
                            key={`word-${word.id}`}
                            className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105"
                        >
                            <div className="relative h-48">
                                    <img 
                                        src={word.image} 
                                        alt={word.title} 
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                                {/* Categories on image */}
                                {word.categories && word.categories.length > 0 && (
                                    <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
                                        {word.categories.map((category) => (
                                            <div
                                                key={`card-cat-${word.id}-${category.id}`}
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
                                    {word.title}
                                </h3>
                                {word.excerpt && (
                                    <p className="text-gray-600 mb-4 line-clamp-3 bahnschrift text-[16px]">
                                        {word.excerpt}
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
                            onClick={prevPage}
                            disabled={currentPage === 1}
                            className={`p-2 rounded-full ${
                                currentPage === 1
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'text-[#BB2632] hover:bg-[#BB2632] hover:text-white'
                            }`}
                            aria-label={isRTL ? 'الصفحة السابقة' : 'Previous page'}
                        >
                            {isRTL ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
                        </button>

                        <div className="flex gap-2">
                            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                // Show pages around current page
                                let pageNumber;
                                if (totalPages <= 5) {
                                    // If 5 or fewer pages, show all
                                    pageNumber = i + 1;
                                } else if (currentPage <= 3) {
                                    // At the beginning of pagination
                                    pageNumber = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                    // At the end of pagination
                                    pageNumber = totalPages - 4 + i;
                                } else {
                                    // In the middle
                                    pageNumber = currentPage - 2 + i;
                                }
                                
                                return (
                                    <button
                                        key={`page-${pageNumber}`}
                                        onClick={() => paginate(pageNumber)}
                                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${
                                            currentPage === pageNumber
                                                ? 'bg-[#BB2632] text-white'
                                                : 'text-[#BB2632] hover:bg-[#BB2632] hover:text-white'
                                        }`}
                                        aria-label={isRTL ? `صفحة ${pageNumber}` : `Page ${pageNumber}`}
                                    >
                                        {pageNumber}
                                    </button>
                                );
                            })}
                </div>
                
                        <button
                            onClick={nextPage}
                            disabled={currentPage === totalPages}
                            className={`p-2 rounded-full ${
                                currentPage === totalPages
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'text-[#BB2632] hover:bg-[#BB2632] hover:text-white'
                            }`}
                            aria-label={isRTL ? 'الصفحة التالية' : 'Next page'}
                        >
                            {isRTL ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
                        </button>
                    </div>
                    <p className="text-center text-gray-600 mt-4">
                        {isRTL 
                            ? `صفحة ${currentPage} من ${totalPages}`
                            : `Page ${currentPage} of ${totalPages}`
                        }
                    </p>
                </div>
            )}
            </div>
    );
};

export default AllWords; 