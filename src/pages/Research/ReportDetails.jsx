import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getFeaturedReportById, setAPILanguage } from '../../services/api';
import { useTranslation } from 'react-i18next';
import './blogdetails.css'; // استيراد ملف CSS المشترك مع تفاصيل المدونة

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

  // تنظيف محتوى HTML والتعامل مع الصور بعد تحميل المكون
  useEffect(() => {
    if (report && report.content) {
      // إزالة كل عناصر figcaption
      const removeFigcaptions = () => {
        const figcaptions = document.querySelectorAll('.custom-html figcaption');
        figcaptions.forEach(figcaption => {
          figcaption.remove();
        });
      };

      // معالجة معارض الصور
      const processGalleries = () => {
        // معالجة معارض مصنفة
        const galleries = document.querySelectorAll('.custom-html .attachment-gallery');
        galleries.forEach(gallery => {
          const figures = gallery.querySelectorAll('figure');
          if (figures.length === 2) {
            gallery.classList.add('two-images');
          } else if (figures.length >= 3) {
            gallery.classList.add('three-plus-images');
          }
        });

        // البحث عن صور متتالية غير مصنفة كمعرض
        const paragraphs = document.querySelectorAll('.custom-html > p');
        let consecutiveImgParagraphs = [];

        for (let i = 0; i < paragraphs.length; i++) {
          const hasImg = paragraphs[i].querySelector('img') !== null;
          const hasText = paragraphs[i].textContent.trim().length > 0 && 
                          !paragraphs[i].textContent.includes('KB') && 
                          !paragraphs[i].textContent.includes('png') &&
                          !paragraphs[i].textContent.includes('jpg');
          
          if (hasImg && !hasText) {
            consecutiveImgParagraphs.push(paragraphs[i]);
          } else {
            // معالجة مجموعة الصور المتتالية السابقة
            if (consecutiveImgParagraphs.length === 2) {
              const wrapper = document.createElement('div');
              wrapper.className = 'custom-two-images';
              consecutiveImgParagraphs[0].parentNode.insertBefore(wrapper, consecutiveImgParagraphs[0]);
              consecutiveImgParagraphs.forEach(p => wrapper.appendChild(p));
            } else if (consecutiveImgParagraphs.length >= 3) {
              const wrapper = document.createElement('div');
              wrapper.className = 'custom-three-plus-images';
              consecutiveImgParagraphs[0].parentNode.insertBefore(wrapper, consecutiveImgParagraphs[0]);
              consecutiveImgParagraphs.forEach(p => wrapper.appendChild(p));
            }
            
            // إعادة تعيين المصفوفة
            consecutiveImgParagraphs = [];
          }
        }

        if (consecutiveImgParagraphs.length === 2) {
          const wrapper = document.createElement('div');
          wrapper.className = 'custom-two-images';
          consecutiveImgParagraphs[0].parentNode.insertBefore(wrapper, consecutiveImgParagraphs[0]);
          consecutiveImgParagraphs.forEach(p => wrapper.appendChild(p));
        } else if (consecutiveImgParagraphs.length >= 3) {
          const wrapper = document.createElement('div');
          wrapper.className = 'custom-three-plus-images';
          consecutiveImgParagraphs[0].parentNode.insertBefore(wrapper, consecutiveImgParagraphs[0]);
          consecutiveImgParagraphs.forEach(p => wrapper.appendChild(p));
        }
      };

      // تنفيذ المعالجة بعد تحديث DOM
      setTimeout(() => {
        removeFigcaptions();
        processGalleries();
      }, 300);
    }
  }, [report]);

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
    <div className="container mx-auto px-0 md:px-2" dir={isRTL ? 'rtl' : 'ltr'}>
      <article className="max-w-full mx-0 bg-white overflow-hidden my-8 md:my-12 px-2 md:px-4">
        <div className="p-2 md:p-4">
          {/* زر العودة */}
          <div className="mb-6">
            <Link 
              to="/research-and-insights" 
              className={`inline-flex items-center text-[#BB2632] hover:text-opacity-80 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <span className={`font-medium bahnschrift ${isRTL ? 'mr-2' : 'ml-2'}`}>
                {isRTL ? 'العودة إلى الأبحاث والرؤى' : 'Back to Research & Insights'}
              </span>
            </Link>
          </div>

          {/* العنوان */}
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-8 bahnschrift">{report.title}</h1>

          {/* معلومات الكاتب */}
          <div className="mb-4 md:mb-6 pb-3 md:pb-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 text-lg md:text-xl bahnschrift">{report.author_name}</h3>
            {report.author_position && (
              <p className="text-gray-600 mt-1 md:mt-2 text-sm md:text-base bahnschrift">{report.author_position}</p>
            )}
          </div>

          {/* محتوى مختصر */}
          {report.excerpt && (
            <div className="mb-6 text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed bahnschrift">
              <p>{report.excerpt}</p>
            </div>
          )}

        
          <div className="custom-html-container mx-0 md:mx-auto md:max-w-3xl lg:max-w-4xl">
            <div className="custom-html bahnschrift" dangerouslySetInnerHTML={{ __html: report.content }} />
          </div>

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

      
    </div>
  );
};

export default ReportDetails; 