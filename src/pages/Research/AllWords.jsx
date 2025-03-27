import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Redbackground from "../../assets/images/Redbackground.png";
import { getWordsInMarkets, setAPILanguage } from '../../services/api';

const AllWords = () => {
    const [words, setWords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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
            } catch (error) {
                console.error('Error in AllWords component:', error);
                setError(error.message || (isRTL ? 'فشل تحميل المحتوى' : 'Failed to load content'));
            } finally {
                setLoading(false);
            }
        };

        fetchWords();
    }, [i18n.language, isRTL]);

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

    if (words.length === 0) {
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {words.map(word => (
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
                                <h2 className={`text-xl font-bold mb-2 text-gray-800 ${isRTL ? 'text-right' : 'text-left'}`}>
                                    {word.title}
                                </h2>
                                <p className={`text-gray-600 mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
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