import React, { useState, useEffect } from 'react';

export default function Questions() {
  // قائمة التصنيفات للتصفية
  const tags = [
    { id: 'all', name: 'All Questions' },
    { id: 'services', name: 'Services' },
    { id: 'tools', name: 'Tools' },
    { id: 'contacting', name: 'Contacting Us' },
    { id: 'articles', name: 'Articles' },
    { id: 'other', name: 'Other' }
  ];

  // مصفوفة بيانات الأسئلة النموذجية
  const questionsData = [
    {
      id: 1,
      tag: 'services',
      title: 'What consulting services do you offer?',
      description: 'Our consulting services cover market analysis, brand strategy, consumer behavior research, and competitive landscape assessments.',
    },
    {
      id: 2,
      tag: 'tools',
      title: 'How can I access your analytics tools?',
      description: 'Our analytics tools are available through our client portal after registration. You can request access through the contact form.',
    },
    {
      id: 3,
      tag: 'contacting',
      title: 'What is your typical response time?',
      description: 'We typically respond to inquiries within 24 hours during business days. Urgent matters are prioritized.',
    },
    {
      id: 4,
      tag: 'articles',
      title: 'How often do you publish new research?',
      description: 'We publish new research articles weekly, focusing on emerging trends and market shifts in various sectors.',
    },
    {
      id: 5,
      tag: 'services',
      title: 'Do you offer customized solutions?',
      description: 'Yes, we tailor our services to meet the specific needs of each client, developing personalized strategies.',
    },
    {
      id: 6,
      tag: 'tools',
      title: 'Are your tools compatible with mobile devices?',
      description: 'All our tools are fully responsive and optimized for use on mobile devices, tablets, and desktop computers.',
    },
    {
      id: 7,
      tag: 'contacting',
      title: 'Do you offer international support?',
      description: 'Yes, we provide support across multiple time zones and have team members fluent in several languages.',
    },
    {
      id: 8,
      tag: 'articles',
      title: 'Can I request a specific research topic?',
      description: 'We welcome topic suggestions from our clients and often develop custom research based on industry needs.',
    },
    {
      id: 9,
      tag: 'other',
      title: 'What industries do you specialize in?',
      description: 'We specialize in retail, technology, healthcare, financial services, and consumer goods sectors.',
    },
    {
      id: 10,
      tag: 'other',
      title: 'Do you offer training workshops?',
      description: 'Yes, we conduct both virtual and in-person training workshops on market research and analytics.',
    }
  ];

  // حالة لتتبع التصنيف النشط
  const [activeTag, setActiveTag] = useState('all');
  // حالة لتخزين الأسئلة المصفاة
  const [filteredQuestions, setFilteredQuestions] = useState([]);

  // تحديث الأسئلة المصفاة عند تغيير التصنيف النشط
  useEffect(() => {
    if (activeTag === 'all') {
      // إذا كان "جميع الأسئلة" محدداً، اعرض آخر 6 أسئلة
      setFilteredQuestions(questionsData.slice(-6));
    } else {
      // عند اختيار تصنيف محدد، قم بتصفية الأسئلة وعرض آخر 6 منها
      const filtered = questionsData.filter(q => q.tag === activeTag);
      setFilteredQuestions(filtered.slice(-6));
    }
  }, [activeTag]);

  // معالج النقر على التصنيف
  const handleTagClick = (tagId) => {
    setActiveTag(tagId);
  };

  return (
    <section className="py-12 px-4 max-w-7xl mx-auto">
      {/* العنوان */}
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800">
        Frequently Asked Questions
      </h1>

      {/* شريط التنقل للتصفية */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {tags.map(tag => (
          <button
            key={tag.id}
            className={`px-4 py-2 rounded-full transition-colors ${
              activeTag === tag.id
                ? 'bg-red-700 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => handleTagClick(tag.id)}
          >
            {tag.name}
          </button>
        ))}
      </div>

   
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredQuestions.map(question => (
          <div 
            key={question.id} 
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100"
          >
            <span className="inline-block px-3 py-1 rounded-full text-xs bg-red-100 text-red-800 mb-3">
              {tags.find(t => t.id === question.tag)?.name || question.tag}
            </span>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">{question.title}</h3>
            <p className="text-gray-600">{question.description}</p>
          </div>
        ))}
      </div>

      {/* رسالة في حالة عدم وجود نتائج */}
      {filteredQuestions.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">No questions found for this category.</p>
        </div>
      )}
    </section>
  );
}
