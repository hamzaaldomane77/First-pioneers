import React, { useState, useEffect } from 'react';
import Redbackground from "../../../assets/images/Redbackground.png";
import { useInView } from "react-intersection-observer";
import { ArrowRight, ArrowLeft, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getWordsInMarkets, setAPILanguage } from '../../../services/api';

export default function Markets() {
    const [words, setWords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [retryCount, setRetryCount] = useState(0);
    
    const { ref, inView } = useInView({
        threshold: 0.3,
        triggerOnce: true,
    });
    
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';
    
    const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

    useEffect(() => {
        const fetchWords = async () => {
            try {
                setLoading(true);
                setError(null);
                setAPILanguage(i18n.language);
                
                console.log('Fetching words (attempt', retryCount + 1, ')...');
                const data = await getWordsInMarkets();
                console.log('Received words:', data);
                setWords(data);
                setRetryCount(0);
            } catch (error) {
                console.error('Error in Markets component:', error);
                setError(error.message || t('common.error', isRTL ? 'فشل تحميل المحتوى' : 'Failed to load content'));
                
                if (retryCount < 3) {
                    console.log('Retrying in 2 seconds...');
                    setTimeout(() => {
                        setRetryCount(prev => prev + 1);
                    }, 2000);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchWords();
    }, [i18n.language, t, retryCount]);

    if (loading) {
        return (
            <section
                className="min-h-screen bg-cover bg-center flex items-center justify-center"
                style={{ backgroundImage: `url(${Redbackground})` }}
            >
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mb-4"></div>
                    {retryCount > 0 && (
                        <p className="text-white">
                            {t('common.retrying', 'Retrying')} ({retryCount}/3)...
                        </p>
                    )}
                </div>
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
                    {retryCount >= 3 && (
                        <p className="text-red-600 mt-2 text-sm">
                            {t('common.maxRetries', 'Maximum retry attempts reached')}
                        </p>
                    )}
                </div>
            </section>
        );
    }

    if (!words || words.length === 0) {
        return (
            <section
                className="min-h-screen bg-cover bg-center flex items-center justify-center"
                style={{ backgroundImage: `url(${Redbackground})` }}
            >
                <div className="bg-white bg-opacity-75 p-4 rounded-lg">
                    <p className="text-gray-600">{isRTL ? 'لا توجد كلمات متاحة' : 'No words available'}</p>
                </div>
            </section>
        );
    }

    // Take only the first three words
    const limitedWords = words.slice(0, 3);

    return (
        <section 
            className={`min-h-screen bg-cover bg-center transition-all duration-1000 px-1 overflow-hidden ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`} 
            style={{ backgroundImage: `url(${Redbackground})` }} 
            ref={ref}
            dir={isRTL ? 'rtl' : 'ltr'}
        >
            <h1 className={`text-[#BB2632] text-5xl text-center pt-32 pb-20 ${isRTL ? 'font-medium' : ''}`}>
                {isRTL ? 'كلمات في الأسواق' : 'Words In Markets'}
            </h1>
            
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {limitedWords.map(word => (
                        <Link 
                            key={word.id} 
                            to={`/words/${word.id}`} 
                            className="overflow-hidden shadow-lg rounded-lg transition-all duration-500 hover:scale-105 cursor-pointer group block h-full bg-white"
                        >
                            <div className="relative h-60">
                                {word.image && (
                                    <img 
                                        src={word.image} 
                                        alt={word.title} 
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                    />
                                )}
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-semibold mb-3 group-hover:text-[#BB2632] group-hover:opacity-80 transition-opacity">
                                    {word.title}
                                </h3>
                                
                                {word.excerpt && (
                                    <p className="text-gray-600 mb-4 line-clamp-3 bahnschrift text-[16px]">
                                        {word.excerpt}
                                    </p>
                                )}
                                
                                {/* Display categories if available */}
                                {word.categories && word.categories.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {word.categories.map((category) => (
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
                                
                                <div className="text-[#BB2632] font-semibold relative inline-block cursor-pointer group">
                                    {isRTL ? 'عرض المزيد' : 'Read More'}
                                    <span className="absolute left-0 right-0 bottom-0 w-0 h-[2px] bg-[#BB2632] transition-all duration-500 group-hover:w-full"></span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            
            <div className="text-center mt-8 p-12 text-xl">
                <Link 
                    to="/words" 
                    className="inline-flex items-center text-[#ec3a49] font-semibold hover:opacity-80 transition-opacity duration-300 text-center group"
                >
                    {isRTL ? 'عرض جميع الكلمات' : 'View All Words'}
                    <ArrowIcon className={`w-5 h-5 ml-2 ${isRTL ? 'rotate-180' : ''}`} />
                </Link>
            </div>
        </section>
    );
}
