import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { getToolWeUseById, setAPILanguage } from '../../services/api';
import Redbackground from "../../assets/images/Redbackground.png";
import Whitebackground from "../../assets/images/Whitebackground.png";
import companyLogo from '../../assets/images/logo.png'; // تأكد من تحديث المسار الصحيح لشعار الشركة

const ToolDetails = () => {
    const { id } = useParams();
    const [tool, setTool] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';
    
    // تحديد أيقونة السهم المناسبة حسب اتجاه اللغة
    const BackArrowIcon = isRTL ? ArrowRight : ArrowLeft;
    
    useEffect(() => {
        const fetchToolDetails = async () => {
            if (!id) {
                setError(isRTL ? 'معرف الأداة غير متوفر' : 'Tool ID is not available');
                setLoading(false);
                return;
            }
            
            try {
                setLoading(true);
                setError(null);
                setAPILanguage(i18n.language);
                
                // جلب تفاصيل الأداة الحالية
                const data = await getToolWeUseById(id);
                setTool(data);
            } catch (error) {
                console.error('Error in ToolDetails component:', error);
                setError(error.message || (isRTL ? 'فشل تحميل المحتوى' : 'Failed to load content'));
            } finally {
                setLoading(false);
            }
        };

        fetchToolDetails();
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

    if (!tool) {
        return (
            <section
                className="min-h-screen bg-cover bg-center flex items-center justify-center"
                style={{ backgroundImage: `url(${Redbackground})` }}
            >
                <div className="bg-white bg-opacity-75 p-4 rounded-lg">
                    <p className="text-gray-600">
                        {isRTL ? 'لم يتم العثور على الأداة المطلوبة' : 'Requested tool not found'}
                    </p>
                </div>
            </section>
        );
    }

    // التحقق مما إذا كانت الأداة تحتوي على استكشافات
    const hasExplores = tool.explores && tool.explores.length > 0;
    
    // فصل الاستكشافات إلى مجموعتين: مع صورة واحدة ومع صورتين
    const singleImageExplores = [];
    const doubleImageExplores = [];
    
    if (hasExplores) {
        tool.explores.forEach(explore => {
            if (explore.second_image !== null) {
                doubleImageExplores.push(explore);
            } else {
                singleImageExplores.push(explore);
            }
        });
    }

    return (
        <div dir={isRTL ? 'rtl' : 'ltr'}>
            {/* القسم الرئيسي مع صورة خلفية وعنوان */}
            <section 
                className="min-h-screen bg-cover bg-center relative flex items-center justify-center"
                style={{ 
                    backgroundImage: `url(${tool.image || companyLogo})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                {/* طبقة التعتيم لتحسين وضوح النص */}
                <div className="absolute inset-0 bg-black bg-opacity-60"></div>
                
                {/* زر العودة */}
                <div className="absolute top-4 left-4 right-4 z-10">
                    <div className="container mx-auto">
                        <Link 
                            to="/ServicesTools" 
                            className={`inline-flex items-center text-white hover:text-[#BB2632] transition-colors bg-black/20 px-4 py-2 rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}
                        >
                            <BackArrowIcon className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                            {isRTL ? 'العودة إلى الأدوات' : 'Back to Tools'}
                        </Link>
                    </div>
                </div>
                
                {/* المحتوى فوق الصورة */}
                <div className="container mx-auto px-4 z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                        {tool.name}
                    </h1>
                    <p className={`text-white text-lg md:text-xl max-w-3xl mx-auto ${isRTL ? 'leading-loose' : ''}`}>
                        {tool.description}
                    </p>
                </div>
            </section>
            
            {/* قسم الاستكشاف مع صورة واحدة */}
            {singleImageExplores.length > 0 && (
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <h2 className={`text-3xl font-bold mb-12 text-center text-[#BB2632] ${isRTL ? 'font-medium' : ''}`}>
                            {isRTL ? 'استكشاف الأداة' : 'Explore the Tool'}
                        </h2>
                        
                        {singleImageExplores.map((explore, index) => {
                            // تبديل الخلفية بين الأقسام
                            const bgImage = index % 2 === 0 ? Redbackground : Whitebackground;
                            const textColor = index % 2 === 0 ? 'text-black' : 'text-black';
                            
                            return (
                                <div 
                                    key={explore.id}
                                    className="mb-16 py-12 bg-cover bg-center"
                                    style={{ backgroundImage: `url(${bgImage})` }}
                                >
                                    <div className="container mx-auto px-4">
                                        <div className={`flex flex-col ${index % 2 !== 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8`}>
                                            {/* قسم الصورة */}
                                            <div className="md:w-1/2">
                                                <img 
                                                    src={explore.image} 
                                                    alt={explore.title} 
                                                    className="w-full h-auto rounded-lg shadow-lg"
                                                />
                                            </div>
                                            
                                            {/* قسم المحتوى */}
                                            <div className={`md:w-1/2 ${textColor}`}>
                                                <h3 className={`text-2xl font-bold mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                                                    {explore.title}
                                                </h3>
                                                <p className={`${isRTL ? 'text-right leading-loose' : 'text-left'}`}>
                                                    {explore.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}
            
            {/* قسم الاستكشاف مع صورتين - يظهر دائمًا في النهاية */}
            {doubleImageExplores.length > 0 && (
                <section className="">
                    <div className="container ">
                       
                        
                        {doubleImageExplores.map((explore, index) => {
                            // تبديل الخلفية بين الأقسام
                            const bgImage = index % 2 === 0 ? Redbackground : Whitebackground;
                            const textColor = index % 2 === 0 ? 'text-black' : 'text-gray-800';
                            
                            return (
                                <div 
                                    key={explore.id}
                                    className="mb-16 py-12 bg-cover bg-center"
                                    style={{ backgroundImage: `url(${bgImage})` }}
                                >
                                    <div className="container mx-auto px-4">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                                            {/* الصورة الأولى على اليمين */}
                                            <div className="md:col-span-1 order-2 md:order-1">
                                                <img 
                                                    src={explore.image} 
                                                    alt={explore.title} 
                                                    className="w-full h-auto rounded-lg shadow-lg"
                                                />
                                            </div>
                                            
                                            {/* المحتوى في الوسط */}
                                            <div className={`md:col-span-1 order-1 md:order-2 text-center ${textColor}`}>
                                                <h3 className="text-2xl font-bold mb-4">{explore.title}</h3>
                                                <p className={`${isRTL ? 'leading-loose' : ''}`}>{explore.description}</p>
                                            </div>
                                            
                                            {/* الصورة الثانية على اليسار */}
                                            <div className="md:col-span-1 order-3">
                                                <img 
                                                    src={explore.second_image} 
                                                    alt={`${explore.title} - secondary`} 
                                                    className="w-full h-auto rounded-lg shadow-lg"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}
            
            {/* قسم العودة */}
            
        </div>
    );
};

export default ToolDetails; 