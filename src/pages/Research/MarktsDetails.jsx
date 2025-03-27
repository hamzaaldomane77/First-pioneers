import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Redbackground from "../../assets/images/Redbackground.png";
import { getTrendById, getTrendsInMarkets, setAPILanguage } from '../../services/api';
import { ArrowRight, ArrowLeft } from 'lucide-react';

const TrendDetails = () => {
    const { id } = useParams();
    const [trend, setTrend] = useState(null);
    const [relatedTrends, setRelatedTrends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';
    
    // تحديد أيقونة السهم المناسبة حسب اتجاه اللغة
    const BackArrowIcon = isRTL ? ArrowRight : ArrowLeft;
    
    useEffect(() => {
        const fetchTrendDetails = async () => {
            if (!id) {
                setError(isRTL ? 'معرف الاتجاه غير متوفر' : 'Trend ID is not available');
                setLoading(false);
                return;
            }
            
            try {
                setLoading(true);
                setError(null);
                setAPILanguage(i18n.language);
                
                // جلب تفاصيل الاتجاه الحالي
                const data = await getTrendById(id);
                setTrend(data);
                
                // جلب الاتجاهات الأخرى لاستخدامها في الأقسام الإضافية
                const allTrends = await getTrendsInMarkets();
                
                // استبعاد الاتجاه الحالي والاحتفاظ باتجاهين آخرين على الأكثر
                const filtered = allTrends
                    .filter(t => t.id !== parseInt(id))
                    .slice(0, 2);
                    
                setRelatedTrends(filtered);
            } catch (error) {
                console.error('Error in TrendDetails component:', error);
                setError(error.message || (isRTL ? 'فشل تحميل المحتوى' : 'Failed to load content'));
            } finally {
                setLoading(false);
            }
        };

        fetchTrendDetails();
    }, [id, i18n.language, isRTL]);

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

    if (!trend) {
        return (
            <section
                className="min-h-screen bg-cover bg-center flex items-center justify-center"
                style={{ backgroundImage: `url(${Redbackground})` }}
            >
                <div className="bg-white bg-opacity-75 p-4 rounded-lg">
                    <p className="text-gray-600">
                        {isRTL ? 'لم يتم العثور على اتجاه السوق المطلوب' : 'Requested trend not found'}
                    </p>
                </div>
            </section>
        );
    }

    // تحويل التاريخ إلى تنسيق مناسب
    const formattedDate = new Date(trend.created_at).toLocaleDateString(
        isRTL ? 'ar-EG' : 'en-US', 
        { year: 'numeric', month: 'long', day: 'numeric' }
    );

    return (
        <section 
            className="min-h-screen bg-cover bg-center"
            style={{ backgroundImage: `url(${Redbackground})` }}
            dir={isRTL ? 'rtl' : 'ltr'}
        >
            {/* القسم الرئيسي مع صورة خلفية وعنوان */}
            <div className="relative h-[70vh] min-h-[500px] w-full">
                {/* صورة الخلفية */}
                <div className="absolute inset-0 w-full h-full bg-black">
                    {trend.image && (
                        <img 
                            src={trend.image} 
                            alt={trend.title} 
                            className="w-full h-full object-cover opacity-70"
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>
                </div>
                
                {/* زر العودة */}
                <div className="absolute top-4 left-4 right-4 z-10">
                    <div className="container mx-auto">
                        <Link 
                            to="/all-trends" 
                            className={`inline-flex items-center text-white hover:text-[#BB2632] transition-colors bg-black/20 px-4 py-2 rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}
                        >
                            <BackArrowIcon className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                            {isRTL ? 'العودة إلى جميع الاتجاهات' : 'Back to All Trends'}
                        </Link>
                    </div>
                </div>
                
                {/* محتوى العنوان */}
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 text-white">
                    <div className="container mx-auto">
                        <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
                            <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${isRTL ? 'font-medium leading-relaxed' : ''}`}>
                                {trend.title}
                            </h1>
                            <p className={`text-lg md:text-xl max-w-3xl ${isRTL ? 'leading-10' : ''}`}>
                                {trend.description}
                            </p>
                            <p className="text-gray-300 text-sm mt-4">
                                {formattedDate}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="container mx-auto py-16 px-4">
                {/* قسم الصورة والنص جنبًا إلى جنب */}
                {relatedTrends.length > 0 && (
                    <div className="bg-white rounded-lg shadow-xl overflow-hidden mb-16">
                        <div className={`flex flex-col md:flex-row ${isRTL ? 'md:flex-row-reverse' : ''}`}>
                            <div className="md:w-1/2">
                                <img 
                                    src={relatedTrends[0].image} 
                                    alt={relatedTrends[0].title} 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="md:w-1/2 p-8 flex items-center">
                                <div className="w-full">
                                    <h2 className={`text-2xl md:text-3xl font-bold mb-4 text-[#333333] ${isRTL ? 'text-right font-medium leading-relaxed' : 'text-left'}`}>
                                        {isRTL ? 'الاتجاهات الحديثة في الأعمال' : 'Latest Business Trends'}
                                    </h2>
                                    <p className={`text-gray-700 mb-6 ${isRTL ? 'text-right leading-loose text-lg' : 'text-left leading-relaxed'}`}>
                                        {relatedTrends[0].description}
                                    </p>
                                    <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
                                        <Link 
                                            to={`/trends/${relatedTrends[0].id}`} 
                                            className="text-[#BB2632] font-semibold hover:underline inline-flex items-center"
                                        >
                                            {isRTL ? (
                                                <>
                                                    اقرأ المزيد عن هذا الاتجاه
                                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                                </>
                                            ) : (
                                                <>
                                                    Read more about this trend
                                                    <ArrowRight className="w-4 h-4 ml-2" />
                                                </>
                                            )}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* قسم الصورة على الجانب المعاكس والنص */}
                {relatedTrends.length > 1 && (
                    <div className="bg-white rounded-lg shadow-xl overflow-hidden mb-16">
                        <div className={`flex flex-col md:flex-row ${!isRTL ? 'md:flex-row-reverse' : ''}`}>
                            <div className="md:w-1/2">
                                <img 
                                    src={relatedTrends[1].image} 
                                    alt={relatedTrends[1].title} 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="md:w-1/2 p-8 flex items-center">
                                <div className="w-full">
                                    <h2 className={`text-2xl md:text-3xl font-bold mb-4 text-[#333333] ${isRTL ? 'text-right font-medium leading-relaxed' : 'text-left'}`}>
                                        {isRTL ? 'استكشاف اتجاهات السوق' : 'Exploring Market Trends'}
                                    </h2>
                                    <p className={`text-gray-700 mb-6 ${isRTL ? 'text-right leading-loose text-lg' : 'text-left leading-relaxed'}`}>
                                        {relatedTrends[1].description}
                                    </p>
                                    <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
                                        <Link 
                                            to={`/trends/${relatedTrends[1].id}`} 
                                            className="text-[#BB2632] font-semibold hover:underline inline-flex items-center"
                                        >
                                            {isRTL ? (
                                                <>
                                                    اقرأ المزيد عن هذا الاتجاه
                                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                                </>
                                            ) : (
                                                <>
                                                    Read more about this trend
                                                    <ArrowRight className="w-4 h-4 ml-2" />
                                                </>
                                            )}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                
                
               
                
                <div className="mt-10 text-center">
                    <Link 
                        to="/all-trends" 
                        className={`bg-[#BB2632] text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-all duration-300 ${isRTL ? 'ml-4' : 'mr-4'}`}
                    >
                        {isRTL ? 'عرض جميع الاتجاهات' : 'View All Trends'}
                    </Link>
                    <Link 
                        to="/" 
                        className="bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-all duration-300"
                    >
                        {isRTL ? 'العودة إلى الصفحة الرئيسية' : 'Back to Home'}
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default TrendDetails; 