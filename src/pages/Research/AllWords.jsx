import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Redbackground from "../../assets/images/Redbackground.png";
import { getWordsInMarkets, setAPILanguage } from '../../services/api';
import { Search } from 'lucide-react';

const AllWords = () => {
    const [words, setWords] = useState([]);
    const [filteredWords, setFilteredWords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';

    useEffect(() => {
        const fetchWords = async () => {
            try {
                setLoading(true);
                setError(null);
                setAPILanguage(i18n.language);
                
                const data = await getWordsInMarkets();
                setWords(data);
                setFilteredWords(data);
            } catch (error) {
                console.error('Error in AllWords component:', error);
                setError(error.message || (isRTL ? 'فشل تحميل المحتوى' : 'Failed to load content'));
            } finally {
                setLoading(false);
            }
        };

        fetchWords();
    }, [i18n.language, isRTL]);

    useEffect(() => {
        let result = [...words];

        // تطبيق البحث حسب العنوان فقط
        if (searchTerm) {
            result = result.filter(word => 
                word.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // تطبيق الترتيب
        result.sort((a, b) => {
            if (sortBy === 'newest') {
                return new Date(b.createdAt) - new Date(a.createdAt);
            } else if (sortBy === 'oldest') {
                return new Date(a.createdAt) - new Date(b.createdAt);
            } else if (sortBy === 'title') {
                return words.title.localeCompare(b.title);
            }
            return 0;
        });

        setFilteredWords(result);
    }, [searchTerm, sortBy, words]);

    if (loading) {
        return (
            <section
                className="min-h-screen bg-cover bg-center flex items-center justify-center"
                style={{ backgroundImage: `url(${Redbackground})` }}
            >
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </section>
        );
    }

    if (error) {
        return (
            <section
                className="min-h-screen bg-cover bg-center flex items-center justify-center"
                style={{ backgroundImage: `url(${Redbackground})` }}
            >
                <div className="bg-white bg-opacity-75 p-4 rounded-lg">
                    <p className="text-red-600">{error}</p>
                </div>
            </section>
        );
    }

    return (
        <section
            className="min-h-screen bg-cover bg-center py-16 px-4"
            style={{ backgroundImage: `url(${Redbackground})` }}
            dir={isRTL ? 'rtl' : 'ltr'}
        >
            <div className="container mx-auto">
                <h1 className={`text-5xl text-center text-[#BB2632] mb-16 ${isRTL ? 'font-medium' : 'font-bold'}`}>
                    {isRTL ? 'كلمات في الأسواق' : 'Words In Markets'}
                </h1>

                {/* قسم البحث والفلترة */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* حقل البحث */}
                        <div className="relative">
                            <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-gray-400`} size={20} />
                            <input
                                type="text"
                                placeholder={isRTL ? 'ابحث حسب العنوان...' : 'Search by title...'}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={`w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#BB2632] ${isRTL ? 'text-right' : 'text-left'}`}
                            />
                        </div>

                        {/* اختيار الترتيب */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#BB2632]"
                        >
                            <option value="newest">{isRTL ? 'الأحدث أولاً' : 'Newest First'}</option>
                            <option value="oldest">{isRTL ? 'الأقدم أولاً' : 'Oldest First'}</option>
                            <option value="title">{isRTL ? 'ترتيب حسب العنوان' : 'Sort by Title'}</option>
                        </select>
                    </div>
                </div>

                {/* عرض النتائج */}
                {filteredWords.length === 0 ? (
                    <div className="text-center py-8 bg-white rounded-lg">
                        <p className="text-gray-600">
                            {isRTL ? 'لا توجد نتائج مطابقة لبحثك' : 'No matching results found'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredWords.map(word => (
                            <Link 
                                key={word.id} 
                                to={`/words/${word.id}`}
                                className="block bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:shadow-xl hover:scale-105"
                            >
                                {word.image && (
                                    <div className="h-64 overflow-hidden">
                                        <img 
                                            src={word.image} 
                                            alt={word.title} 
                                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                        />
                                    </div>
                                )}
                                <div className="p-6">
                                    <div className={`flex items-center justify-between mb-2`}>
                                        <h2 className={`text-xl font-bold text-gray-800 ${isRTL ? 'text-right' : 'text-left'}`}>
                                            {word.title}
                                        </h2>
                                        
                                    </div>
                                    <p className={`text-gray-600 mb-4 bahnschrift text-[16px]${isRTL ? 'text-right' : 'text-left'}`}>
                                        {word.description.length > 100 
                                            ? `${word.description.substring(0, 100)}...` 
                                            : word.description
                                        }
                                    </p>
                                    <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
                                        <span className="text-[#BB2632] font-medium">
                                            {isRTL ? 'اقرأ المزيد' : 'Read more'}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
                
                <div className="mt-16 text-center">
                    <Link 
                        to="/" 
                        className="bg-[#BB2632] text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-all duration-300"
                    >
                        {isRTL ? 'العودة إلى الصفحة الرئيسية' : 'Back to Home'}
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default AllWords; 