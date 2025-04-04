import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getPrivacyPolicy, setAPILanguage } from '../../services/api';

export default function PrivacyPolicy() {
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    const fetchPrivacyPolicy = async () => {
      try {
        setLoading(true);
        setError(null);
        setAPILanguage(i18n.language);
        const data = await getPrivacyPolicy();
        setPolicy(data);
      } catch (err) {
        console.error('Error fetching privacy policy:', err);
        setError(err.message || (isRTL ? 'فشل تحميل المحتوى' : 'Failed to load content'));
      } finally {
        setLoading(false);
      }
    };

    fetchPrivacyPolicy();
  }, [i18n.language, isRTL]);

  if (loading) {
    return (
      <section className="min-h-screen flex flex-col justify-center items-center px-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#BB2632]"></div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen flex flex-col justify-center items-center px-4">
        <div className="bg-white bg-opacity-75 p-4 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      </section>
    );
  }

  if (!policy) {
    return (
      <section className="min-h-screen flex flex-col justify-center items-center px-4">
        <div className="bg-white bg-opacity-75 p-4 rounded-lg">
          <p className="text-gray-600">{isRTL ? 'لا توجد سياسة خصوصية متاحة' : 'No privacy policy available'}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen flex flex-col justify-center items-center px-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <h1 className='text-center text-black py-12 text-[30px] pb-10'>{policy.title}</h1>
      <div className='text-start leading-7 mx-auto max-w-[1200px] w-full text-sm py-10 bahnschrift text-[16px]' 
        dangerouslySetInnerHTML={{ __html: policy.description }}
      />
    </section>
  );
}
