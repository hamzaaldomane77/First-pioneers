import React, { useState, useEffect } from 'react';
import Redbackground from "../../../assets/images/Redbackground.png";
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getTeamMembers, setAPILanguage } from '../../../services/api';

export default function CardTeam() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setLoading(true);
        setError(null);
        setAPILanguage(i18n.language);
        
        const data = await getTeamMembers();
        setTeamMembers(data);
      } catch (error) {
        console.error('Error in CardTeam component:', error);
        setError(error.message || t('common.error', isRTL ? 'فشل تحميل المحتوى' : 'Failed to load content'));
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, [i18n.language, t]);

  // دالة لاقتطاع النص إلى عدد معين من الأحرف مع إضافة ... في النهاية
  const truncateText = (text, maxLength = 120) => {
    if (!text || text.length <= maxLength) return text;
    return text.substr(0, maxLength).trim() + '...';
  };

  if (loading) {
    return (
      <section
        className="min-h-screen bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${Redbackground})` }}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </section>
    );
  }

  if (error) {
    return (
      <section
        className="min-h-screen bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${Redbackground})` }}
      >
        <div className="bg-white bg-opacity-75 p-4 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      </section>
    );
  }

  if (teamMembers.length === 0) {
    return (
      <section
        className="min-h-screen bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${Redbackground})` }}
      >
        <div className="bg-white bg-opacity-75 p-4 rounded-lg">
          <p className="text-gray-600">{isRTL ? 'لا يوجد أعضاء فريق متاحين' : 'No team members available'}</p>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`min-h-screen bg-cover bg-center transition-all duration-1000 p-6 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
      style={{ backgroundImage: `url(${Redbackground})` }}
      ref={ref}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className='py-20'>
        <h1 className="text-[#BB2632] lg:text-5xl text-center pt-24">
          {isRTL ? 'تعرف على فريقنا' : 'Meet Our Team'}
        </h1>
        <p className='text-center lg:text-xl mt-4 mb-8'>
          {isRTL 
            ? 'نحن فخورون بتقديم فريق الخبراء لدينا الذي يغطي معظم المجالات في عالم البحث' 
            : 'We are proud to present to you our team of experts which covers most of the fields in the world of research'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-10 pb-32">
        {teamMembers.map(member => (
          <div 
            key={member.id} 
            className="overflow-hidden shadow-lg rounded-lg transition-all duration-500 hover:scale-105 cursor-pointer group block bg-white"
          >
            <div className="relative h-60">
              <img 
                src={member.avatar} 
                alt={member.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
              />
            </div>
            <div className="p-6 text-center">
              <h3 className="text-lg font-semibold transition-all duration-500 group-hover:text-[#BB2632]">{member.name}</h3>
              <p className="text-[#BB2632] font-medium my-2">{member.position}</p>
              <p className="text-sm text-[#333333] my-4">{truncateText(member.description, 150)}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}