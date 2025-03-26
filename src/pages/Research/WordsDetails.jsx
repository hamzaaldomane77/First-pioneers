import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Redbackground from "../../assets/images/Redbackground.png";
import { getWordInMarketById, setAPILanguage } from '../../services/api';
import { ArrowRight, ArrowLeft } from 'lucide-react';

const WordsDetails = () => {
    const { id } = useParams();
    const [word, setWord] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';
    
    // تحديد أيقونة السهم المناسبة حسب اتجاه اللغة
    const BackArrowIcon = isRTL ? ArrowRight : ArrowLeft;
    
    useEffect(() => {
        const fetchWordDetails = async () => {
            if (!id) {
                setError(isRTL ? 'معرف الكلمة غير متوفر' : 'Word ID is not available');
                setLoading(false);
                return;
            }
            
            try {
                setLoading(true);
                setError(null);
                setAPILanguage(i18n.language);
                
                // جلب تفاصيل الكلمة الحالية
                const data = await getWordInMarketById(id);
                setWord(data);
            } catch (error) {
                console.error('Error in WordsDetails component:', error);
                setError(error.message || (isRTL ? 'فشل تحميل المحتوى' : 'Failed to load content'));
            } finally {
                setLoading(false);
            }
        };

        fetchWordDetails();
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

    if (!word) {
        return (
            <section
                className="min-h-screen bg-cover bg-center flex items-center justify-center"
                style={{ backgroundImage: `url(${Redbackground})` }}
            >
                <div className="bg-white bg-opacity-75 p-4 rounded-lg">
                    <p className="text-gray-600">
                        {isRTL ? 'لم يتم العثور على الكلمة المطلوبة' : 'Requested word not found'}
                    </p>
                </div>
            </section>
        );
    }

    // تحويل التاريخ إلى تنسيق مناسب
    const formattedDate = new Date(word.created_at).toLocaleDateString(
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
                    {word.image && (
                        <img 
                            src={word.image} 
                            alt={word.title} 
                            className="w-full h-full object-cover opacity-70"
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>
                </div>
                
                {/* زر العودة */}
                <div className="absolute top-4 left-4 right-4 z-10">
                    <div className="container mx-auto">
                        <Link 
                            to="/words" 
                            className={`inline-flex items-center text-white hover:text-[#BB2632] transition-colors bg-black/20 px-4 py-2 rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}
                        >
                            <BackArrowIcon className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                            {isRTL ? 'العودة إلى جميع الكلمات' : 'Back to All Words'}
                        </Link>
                    </div>
                </div>
                
                {/* محتوى العنوان */}
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 text-white">
                    <div className="container mx-auto">
                        <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
                            <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${isRTL ? 'font-medium leading-relaxed' : ''}`}>
                                {word.title}
                            </h1>
                            <p className="text-gray-300 text-sm mt-4">
                                {formattedDate}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="container mx-auto py-16 px-4">
                {/* عرض الصور الإضافية */}
                {word.images && word.images.length > 0 && (
                    <div className="mb-16">
                        <h2 className={`text-2xl mb-8 text-center text-[#BB2632] font-bold ${isRTL ? 'font-medium' : ''}`}>
                            {isRTL ? 'المزيد من الصور' : 'More Images'}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {word.images.map((img, index) => (
                                <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                                    <img 
                                        src={img.image} 
                                        alt={img.alt_text || word.title} 
                                        className="w-full h-64 object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                {/* وصف الكلمة */}
                <div className="bg-white p-8 rounded-lg shadow-lg my-8">
                    <h2 className={`text-2xl mb-6 text-[#BB2632] font-bold ${isRTL ? 'text-right font-medium' : ''}`}>
                        {isRTL ? 'الوصف' : 'Description'}
                    </h2>
                    <div className={`text-gray-800 leading-relaxed ${isRTL ? 'text-right' : ''}`}>
                        <p className={`${isRTL ? 'leading-loose text-lg' : ''}`}>{word.description}</p>
                    </div>
                </div>
                
                <div className="mt-10 text-center">
                    <Link 
                        to="/words" 
                        className={`bg-[#BB2632] text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-all duration-300 ${isRTL ? 'ml-4' : 'mr-4'}`}
                    >
                        {isRTL ? 'عرض جميع الكلمات' : 'View All Words'}
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

export default WordsDetails; 