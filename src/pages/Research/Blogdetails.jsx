import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getBlogs, setAPILanguage } from '../../services/api';
import { useTranslation } from 'react-i18next';
import CardArticles from '../Markets&Resources/components/CardArticles';
import './blogdetails.css';

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
        console.log(blogs);
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

  // تنظيف محتوى HTML والتعامل مع الصور بعد تحميل المكون
  useEffect(() => {
    if (blog && blog.content) {
      // إزالة كل عناصر figcaption
      const removeFigcaptions = () => {
        const figcaptions = document.querySelectorAll('.custom-html figcaption');
        figcaptions.forEach(figcaption => {
          figcaption.remove();
        });
      };

      // معالجة معارض الصور
      const processGalleries = () => {
        // معالجة معارض مصنفة
        const galleries = document.querySelectorAll('.custom-html .attachment-gallery');
        galleries.forEach(gallery => {
          const figures = gallery.querySelectorAll('figure');
          if (figures.length === 2) {
            gallery.classList.add('two-images');
          } else if (figures.length >= 3) {
            gallery.classList.add('three-plus-images');
          }
        });

        // البحث عن صور متتالية غير مصنفة كمعرض
        const paragraphs = document.querySelectorAll('.custom-html > p');
        let consecutiveImgParagraphs = [];

        for (let i = 0; i < paragraphs.length; i++) {
          const hasImg = paragraphs[i].querySelector('img') !== null;
          const hasText = paragraphs[i].textContent.trim().length > 0 && 
                          !paragraphs[i].textContent.includes('KB') && 
                          !paragraphs[i].textContent.includes('png') &&
                          !paragraphs[i].textContent.includes('jpg');
          
          if (hasImg && !hasText) {
            consecutiveImgParagraphs.push(paragraphs[i]);
          } else {
            // معالجة مجموعة الصور المتتالية السابقة
            if (consecutiveImgParagraphs.length === 2) {
              const wrapper = document.createElement('div');
              wrapper.className = 'custom-two-images';
              consecutiveImgParagraphs[0].parentNode.insertBefore(wrapper, consecutiveImgParagraphs[0]);
              consecutiveImgParagraphs.forEach(p => wrapper.appendChild(p));
            } else if (consecutiveImgParagraphs.length >= 3) {
              const wrapper = document.createElement('div');
              wrapper.className = 'custom-three-plus-images';
              consecutiveImgParagraphs[0].parentNode.insertBefore(wrapper, consecutiveImgParagraphs[0]);
              consecutiveImgParagraphs.forEach(p => wrapper.appendChild(p));
            }
            
            // إعادة تعيين المصفوفة
            consecutiveImgParagraphs = [];
          }
        }

        // معالجة أي صور متبقية في النهاية
        if (consecutiveImgParagraphs.length === 2) {
          const wrapper = document.createElement('div');
          wrapper.className = 'custom-two-images';
          consecutiveImgParagraphs[0].parentNode.insertBefore(wrapper, consecutiveImgParagraphs[0]);
          consecutiveImgParagraphs.forEach(p => wrapper.appendChild(p));
        } else if (consecutiveImgParagraphs.length >= 3) {
          const wrapper = document.createElement('div');
          wrapper.className = 'custom-three-plus-images';
          consecutiveImgParagraphs[0].parentNode.insertBefore(wrapper, consecutiveImgParagraphs[0]);
          consecutiveImgParagraphs.forEach(p => wrapper.appendChild(p));
        }
      };

      // تنفيذ المعالجة بعد تحديث DOM
      setTimeout(() => {
        removeFigcaptions();
        processGalleries();
      }, 300);
    }
  }, [blog]);

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

  const renderGallery = (images) => {
    if (!images || images.length === 0) return null;

    
    if (images.length === 1) {
      return (
        <div className="mb-8">
          <img src={images[0]} alt="" className="w-full md:max-w-2xl lg:max-w-3xl mx-auto h-auto rounded-lg shadow-md p-4" />
        </div>
      );
    }
    
    
    if (images.length === 2) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 max-w-3xl lg:max-w-4xl mx-auto">
          {images.map((image, idx) => (
            <div key={idx} className="aspect-w-32 aspect-h-9 rounded-lg shadow-md overflow-hidden">
              <img src={image} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      );
    }
    
    
    if (images.length === 3) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-4xl lg:max-w-5xl mx-auto">
          {images.map((image, idx) => (
            <div key={idx} className="aspect-w-16 aspect-h-9 rounded-lg shadow-md overflow-hidden">
              <img src={image} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      );
    }
    
    
    const rows = [];
    for (let i = 0; i < images.length; i += 3) {
      const rowImages = images.slice(i, i + 3);
      rows.push(
        <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-4xl lg:max-w-5xl mx-auto">
          {rowImages.map((image, idx) => (
            <div key={idx} className="aspect-w-16 aspect-h-9 rounded-lg shadow-md overflow-hidden">
              <img src={image} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      );
    }
    
    return <div className="mb-8">{rows}</div>;
  };

  // عرض المحتوى باستخدام html-react-parser
  const renderContent = () => {
    if (!blog.content) return null;
    
    const options = {
      replace: domNode => {
        
        if (domNode.name === 'figcaption') {
          return <></>;
        }
        
        if (domNode.name === 'img') {
          return (
            <div className="mb-8">
              <img 
                src={domNode.attribs.src} 
                alt={domNode.attribs.alt || ''} 
                className="w-full md:max-w-2xl lg:max-w-3xl mx-auto h-auto rounded-lg shadow-md" 
              />
            </div>
          );
        }
        
        if (domNode.name === 'figure' && domNode.children.some(child => child.name === 'img')) {
          // إزالة عنصر figcaption من العناصر الفرعية
          const children = domNode.children.filter(child => child.name !== 'figcaption');
          const imgNode = children.find(child => child.name === 'img');
          
          if (imgNode) {
            return (
              <div className="mb-8">
                <img 
                  src={imgNode.attribs.src} 
                  alt={imgNode.attribs.alt || ''} 
                  className="w-full md:max-w-2xl lg:max-w-3xl mx-auto h-auto rounded-lg shadow-md" 
                />
              </div>
            );
          }
        }
        
        if (domNode.name === 'div' && domNode.attribs && domNode.attribs.class && 
            (domNode.attribs.class.includes('attachment-gallery') || domNode.attribs.class.includes('gallery'))) {
          const galleryImages = [];
          domNode.children.forEach(child => {
            if (child.name === 'figure') {
              // إزالة عنصر figcaption من العناصر الفرعية
              const figChildren = child.children.filter(figChild => figChild.name !== 'figcaption');
              const imgNode = figChildren.find(c => c.name === 'img');
              
              if (imgNode && imgNode.attribs && imgNode.attribs.src) {
                galleryImages.push(imgNode.attribs.src);
              }
            }
          });
          
          if (galleryImages.length > 0) {
            return renderGallery(galleryImages);
          }
        }
      }
    };
    
    // إذا كانت هناك أقسام محتوى معالجة، استخدمها
    if (blog.contentSections && blog.contentSections.length > 0) {
      return blog.contentSections.map((section, index) => {
        if (section.type === 'text') {
          // استخدام العلامة المناسبة للنص
          if (section.tag === 'h1') {
            return (
              <h1 key={index} className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 text-gray-900 bahnschrift">{section.content}</h1>
            );
          } else if (section.tag === 'h2') {
            return (
              <h2 key={index} className="text-xl md:text-2xl lg:text-3xl font-bold mb-5 text-gray-900 bahnschrift">{section.content}</h2>
            );
          } else if (section.tag === 'h3') {
            return (
              <h3 key={index} className="text-lg md:text-xl lg:text-2xl font-semibold mb-4 text-gray-900 bahnschrift">{section.content}</h3>
            );
          } else if (section.tag === 'h4') {
            return (
              <h4 key={index} className="text-base md:text-lg lg:text-xl font-semibold mb-3 text-gray-900 bahnschrift">{section.content}</h4>
            );
          } else {
            return (
              <p key={index} className="mb-6 text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed bahnschrift">{section.content}</p>
            );
          }
        } else if (section.type === 'image') {
          return (
            <div key={index} className="mb-8">
              <img src={section.src} alt="" className="w-full md:max-w-2xl lg:max-w-3xl mx-auto h-auto rounded-lg shadow-md" />
            </div>
          );
        } else if (section.type === 'gallery') {
          return (
            <div key={index}>
              {renderGallery(section.images)}
            </div>
          );
        } else if (section.type === 'list') {
          return (
            <div 
              key={index} 
              className="mb-6 text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed bahnschrift" 
              dangerouslySetInnerHTML={{ __html: section.content }}
            />
          );
        }
        
        return null;
      });
    }
    
    
    return (
      <div className="blog-content mb-8 bahnschrift text-base md:text-lg lg:text-xl">
        {parse(blog.content, options)}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-0 md:px-2" dir={isRTL ? 'rtl' : 'ltr'}>
      <article className="max-w-full mx-0 bg-white overflow-hidden my-8 md:my-12 px-2 md:px-4">
        <div className="p-2 md:p-4">
          {/* التصنيفات */}
          {blog.categories && blog.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4 md:mb-6">
              {blog.categories.map((category, index) => (
                <span
                  key={index}
                  className=" text-[#BB2632] border border-[#BB2632] px-3 py-1 rounded-full text-xs md:text-sm font-medium hover:bg-[#BB2632] hover:text-white bahnschrift"
                >
                  {category}
                </span>
              ))}
            </div>
          )}

      
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-8 bahnschrift">{blog.title}</h1>

          
          <div className="mb-4 md:mb-6 pb-3 md:pb-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 text-lg md:text-xl bahnschrift">{blog.author_name}</h3>
            {blog.author_position && (
              <p className="text-gray-600 mt-1 md:mt-2 text-sm md:text-base bahnschrift">{blog.author_position}</p>
            )}
          </div>

         
          <div className="mb-6 md:mb-8">
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-lg md:max-w-3xl lg:max-w-4xl mx-auto">
              <img
                src={blog.cover_image}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* عرض المحتوى باستخدام dangerouslySetInnerHTML مع فئة CSS مخصصة */}
          <div className="custom-html-container mx-0 md:mx-auto md:max-w-3xl lg:max-w-4xl">
            <div className="custom-html bahnschrift" dangerouslySetInnerHTML={{ __html: blog.content }} />
          </div>
        </div>
      </article>
      <CardArticles />
    </div>
  );
};

export default BlogDetails;  