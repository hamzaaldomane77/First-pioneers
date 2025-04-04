import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Redbackground from "../../assets/images/Redbackground.png";
import { getTrendsInMarkets, setAPILanguage } from '../../services/api';

const AllTrends = () => {
    const [trends, setTrends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';
    
    useEffect(() => {
        const fetchTrends = async () => {
            try {
                setLoading(true);
                setError(null);
                setAPILanguage(i18n.language);
                
                const data = await getTrendsInMarkets();
                setTrends(data);
            } catch (error) {
                console.error('Error in AllTrends component:', error);
                setError(error.message || (isRTL ? 'فشل تحميل المحتوى' : 'Failed to load content'));
            } finally {
                setLoading(false);
            }
        };

        fetchTrends();
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

    if (trends.length === 0) {
        return (
            <section
                className="min-h-screen bg-cover bg-center flex items-center justify-center"
                style={{ backgroundImage: `url(${Redbackground})` }}
            >
                <div className="bg-white bg-opacity-75 p-4 rounded-lg">
                    <p className="text-gray-600">{isRTL ? 'لا توجد اتجاهات متاحة' : 'No trends available'}</p>
                </div>
            </section>
        );
    }

    return (
        <section 
            className="min-h-screen bg-cover bg-center p-6"
            style={{ backgroundImage: `url(${Redbackground})` }}
            dir={isRTL ? 'rtl' : 'ltr'}
        >
            <div className="container mx-auto py-20">
                <h1 className={`text-[#BB2632] text-4xl md:text-5xl text-center pt-10 pb-16 ${isRTL ? 'font-medium' : ''}`}>
                    {isRTL ? 'جميع اتجاهات السوق' : 'All Market Trends'}
                </h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
                    {trends.map(trend => (
                        <Link 
                            to={`/trends/${trend.id}`} 
                            key={trend.id} 
                            className="overflow-hidden shadow-lg rounded-lg transition-all duration-500 hover:scale-105 cursor-pointer group block h-full bg-white"
                        >
                            <div className="relative">
                                {trend.image && (
                                    <img 
                                        src={trend.image} 
                                        alt={trend.title} 
                                        className="w-full h-60 object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                )}
                            </div>
                            <div className={`p-6 ${isRTL ? 'text-right' : 'text-left'}`}>
                                <h3 className={`text-lg font-semibold transition-all duration-500 group-hover:text-[#BB2632] ${isRTL ? 'mb-2' : ''}`}>
                                    {trend.title}
                                </h3>
                                <p className={`text-sm text-[#333333] my-4 bahnschrift text-[16px]${isRTL ? 'leading-relaxed' : ''}`}>
                                    {trend.description}
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className={`text-[#BB2632] font-semibold relative inline-block`}>
                                        {isRTL ? 'عرض المزيد' : 'Read More'}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        {new Date(trend.created_at).toLocaleDateString(
                                            isRTL ? 'ar-EG' : 'en-US', 
                                            { year: 'numeric', month: 'short', day: 'numeric' }
                                        )}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
                
                <div className="mt-10 text-center">
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

export default AllTrends; 