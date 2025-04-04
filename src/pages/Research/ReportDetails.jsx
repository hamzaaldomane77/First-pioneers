import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getFeaturedReportById, setAPILanguage } from '../../services/api';
import { useTranslation } from 'react-i18next';

const ReportDetails = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReportDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        setAPILanguage(i18n.language);
        const data = await getFeaturedReportById(id);
        setReport(data);
      } catch (err) {
        console.error('Error fetching report:', err);
        setError(err.message || (isRTL ? 'فشل تحميل المحتوى' : 'Failed to load content'));
      } finally {
        setLoading(false);
      }
    };

    fetchReportDetails();
  }, [id, i18n.language, isRTL]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#BB2632]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="container mx-auto px-4 min-h-screen flex items-center justify-center">
        <p className="text-gray-600">{isRTL ? 'لم يتم العثور على التقرير' : 'Report not found'}</p>
      </div>
    );
  }

  // معالجة الصور إذا كانت موجودة
  const imageGroups = [];
  if (report.images && report.images.length > 0) {
    for (let i = 0; i < report.images.length; i += 3) {
      imageGroups.push(report.images.slice(i, i + 3));
    }
  }

  return (
    <div className="container mx-auto px-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <article className="max-w-full mx-5 bg-white overflow-hidden my-12 px-5">
        <div className="p-6 md:p-8">
          {/* زر العودة */}
          <div className="mb-6">
            <Link 
              to="/research-and-insights" 
              className={`inline-flex items-center text-[#BB2632] hover:text-opacity-80 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <span className={`font-medium ${isRTL ? 'mr-2' : 'ml-2'}`}>
                {isRTL ? 'العودة إلى الأبحاث والرؤى' : 'Back to Research & Insights'}
              </span>
            </Link>
          </div>

          {/* العنوان */}
          <h1 className={`text-4xl font-bold text-gray-900 mb-8 ${isRTL ? 'font-medium' : ''}`}>
            {report.title}
          </h1>

          {/* معلومات الكاتب */}
          {(report.author_name || report.author_position) && (
            <div className="mb-8 pb-6 border-b border-gray-200">
              {report.author_name && (
                <h3 className={`font-semibold text-gray-900 text-xl ${isRTL ? 'font-medium' : ''}`}>
                  {report.author_name}
                </h3>
              )}
              {report.author_position && (
                <p className="text-gray-600 mt-2">{report.author_position}</p>
              )}
            </div>
          )}

          {/* محتوى مختصر */}
          {report.excerpt && (
            <div className="mb-6 text-lg text-gray-700 leading-relaxed">
              <p className={isRTL ? 'leading-loose' : ''}>{report.excerpt}</p>
            </div>
          )}

          {/* المحتوى الكامل */}
          {report.content && (
            <div className="mb-6 text-lg text-gray-700 leading-relaxed bahnschrift ">
              <p className={isRTL ? 'leading-loose' : ''}>{report.content}</p>
            </div>
          )}

          {/* صورة الغلاف */}
          {report.image && (
            <div className="my-12">
              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-lg">
                <img
                  src={report.image}
                  alt={report.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* الوصف الأول */}
          {report.first_description && (
            <div className="my-12 text-lg text-gray-700 leading-relaxed">
              <h2 className={`text-2xl font-bold text-gray-900 mb-4 ${isRTL ? 'font-medium' : ''}`}>
               
              </h2>
              <p className={isRTL ? 'leading-loose' : ''}>{report.first_description}</p>
            </div>
          )}

        
          {imageGroups.length > 0 && (
            <div className="mb-12 space-y-8">
              {imageGroups.map((group, groupIndex) => (
                <div key={groupIndex} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {group.map((image, index) => (
                    <div key={index} className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-lg">
                      <img
                        src={image.image}
                        alt={image.alt_text || report.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* الوصف الثاني */}
          {report.second_description && (
            <div className="my-12 text-lg text-gray-700 leading-relaxed">
          
              <p className={isRTL ? 'leading-loose' : ''}>{report.second_description}</p>
            </div>
          )}

          {/* الوصف الثالث */}
          {report.third_description && (
            <div className="my-12 text-lg text-gray-700 leading-relaxed">
             
              <p className={isRTL ? 'leading-loose' : ''}>{report.third_description}</p>
            </div>
          )}

       

        
          
        </div>
      </article>

      {/* التقارير ذات الصلة - يمكن إضافتها لاحقًا */}
    </div>
  );
};

export default ReportDetails; 