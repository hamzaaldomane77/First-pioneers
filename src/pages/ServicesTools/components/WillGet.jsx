import React from 'react';
import { useTranslation } from 'react-i18next';


const WillGet = ({ serviceDetails }) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  // استخراج بيانات الاستكشاف المتعلقة بما ستحصل عليه
  const benefitsInfo = serviceDetails?.explores?.find(item => 
    item.title.toLowerCase().includes('benefit') || 
    item.title.includes('فوائد') ||
    item.title.toLowerCase().includes('get') ||
    item.title.includes('ستحصل')
  );

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-5">
        <div className="flex items-center mb-4">
          <FaCheckCircle className="text-red-600 text-2xl" />
          <h3 className={`text-xl font-bold ${isRtl ? 'mr-3' : 'ml-3'}`}>
            {t('What You Will Get')}
          </h3>
        </div>
        <div className="border-t pt-4">
          {benefitsInfo ? (
            <p className="text-gray-700">{benefitsInfo.answers}</p>
          ) : (
            <p className="text-gray-500 italic">{t('No benefits information available')}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WillGet;