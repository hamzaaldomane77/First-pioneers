import React, { useState, useEffect } from 'react';
import Whitebackground from "../../../assets/images/Whitebackground.png";
import { useInView } from 'react-intersection-observer';
import { CustomSvg } from '../../../components/custom-svg';
import { getFeaturedReports, setAPILanguage } from '../../../services/api';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Reports() {
    const { ref, inView } = useInView({
        threshold: 0.3,
        triggerOnce: true,
    });
    
    const { i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                setLoading(true);
                setError(null);
                setAPILanguage(i18n.language);
                
                const data = await getFeaturedReports();
                // Get only the first 4 reports
                setReports(data.slice(0, 4));
            } catch (error) {
                console.error('Error in Reports component:', error);
                setError(error.message || (isRTL ? 'فشل تحميل المحتوى' : 'Failed to load content'));
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, [i18n.language, isRTL]);

    if (loading) {
        return (
            <section
                className="min-h-[500px] bg-cover bg-center flex flex-col items-center justify-center"
                style={{ backgroundImage: `url(${Whitebackground})` }}
            >
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#BB2632]"></div>
            </section>
        );
    }

    if (error) {
        return (
            <section
                className="min-h-[500px] bg-cover bg-center flex flex-col items-center justify-center"
                style={{ backgroundImage: `url(${Whitebackground})` }}
            >
                <div className="bg-white bg-opacity-75 p-4 rounded-lg">
                    <p className="text-red-600">{error}</p>
                </div>
            </section>
        );
    }

    if (reports.length === 0) {
        return (
            <section
                className="min-h-[500px] bg-cover bg-center flex flex-col items-center justify-center"
                style={{ backgroundImage: `url(${Whitebackground})` }}
            >
                <div className="bg-white bg-opacity-75 p-4 rounded-lg">
                    <p className="text-gray-600">{isRTL ? 'لا توجد تقارير متاحة' : 'No reports available'}</p>
                </div>
            </section>
        );
    }

    return (
        <section
            className={`min-h-[500px] bg-cover bg-center flex flex-col items-center justify-center px-6 lg:px-36 transition-all duration-1000 py-28 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
            style={{ backgroundImage: `url(${Whitebackground})` }}
            ref={ref}
            dir={isRTL ? 'rtl' : 'ltr'}
        >
            <div className="w-full max-w-6xl space-y-10">
                <h1 className='text-center text-4xl font-bold text-red-700' >Our Featured Reports</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {reports.map((report) => (
                        <Card 
                            key={report.id} 
                            id={report.id}
                            logo="Logo-main"
                            title={report.title}
                            description={report.excerpt} 
                            isRTL={isRTL}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

function Card({ id, logo, title, description, isRTL }) {
    const [isHovered, setIsHovered] = useState(false);
    
    const viewText = isRTL ? 'عرض التقرير' : 'View Report';

    return (
        <Link to={`/reports/${id}`}>
            <div 
                className="relative overflow-hidden rounded-s-3xl shadow-lg bg-white h-96 cursor-pointer"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Corner triangle */}
                <div 
                    className="absolute top-0 left-0 w-24 h-24 transition-opacity duration-500 rounded-e-fullxl"
                    style={{ 
                        opacity: isHovered ? '1' : '0.6',
                        background: 'linear-gradient(to bottom right, #D5996E 0%, #D5996E 50%, transparent 50%, transparent 50%)'
                    }}
                />
                
                {/* Logo */}
                <div className="absolute inset-x-0 top-8 flex items-center justify-center h-32">
                    <CustomSvg name={logo} className="w-24 h-24" />
                </div>
                
                <div 
                    className={`absolute inset-x-0 flex justify-center transition-all duration-500 ease-in-out px-6 ${
                        isHovered 
                            ? 'opacity-0' 
                            : 'opacity-100'
                    }`}
                    style={{ top: '10rem' }}
                >
                    <h3 className="text-xl font-bold text-center text-black line-clamp-3">{title}</h3>
                </div>
                
                {/* View Report button */}
                <div 
                    className={`absolute bottom-6 inset-x-0 flex justify-center transition-all duration-500 ease-in-out ${
                        isHovered 
                            ? 'opacity-0' 
                            : 'opacity-100'
                    }`}
                >
                    <button className="px-6 py-2 text-red-700 font-medium">{viewText}</button>
                </div>
                
                {/* Overlay with title and description that appears on hover */}
                <div 
                    className={`absolute inset-0 bg-white bg-opacity-85 flex flex-col items-center justify-center p-6 transition-all duration-1000 ease-in-out ${
                        isHovered 
                            ? 'translate-y-0' 
                            : 'translate-y-full'
                    }`}
                >
                    <h3 className="text-xl font-bold mb-4 text-center text-red-700">{title}</h3>
                    <p className="text-sm text-center mb-6 line-clamp-4">{description}</p>
                    <button className="px-12 py-2 text-red-700 font-medium">{viewText}</button>
                </div>
            </div>
        </Link>
    );
}