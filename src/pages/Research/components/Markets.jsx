import React, { useState, useEffect } from 'react';
import Redbackground from "../../../assets/images/Redbackground.png";
import { useInView } from "react-intersection-observer";
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getWordsInMarkets, setAPILanguage } from '../../../services/api';

export default function Markets() {
    const [words, setWords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
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
                
                const data = await getWordsInMarkets();
                setWords(data);
            } catch (error) {
                console.error('Error in Markets component:', error);
                setError(error.message || t('common.error', isRTL ? 'فشل تحميل المحتوى' : 'Failed to load content'));
            } finally {
                setLoading(false);
            }
        };

        fetchWords();
    }, [i18n.language, t]);

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

    // أخذ أول ثلاث كلمات فقط
    const limitedWords = words.slice(0, 3);

    return (
        <section 
            className={`min-h-screen bg-cover bg-center transition-all duration-1000 p-6 overflow-hidden ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`} 
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
                        <div key={word.id} className="flex justify-center">
                            <Link 
                                to={`/words/${word.id}`} 
                                className="overflow-hidden shadow-lg rounded-lg transition-all duration-500 hover:scale-105 cursor-pointer group block h-full bg-white max-w-4xl"
                            >
                                <div className="relative">
                                    {word.image && <img src={word.image} alt={word.title} className="w-full h-60 object-cover transition-transform duration-500 group-hover:scale-110" />}
                                </div>
                                <div className={`p-6 ${isRTL ? 'text-right' : 'text-left'}`}>
                                    <h3 className={`text-lg font-semibold transition-all duration-500 group-hover:text-[#BB2632] ${isRTL ? 'mb-2' : ''}`}>{word.title}</h3>
                                    <p className={`text-sm text-[#333333] my-4 bahnschrift text-[16px]${isRTL ? 'leading-relaxed' : ''}`}>{word.description}</p>
                                    <span className={`text-[#BB2632] font-semibold relative inline-block pb-4 ${isRTL ? 'pr-0 pl-6' : 'pl-0 pr-6'} pt-4 cursor-pointer`}>
                                        {isRTL ? 'عرض المزيد' : 'Read More'}
                                        <span className={`absolute ${isRTL ? 'right-2 left-auto' : 'left-0 right-4 '} bottom-4 w-0 h-[2px] bg-[#BB2632] transition-all duration-500 group-hover:w-[75px]`}></span>
                                    </span>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className={`text-[#BB2632] text-center mt-8 p-12 text-xl`}>
                <Link to="/words"  className="inline-flex items-center text-[#ec3a49] font-semibold hover:opacity-80 transition-opacity duration-300 text-center group">
                    {isRTL ? 'عرض جميع الكلمات' : 'View All Words'}
                    <ArrowIcon className={`w-5 h-5 text-[#BB2632] transition-all duration-500 ${isRTL ? 'mr-1' : 'ml-1'}`} />
                </Link>
            </div>
        </section>
    );
}
