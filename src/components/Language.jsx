import React from 'react';
import { useTranslation } from 'react-i18next';
import { CustomSvg } from './custom-svg';
import { useEffect } from 'react';
import { setAPILanguage } from '../services/api';

export default function Language() {
  const { i18n } = useTranslation();

  // التأكد من تطبيق اتجاه اللغة الصحيح عند تحميل المكون
  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
    setAPILanguage(newLang); // تحديث لغة API
    
    // تحديث اتجاه الصفحة
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    
    // حفظ اللغة في التخزين المحلي
    localStorage.setItem('i18nextLng', newLang);
    
    // إعادة تحميل الصفحة لتطبيق التغييرات على جميع المكونات (اختياري)
    // window.location.reload();
  };

  return (
    <button 
      onClick={toggleLanguage}
      className="flex items-center justify-center cursor-pointer relative"
      aria-label={i18n.language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
    >
      <CustomSvg name="Language" className="w-6 h-6 text-red-800" />
      <span className="absolute -top-1 -right-1 text-xs font-bold bg-red-100 rounded-full w-4 h-4 flex items-center justify-center">
        {i18n.language === 'ar' ? 'ع' : 'E'}
      </span>
    </button>
  );
} 