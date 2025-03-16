import React from 'react';
import { useTranslation } from 'react-i18next';
import { CustomSvg } from './custom-svg';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <button 
      onClick={toggleLanguage} 
      className="flex items-center space-x-2 cursor-pointer"
      aria-label={i18n.language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
    >
      <CustomSvg name="Language" className="w-6 h-6 text-red-800" />
      <span className="text-sm font-medium hidden md:inline-block">
        {i18n.language === 'ar' ? 'English' : 'العربية'}
      </span>
    </button>
  );
};

export default LanguageSwitcher; 