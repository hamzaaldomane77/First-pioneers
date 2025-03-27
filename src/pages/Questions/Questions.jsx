import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getFrequentlyAskedQuestions, setAPILanguage } from '../../services/api';

export default function Questions() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  // حالة لتخزين الأسئلة القادمة من API
  const [questions, setQuestions] = useState([]);
  // حالة لتخزين جميع الفئات المتاحة
  const [categories, setCategories] = useState([]);
  // حالة لتتبع الفئة النشطة
  const [activeCategory, setActiveCategory] = useState('all');
  // حالة لتخزين الأسئلة المصفاة
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  // حالات للتحميل والأخطاء
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // جلب الأسئلة من API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError(null);
        setAPILanguage(i18n.language);
        
        const data = await getFrequentlyAskedQuestions();
        setQuestions(data);
        
        // استخراج الفئات الفريدة من الأسئلة
        const uniqueCategories = [...new Set(data.map(q => q.category?.name))].filter(Boolean);
        setCategories([
          { id: 'all', name: t('questions.allCategories', isRTL ? 'جميع الأسئلة' : 'All Questions') },
          ...uniqueCategories.map(category => ({ id: category, name: category }))
        ]);
      } catch (error) {
        console.error('Error in Questions component:', error);
        setError(error.message || t('common.error', isRTL ? 'فشل تحميل المحتوى' : 'Failed to load content'));
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [i18n.language, t, isRTL]);

  // تحديث الأسئلة المصفاة عند تغيير الفئة النشطة أو عند تحديث الأسئلة
  useEffect(() => {
    if (activeCategory === 'all') {
      // إذا كان "جميع الأسئلة" محدداً، اعرض جميع الأسئلة
      setFilteredQuestions(questions);
    } else {
      // عند اختيار فئة محددة، قم بتصفية الأسئلة
      const filtered = questions.filter(q => q.category?.name === activeCategory);
      
      // إذا لم يتم العثور على أسئلة في الفئة المحددة، استخدم أسئلة من فئات أخرى
      if (filtered.length === 0 && questions.length > 0) {
        setFilteredQuestions(questions);
      } else {
        setFilteredQuestions(filtered);
      }
    }
  }, [activeCategory, questions]);

  // معالج النقر على الفئة
  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
  };

  if (loading) {
    return (
      <section className="py-20 px-4 max-w-7xl mx-auto flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#BB2632]"></div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">{t('common.error', isRTL ? 'خطأ' : 'Error')}:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 px-4 max-w-7xl mx-auto" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* العنوان */}
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800">
        {t('questions.title', isRTL ? 'الأسئلة الشائعة' : 'Frequently Asked Questions')}
      </h1>

      {/* شريط التنقل للتصفية */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {categories.map(category => (
          <button
            key={category.id}
            className={`px-4 py-2 rounded-full transition-colors ${
              activeCategory === category.id
                ? 'bg-red-700 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => handleCategoryClick(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* عرض الأسئلة المصفاة */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredQuestions.map(question => (
          <div 
            key={question.id} 
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100"
          >
            <span className="inline-block px-3 py-1 rounded-full text-xs bg-red-100 text-red-800 mb-3">
              {question.category?.name || t('questions.uncategorized', isRTL ? 'غير مصنف' : 'Uncategorized')}
            </span>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">{question.title}</h3>
            <p className="text-gray-600">{question.description}</p>
          </div>
        ))}
      </div>

      {/* رسالة في حالة عدم وجود أسئلة */}
      {filteredQuestions.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">
            {t('questions.noQuestions', isRTL ? 'لا توجد أسئلة لهذه الفئة.' : 'No questions found for this category.')}
          </p>
        </div>
      )}
    </section>
  );
}
