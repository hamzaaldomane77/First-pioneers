import React from 'react';
import { useTranslation } from 'react-i18next';


const Worksec = ({ serviceDetails }) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  // استخراج بيانات الاستكشاف المتعلقة بكيفية العمل
  const workInfo = serviceDetails?.explores?.find(item => 
    item.title.toLowerCase().includes('how it works') || 
    item.title.includes('كيف يعمل') ||
    item.title.toLowerCase().includes('work')
  );

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-5">
        <div className="flex items-center mb-4">
          <FaCogs className="text-red-600 text-2xl" />
          <h3 className={`text-xl font-bold ${isRtl ? 'mr-3' : 'ml-3'}`}>
            {t('How It Works')}
          </h3>
        </div>
        <div className="border-t pt-4">
          {workInfo ? (
            <p className="text-gray-700">{workInfo.answers}</p>
          ) : (
            <p className="text-gray-500 italic">{t('No information available about how this service works')}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Worksec;
