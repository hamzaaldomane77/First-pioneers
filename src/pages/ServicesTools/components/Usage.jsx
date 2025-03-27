import React from 'react';
import { useTranslation } from 'react-i18next';


const Usage = ({ serviceDetails }) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  // استخراج بيانات الاستكشاف المتعلقة بالاستخدام
  const usageInfo = serviceDetails?.explores?.find(item => 
    item.title.toLowerCase().includes('usage') || 
    item.title.includes('استخدام') ||
    item.title.toLowerCase().includes('use')
  );

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-5">
        <div className="flex items-center mb-4">
          <FaUsers className="text-red-600 text-2xl" />
          <h3 className={`text-xl font-bold ${isRtl ? 'mr-3' : 'ml-3'}`}>
            {t('Usage')}
          </h3>
        </div>
        <div className="border-t pt-4">
          {usageInfo ? (
            <p className="text-gray-700">{usageInfo.answers}</p>
          ) : (
            <p className="text-gray-500 italic">{t('No usage information available')}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Usage;
