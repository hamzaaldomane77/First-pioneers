import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getBlogs, setAPILanguage, fixImageUrl } from '../../services/api';
import { useTranslation } from 'react-i18next';
import CardArticles from '../Markets&Resources/components/CardArticles';
import parse from 'html-react-parser';

const BlogDetails = () => {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        setAPILanguage(i18n.language);
        const blogs = await getBlogs();
        const foundBlog = blogs.find(b => b.slug === slug);
        if (foundBlog) {
          setBlog(foundBlog);
        } else {
          setError(t('blog.notFound'));
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogDetails();
  }, [slug, t, i18n.language]);

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

  if (!blog) {
    return (
      <div className="container mx-auto px-4 min-h-screen flex items-center justify-center">
        <p className="text-gray-600">{t('blog.notFound')}</p>
      </div>
    );
  }

  // عرض المحتوى باستخدام html-react-parser
  const renderContent = () => {
    if (!blog.content) return null;
    
    const options = {
      replace: domNode => {
        // إزالة عنصر figcaption
        if (domNode.name === 'figcaption') {
          return null;
        }
        
        // معالجة الصور
        if (domNode.name === 'img') {
          return (
            <div className="mb-8">
              <img 
                src={domNode.attribs.src} 
                alt={domNode.attribs.alt || ''} 
                className="w-full h-auto rounded-lg shadow-md"
              />
            </div>
          );
        }
        
        // معالجة العناصر figure التي تحتوي على صور
        if (domNode.name === 'figure' && domNode.children && domNode.children.some(child => child.name === 'img')) {
          // إيجاد عنصر الصورة
          const imgNode = domNode.children.find(child => child.name === 'img');
          if (imgNode && imgNode.attribs && imgNode.attribs.src) {
            return (
              <div className="mb-8">
                <img 
                  src={imgNode.attribs.src} 
                  alt={imgNode.attribs.alt || ''} 
                  className="w-full h-auto rounded-lg shadow-md"
                />
              </div>
            );
          }
        }
        
        // معالجة معارض الصور
        if (domNode.name === 'div' && domNode.attribs && domNode.attribs.class &&
            (domNode.attribs.class.includes('attachment-gallery') || domNode.attribs.class.includes('gallery'))) {
          
          // جمع صور المعرض
          const galleryImages = [];
          if (domNode.children) {
            domNode.children.forEach(child => {
              if (child.name === 'figure') {
                const imgNode = child.children && child.children.find(c => c.name === 'img');
                if (imgNode && imgNode.attribs && imgNode.attribs.src) {
                  galleryImages.push(imgNode.attribs.src);
                }
              }
            });
          }
          
          if (galleryImages.length > 0) {
            // صورة واحدة
            if (galleryImages.length === 1) {
              return (
                <div className="mb-8">
                  <img src={galleryImages[0]} alt="" className="w-full h-auto rounded-lg shadow-md" />
                </div>
              );
            }
            
            // صورتان
            if (galleryImages.length === 2) {
              return (
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {galleryImages.map((image, idx) => (
                    <div key={idx} className="aspect-w-16 aspect-h-9 rounded-lg shadow-md overflow-hidden">
                      <img src={image} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              );
            }
            
            // ثلاث صور أو أكثر
            return (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {galleryImages.map((image, idx) => (
                  <div key={idx} className="aspect-w-16 aspect-h-9 rounded-lg shadow-md overflow-hidden">
                    <img src={image} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            );
          }
        }
        
        return undefined;
      }
    };
    
    return (
      <div className="blog-content mb-8 text-lg text-gray-700 leading-relaxed">
        {parse(blog.content, options)}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <article className="max-w-full mx-5 bg-white overflow-hidden my-12 px-5">
        <div className="p-6 md:p-8">
          {/* التصنيفات */}
          {blog.categories && blog.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {blog.categories.map((category, index) => (
                <span
                  key={index}
                  className="bg-white text-[#BB2632] border border-[#BB2632] px-4 py-1 rounded-full text-sm font-medium hover:bg-[#BB2632] hover:text-white bahnschrift text-[16px]"
                >
                  {category}
                </span>
              ))}
            </div>
          )}

          {/* العنوان */}
          <h1 className="text-4xl font-bold text-gray-900 mb-8">{blog.title}</h1>

          {/* معلومات الكاتب */}
          <div className="mb-8 pb-6 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 text-xl">{blog.author_name}</h3>
            {blog.author_position && (
              <p className="text-gray-600 mt-2">{blog.author_position}</p>
            )}
          </div>

          {/* صورة الغلاف */}
          <div className="mb-12">
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-lg">
              <img
                src={blog.cover_image}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* عرض المحتوى المعالج */}
          {renderContent()}
        </div>
      </article>
      <CardArticles />
    </div>
  );
};

export default BlogDetails;  