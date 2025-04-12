import axios from 'axios';
import parse from 'html-react-parser';
import { domToReact } from 'html-react-parser';
import { Element } from 'domhandler';


const API_URL = 'https://first.pioneers.backend.techpundits.net';


let currentLanguage = 'en';


if (typeof window !== 'undefined') {
  try {
    currentLanguage = localStorage.getItem('i18nextLng') || 'en';
  } catch (error) {
    console.error('Error accessing localStorage:', error);
  }
}

// تحديث اللغة الحالية
export const setAPILanguage = (lang) => {
  currentLanguage = lang;
  
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('i18nextLng', lang);
    } catch (error) {
      console.error('Error setting language in localStorage:', error);
    }
  }
};

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000, // خفض قيمة المهلة للتعامل السريع مع أخطاء الاتصال
  headers: {
    'Content-Type': 'application/json',
  }
});

// إضافة معترض لإعادة المحاولة
api.interceptors.response.use(undefined, async (err) => {
  // التعامل مع أخطاء CORS
  if (err.message && (err.message.includes('Network Error') || err.code === 'ERR_NETWORK')) {
    console.warn('Network error encountered, might be a CORS issue');
  }
  
  const config = err.config;
  if (!config || !config.retry) {
    return Promise.reject(err);
  }

  config.__retryCount = config.__retryCount || 0;

  if (config.__retryCount >= 3) { // استخدم حد ثابت لعدد إعادة المحاولات
    return Promise.reject(err);
  }

  config.__retryCount += 1;

  // تأخير قبل إعادة المحاولة
  await new Promise(resolve => setTimeout(resolve, 1000 * config.__retryCount));

  // إعادة المحاولة
  return api(config);
});

api.interceptors.request.use(
  (config) => {
    let token = null;
    
    // فقط الوصول إلى localStorage في بيئة المتصفح
    if (typeof window !== 'undefined') {
      try {
        token = localStorage.getItem('token');
      } catch (error) {
        console.error('Error accessing token from localStorage:', error);
      }
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // تحديث رأس اللغة لكل الطلبات
    config.headers['Accept-Language'] = currentLanguage;
    config.headers['Content-Language'] = currentLanguage;
    
    // إضافة معلمة اللغة للاستعلام
    config.params = {
      ...config.params,
      lang: currentLanguage
    };
    
    // إضافة معلمات لمنع التخزين المؤقت
    config.headers['Cache-Control'] = 'no-cache';
    config.headers['Pragma'] = 'no-cache';
    
    // إضافة محاولة إعادة
    config.retry = 3;
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// إضافة وظيفة مساعدة لإصلاح روابط الصور
export const fixImageUrl = (url) => {
  if (!url) return '';
  
  // التحقق مما إذا كان الرابط يحتوي على العنوان الكامل بالفعل
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // استخدام نفس نطاق الخادم الأصلي للصور مع HTTPS
  return `${API_URL}${url.startsWith('/') ? url : `/${url}`}`;
};

// وظائف API

// مثال لوظيفة جلب البيانات
export const fetchData = async (endpoint) => {
  try {
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// مثال لوظيفة إرسال البيانات
export const postData = async (endpoint, data) => {
  try {
    const response = await api.post(endpoint, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// مثال لوظيفة تحديث البيانات
export const updateData = async (endpoint, data) => {
  try {
    const response = await api.put(endpoint, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// مثال لوظيفة حذف البيانات
export const deleteData = async (endpoint) => {
  try {
    const response = await api.delete(endpoint);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// وظائف خاصة بصفحة About Us
export const getAboutHeroData = async () => {
  try {
    const response = await api.get('/api/v1/about-us', {
      params: {
        lang: currentLanguage
      }
    });

    if (!response.data?.success) {
      throw new Error('API request failed');
    }

    const data = response.data.data;
    if (!data) {
      throw new Error('No data received from API');
    }

    return data.description || '';

  } catch (error) {
    throw error;
  }
};

// وظائف خاصة بصفحة الاتصال
export const sendContactMessage = async (data) => {
  try {
    const response = await api.post('/api/v1/contact-us-messages', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// وظائف خاصة بالمدونة
export const getBlogCategories = async () => {
  try {
    const response = await api.get('/api/v1/blog-categories', {
      params: {
        perPage: 10,
        sortDirection: 'desc',
        sortBy: 'id',
        is_active: 1,
        lang: currentLanguage
      }
    });

    // التحقق من نجاح الاستجابة
    if (!response.data?.success) {
      return [];
    }

    const categories = response.data?.data?.items;
    if (!categories || !Array.isArray(categories)) {
      return [];
    }

    // تجميع كل المدونات من جميع الفئات
    const allBlogs = [];
    categories.forEach(category => {
      if (!category.blogs || !Array.isArray(category.blogs)) {
        return;
      }

      category.blogs.forEach(blog => {
        // تجنب تكرار المدونات
        if (allBlogs.some(existingBlog => existingBlog.id === blog.id)) {
          return;
        }

        // التحقق من وجود البيانات الأساسية
        if (!blog.id || !blog.title) {
          return;
        }

        const blogData = {
          id: blog.id,
          title: blog.title,
          content: blog.content || '',
          excerpt: blog.excerpt || '',
          cover_image: blog.cover_image || '',
          author_name: blog.author_name || '',
          author_position: blog.author_position || '',
          created_at: blog.created_at,
          images: blog.images || []
        };

        allBlogs.push(blogData);
      });
    });

    if (allBlogs.length === 0) {
      return [];
    }

    // ترتيب المدونات حسب تاريخ الإنشاء وأخذ أحدث 3
    const sortedBlogs = allBlogs
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 3);

    return sortedBlogs;
  } catch (error) {
    throw error;
  }
};

// وظائف خاصة بالمدونة
export const getBlogs = async (limit = null) => {
  try {
    const response = await api.get('/api/v1/blogs', {
      params: {
        sortDirection: 'desc',
        sortBy: 'id',
        lang: currentLanguage
      }
    });

    if (!response.data?.data?.blogs) {
      return [];
    }

    const blogs = response.data.data.blogs;
    
    const processedBlogs = blogs.map(blog => {
      // معالجة تصنيفات المدونة
      const categories = blog.categories?.map(category => category.name) || [];
      
      // معالجة محتوى HTML لفصل النصوص والصور
      const { contentSections, images } = processHtmlContent(blog.content);

      return {
        id: blog.id,
        slug: blog.id.toString(),
        cover_image: fixImageUrl(blog.cover_image) || '',
        title: blog.title || '',
        content: blog.content || '',
        contentSections: contentSections,
        images: images,
        excerpt: blog.excerpt || '',
        author_name: blog.author_name || '',
        author_position: blog.author_position || '',
        categories: categories,
        created_at: blog.created_at,
      };
    })
    .filter(blog => blog.title);

    // ترتيب المدونات حسب التاريخ بشكل افتراضي
    const sortedBlogs = processedBlogs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    const result = limit ? sortedBlogs.slice(0, limit) : sortedBlogs;
    
    return result;
  } catch (error) {
    throw error;
  }
};

// وظيفة مساعدة لمعالجة محتوى HTML وفصل النصوص والصور
const processHtmlContent = (htmlContent) => {
  if (!htmlContent) return { contentSections: [], images: [] };
  
  const contentSections = [];
  const images = [];

  // تحويل HTML إلى كائنات يمكن معالجتها
  try {
    const parseOptions = {
      replace: (domNode) => {
        // إزالة عنصر figcaption وكل محتوياته
        if (domNode instanceof Element && domNode.name === 'figcaption') {
          return null; // إزالة العنصر تمامًا
        }
        
        if (domNode instanceof Element) {
          // معالجة الفقرات النصية
          if (domNode.name === 'p' && !domNode.children.some(child => 
              child.name === 'figure' || child.name === 'img')) {
            contentSections.push({
              type: 'text',
              content: domToReact(domNode.children, parseOptions),
              tag: 'p'
            });
            return null; // إزالة العنصر من الإخراج النهائي
          }
          
          // معالجة العناوين
          if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(domNode.name)) {
            contentSections.push({
              type: 'text',
              content: domToReact(domNode.children, parseOptions),
              tag: domNode.name
            });
            return null;
          }
          
          // معالجة الصور داخل figure
          if (domNode.name === 'figure') {
            // إزالة عنصر figcaption من العناصر الفرعية لل figure قبل المعالجة
            const children = domNode.children.filter(child => child.name !== 'figcaption');
            const imgNode = children.find(child => child.name === 'img');
            
            if (imgNode) {
              const imgSrc = fixImageUrl(imgNode.attribs.src);
              contentSections.push({ type: 'image', src: imgSrc });
              images.push(imgSrc);
            }
            return null;
          }
          
          // معالجة الصور المستقلة
          if (domNode.name === 'img') {
            const imgSrc = fixImageUrl(domNode.attribs.src);
            contentSections.push({ type: 'image', src: imgSrc });
            images.push(imgSrc);
            return null;
          }
          
          // معالجة معارض الصور
          if (domNode.name === 'div' && 
              domNode.attribs && 
              domNode.attribs.class && 
              (domNode.attribs.class.includes('gallery') || 
               domNode.attribs.class.includes('attachment-gallery'))) {
            
            const galleryImages = [];
            domNode.children.forEach(child => {
              if (child.name === 'figure') {
                // إزالة عنصر figcaption من العناصر الفرعية لل figure قبل المعالجة
                const figChildren = child.children.filter(figChild => figChild.name !== 'figcaption');
                const imgNode = figChildren.find(c => c.name === 'img');
                
                if (imgNode && imgNode.attribs && imgNode.attribs.src) {
                  const imgSrc = fixImageUrl(imgNode.attribs.src);
                  galleryImages.push(imgSrc);
                  images.push(imgSrc);
                }
              }
            });
            
            if (galleryImages.length > 0) {
              contentSections.push({ type: 'gallery', images: galleryImages });
            }
            return null;
          }
          
          // معالجة القوائم
          if (domNode.name === 'ul' || domNode.name === 'ol') {
            contentSections.push({
              type: 'list',
              content: domNode.outerHTML,
              tag: domNode.name
            });
            return null;
          }
        }
        
        return undefined; // الاستمرار في المعالجة العادية
      }
    };
    
    // تطبيق التحليل
    parse(htmlContent, parseOptions);
  } catch (error) {
    console.error('Error parsing HTML content:', error);
    // استخدام المعالجة البديلة البسيطة في حالة حدوث خطأ
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    
    // إزالة جميع عناصر figcaption
    const figcaptions = tempDiv.querySelectorAll('figcaption');
    figcaptions.forEach(figcaption => {
      figcaption.remove();
    });
    
    // استخراج النص
    const textContent = tempDiv.innerText;
    if (textContent.trim()) {
      contentSections.push({ type: 'text', content: textContent.trim(), tag: 'p' });
    }
    
    // استخراج الصور
    const imgElements = tempDiv.querySelectorAll('img');
    imgElements.forEach(img => {
      const imgSrc = fixImageUrl(img.src);
      images.push(imgSrc);
      contentSections.push({ type: 'image', src: imgSrc });
    });
  }
  
  return { contentSections, images };
};

// وظائف خاصة بالشركاء
export const getPartners = async () => {
  try {
    const response = await api.get('/api/v1/our-partners', {
      params: {
        lang: currentLanguage
      }
    });

    if (!response.data?.success || !response.data?.data?.our_partners) {
      return [];
    }

    const partners = response.data.data.our_partners;
    // إصلاح روابط الصور
    return partners.map(partner => ({
      ...partner,
      logo: fixImageUrl(partner.logo)
    }));
    
  } catch (error) {
    throw error;
  }
};

// وظائف خاصة بالرؤية والرسالة
export const getMissions = async () => {
  try {
    const response = await api.get('/api/v1/our-missions', {
      params: {
        lang: currentLanguage
      }
    });

    // التحقق من وجود البيانات في الاستجابة
    if (response.data?.success && response.data?.data) {
      return {
        mission: response.data.data.description || ''
      };
    }

    return {
      mission: ''
    };
    
  } catch (error) {
    return {
      mission: ''
    };
  }
};

// وظائف خاصة بالرؤى
export const getVisions = async () => {
  try {
    const response = await api.get('/api/v1/our-visions', {
      params: {
        lang: currentLanguage
      }
    });

    if (response.data?.data) {
      const visionsData = response.data.data;
      
      // إذا كانت البيانات موجودة في items
      if (visionsData.items && visionsData.items.length > 0) {
        return visionsData.items[0].description || '';
      }
      
      // إذا كان الوصف موجود مباشرة
      if (visionsData.description) {
        return visionsData.description;
      }
    }

    return '';
  } catch (error) {
    throw error;
  }
};

// وظائف خاصة بالصفحة الرئيسية
export const getHomePageData = async () => {
  try {
    const response = await api.get('/api/v1/home-page', {
      params: {
        lang: currentLanguage
      }
    });

    if (!response.data?.success) {
      throw new Error('API request failed');
    }

    const data = response.data.data;
    if (!data) {
      throw new Error('No data received from API');
    }

    const result = {
      title: data.video_title || '',
      description: data.video_description || '',
      video: fixImageUrl(data.video) || '',
      video_alt: data.video_alt_text || '',
      button_text: currentLanguage === 'ar' ? 'اتصل بنا' : 'Contact Us'
    };

    return result;

  } catch (error) {
    throw error;
  }
};

// وظائف خاصة بالعملاء
export const getClients = async () => {
  try {
    const response = await api.get('/api/v1/our-clients', {
      params: {
        lang: currentLanguage
      }
    });

    if (!response.data?.success || !response.data?.data?.clients) {
      throw new Error('No clients found or invalid response');
    }

    const clients = response.data.data.clients;
    
    // نأخذ أول عميل للحصول على الوصف والصور
    const firstClient = clients[0];
    
    return {
      description: firstClient.description || '',
      images: clients.reduce((allImages, client) => {
        return allImages.concat(client.images.map(img => ({
          id: img.id,
          url: fixImageUrl(img.image)
        })));
      }, [])
    };

  } catch (error) {
    throw error;
  }
};

// وظائف خاصة بالموارد التعليمية
export const getEducationResources = async (page = 1, perPage = 10, sortDirection = 'desc', sortBy = 'id', categoryId = null) => {
  try {
    const params = {
      page,
      perPage,
      sortDirection,
      sortBy,
      lang: currentLanguage
    };

    if (categoryId) {
      params.category_id = categoryId;
    }

    const response = await api.get('/api/v1/education-resources', { params });

    if (!response.data?.success || !response.data?.data?.education_resources) {
      throw new Error('No resources found or invalid response');
    }

    // إصلاح روابط الصور للموارد
    const resources = response.data.data.education_resources.map(resource => ({
      ...resource,
      image: fixImageUrl(resource.image),
      images: resource.images ? resource.images.map(img => ({
        ...img,
        image: fixImageUrl(img.image)
      })) : []
    }));

    return {
      resources,
      pagination: response.data.data.pagination
    };

  } catch (error) {
    throw error;
  }
};

export const getEducationResourceCategories = async () => {
  try {
    const response = await api.get('/api/v1/education-resource-categories', {
      params: {
        perPage: 100,
        sortDirection: 'desc',
        sortBy: 'id',
        lang: currentLanguage
      }
    });

    if (!response.data?.success || !response.data?.data?.categories) {
      throw new Error('No categories found or invalid response');
    }

    return response.data.data.categories;

  } catch (error) {
    throw error;
  }
};

export const getEducationResourceById = async (id) => {
  try {
    const response = await api.get(`/api/v1/education-resources/${id}`, {
      params: {
        lang: currentLanguage
      }
    });

    if (!response.data?.success) {
      throw new Error('Resource not found or invalid response');
    }

    const resource = response.data.data;
    
    // Process HTML content similar to blog content
    const { contentSections, images } = processHtmlContent(resource.content);
    
    // Fix image URLs and return processed data
    return {
      ...resource,
      image: fixImageUrl(resource.image),
      content: resource.content,
      contentSections: contentSections,
      images: images,
      categories: resource.categories || []
    };

  } catch (error) {
    console.error('Error fetching resource:', error);
    throw error;
  }
};

// وظائف خاصة بالتأثيرات
export const getImpacts = async () => {
  try {
    const response = await api.get('/api/v1/our-impacts', {
      params: {
        lang: currentLanguage
      }
    });

    if (!response.data?.success || !response.data?.data?.impacts) {
      throw new Error('No impacts found or invalid response');
    }

    return response.data.data.impacts;
    
  } catch (error) {
    throw error;
  }
};

// وظائف خاصة بكلمات في الأسواق
export const getWordsInMarkets = async () => {
  try {
    const response = await api.get('/api/v1/words-in-markets', {
      params: {
        lang: currentLanguage
      }
    });

    if (!response.data?.success || !response.data?.data?.items) {
      throw new Error('No words in markets found or invalid response');
    }

    const items = response.data.data.items;
    
    // إصلاح روابط الصور
    return items.map(item => ({
      ...item,
      image: fixImageUrl(item.image),
      images: item.images ? item.images.map(img => ({
        ...img,
        image: fixImageUrl(img.image)
      })) : []
    }));
    
  } catch (error) {
    throw error;
  }
};

export const getWordInMarketById = async (wordId) => {
  try {
    // جلب جميع الكلمات في الأسواق
    const words = await getWordsInMarkets();
    
    // البحث عن الكلمة بواسطة المعرف
    const word = words.find(word => word.id === parseInt(wordId));
    
    if (!word) {
      throw new Error('Word not found');
    }
    
    return word;
    
  } catch (error) {
    throw error;
  }
};

// وظيفة لجلب تصنيفات كلمات في الأسواق
export const getWordInMarketCategories = async () => {
  try {
    const response = await api.get('/api/v1/words-in-market-categories', {
      params: {
        lang: currentLanguage
      }
    });

    if (!response.data?.success) {
      throw new Error('No categories found or invalid response');
    }

    return response.data.data || [];
    
  } catch (error) {
    console.error('Error fetching word categories:', error);
    throw error;
  }
};

// وظيفة لجلب الكلمات حسب التصنيف
export const getWordsByCategory = async (categoryId) => {
  try {
    const response = await api.get(`/api/v1/words-in-market-categories/${categoryId}`, {
      params: {
        lang: currentLanguage
      }
    });

    if (!response.data?.success || !response.data?.data?.items) {
      throw new Error('No words found for this category or invalid response');
    }

    const items = response.data.data.items;
    
    // إصلاح روابط الصور
    return items.map(item => ({
      ...item,
      image: fixImageUrl(item.image),
      images: item.images ? item.images.map(img => ({
        ...img,
        image: fixImageUrl(img.image)
      })) : []
    }));
    
  } catch (error) {
    console.error('Error fetching words by category:', error);
    throw error;
  }
};

// وظائف خاصة باتجاهات السوق
export const getTrendsInMarkets = async () => {
  try {
    const response = await api.get('/api/v1/trends-in-markets', {
      params: {
        lang: currentLanguage
      }
    });

    if (!response.data?.success || !response.data?.data?.data) {
      throw new Error('No trends in markets found or invalid response');
    }

    return response.data.data.data;
    
  } catch (error) {
    throw error;
  }
};

// وظائف خاصة بالخدمات
export const getServices = async () => {
  try {
    const response = await api.get('/api/v1/our-services', {
      params: {
        lang: currentLanguage
      }
    });

    if (!response.data?.success || !response.data?.data?.our_services) {
      throw new Error('No services found or invalid response');
    }

    return {
      services: response.data.data.our_services,
      pagination: response.data.data.pagination
    };
    
  } catch (error) {
    throw error;
  }
};

// وظائف خاصة بالشهادات (التوصيات)
export const getTestimonials = async () => {
  try {
    const response = await api.get('/api/v1/testimonials', {
      params: {
        lang: currentLanguage
      }
    });

    if (!response.data?.success || !response.data?.data?.testimonials) {
      throw new Error('No testimonials found or invalid response');
    }

    return response.data.data.testimonials;
    
  } catch (error) {
    throw error;
  }
};

// وظائف خاصة بفريق العمل
export const getTeamMembers = async () => {
  try {
    const response = await api.get('/api/v1/our-teams', {
      params: {
        lang: currentLanguage
      }
    });

    if (!response.data?.success || !response.data?.data?.members) {
      throw new Error('No team members found or invalid response');
    }

    return response.data.data.members;
    
  } catch (error) {
    throw error;
  }
};

export const getServiceById = async (serviceId) => {
  try {
    // الحصول على بيانات الخدمات
    const servicesResponse = await getServices();
    const services = servicesResponse.services;
    
    // البحث عن الخدمة بواسطة المعرف
    const service = services.find(service => service.id === parseInt(serviceId));
    
    if (!service) {
      throw new Error('Service not found');
    }
    
    return service;
    
  } catch (error) {
    throw error;
  }
};

// وظائف خاصة بالأسئلة الشائعة
export const getFrequentlyAskedQuestions = async () => {
  try {
    const response = await api.get('/api/v1/frequently-asked-questions', {
      params: {
        lang: currentLanguage
      }
    });

    if (!response.data?.success || !response.data?.data?.faqs) {
      throw new Error('No FAQs found or invalid response');
    }

    // معالجة الأسئلة لتتوافق مع البنية المتوقعة في المكون
    return response.data.data.faqs.map(faq => ({
      id: faq.id,
      title: faq.question,
      description: faq.answer,
      category: faq.category
    }));
    
  } catch (error) {
    throw error;
  }
};

export const getTrendById = async (trendId) => {
  try {
    const response = await api.get(`/api/v1/trends-in-markets/${trendId}`, {
      params: {
        lang: currentLanguage
      }
    });

    if (!response.data?.success || !response.data?.data) {
      throw new Error('Trend not found or invalid response');
    }
    
    return response.data.data;
    
  } catch (error) {
    throw error;
  }
};

// وظائف خاصة بالتقارير المميزة
export const getFeaturedReports = async () => {
  try {
    const response = await api.get('/api/v1/our-featured-reports', {
      params: {
        lang: currentLanguage
      }
    });

    // تسجيل استجابة API للتشخيص
    console.log('Featured Reports API Response:', response.data);

    if (!response.data?.success) {
      console.warn('API request not successful', response.data);
      return [];
    }

    // التحقق من هيكل البيانات المختلف المحتمل
    let reports = [];
    
    if (response.data.data?.our_featured_reports) {
      reports = response.data.data.our_featured_reports;
    } else if (response.data.data?.reports) {
      reports = response.data.data.reports;
    } else if (Array.isArray(response.data.data)) {
      reports = response.data.data;
    } else if (response.data.data) {
      // في حالة كان data كائن يحتوي على تقارير بطريقة أخرى
      const possibleArrayProps = Object.values(response.data.data).filter(val => Array.isArray(val));
      if (possibleArrayProps.length > 0) {
        reports = possibleArrayProps[0]; 
      } else {
        console.warn('Could not find reports array in response data', response.data.data);
      }
    }
    
    console.log('Processed reports count:', reports.length);
    
    // إصلاح روابط الصور إذا وجدت
    return reports.map(report => ({
      ...report,
      image: report.image ? fixImageUrl(report.image) : '',
      images: report.images ? report.images.map(img => ({
        ...img,
        image: fixImageUrl(img.image)
      })) : []
    }));
    
  } catch (error) {
    console.error('Error fetching featured reports:', error);
    throw error;
  }
};

export const getFeaturedReportById = async (reportId) => {
  try {
    console.log(`Fetching report with ID: ${reportId}, language: ${currentLanguage}`);
    const response = await api.get(`/api/v1/our-featured-reports/${reportId}`, {
      params: {
        lang: currentLanguage
      }
    });

    console.log('Report Details API Response:', response.data);
    
    if (!response.data?.success) {
      console.warn('API request not successful', response.data);
      throw new Error(response.data?.message || 'Failed to fetch report details');
    }
    
    // التعامل مع اختلاف هيكل البيانات المحتمل
    let report = null;
    
    if (response.data.data) {
      report = response.data.data;
    } else {
      console.warn('Could not find report in response data', response.data);
      throw new Error('Report data not found in response');
    }
    
    // إصلاح روابط الصور الموجودة في محتوى HTML
    if (report.content) {
      try {
        // تحديث روابط الصور في المحتوى الغني
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = report.content;
        
        const images = tempDiv.querySelectorAll('img');
        images.forEach(img => {
          if (img.src && !img.src.startsWith('http')) {
            img.src = fixImageUrl(img.src);
          }
          
          // إضافة فئات لتحسين العرض
          img.classList.add('featured-report-image');
        });
        
        report.content = tempDiv.innerHTML;
      } catch (processError) {
        console.error('Error processing HTML content:', processError);
        // عدم التوقف في حالة حدوث خطأ في معالجة المحتوى
      }
    }
    
    console.log('Processed report:', report);
    
    // إصلاح روابط الصور المستقلة إذا وجدت
    return {
      ...report,
      image: report.image ? fixImageUrl(report.image) : '',
      images: report.images ? report.images.map(img => ({
        ...img,
        image: fixImageUrl(img.image)
      })) : []
    };
    
  } catch (error) {
    console.error(`Error fetching report with ID ${reportId}:`, error);
    throw error;
  }
};

// وظائف خاصة بسياسة الخصوصية
export const getPrivacyPolicy = async () => {
  try {
    const response = await api.get('/api/v1/privacy-policies', {
      params: {
        lang: currentLanguage
      }
    });

    if (!response.data?.success || !response.data?.data) {
      throw new Error('No privacy policy found or invalid response');
    }

    return response.data.data;
    
  } catch (error) {
    throw error;
  }
};

// وظائف خاصة بالشروط والأحكام
export const getTermsAndConditions = async () => {
  try {
    const response = await api.get('/api/v1/terms-and-conditions', {
      params: {
        lang: currentLanguage
      }
    });

    if (!response.data?.success || !response.data?.data) {
      throw new Error('No terms and conditions found or invalid response');
    }

    return response.data.data;
    
  } catch (error) {
    throw error;
  }
};

// وظائف خاصة بالأدوات التي نستخدمها
export const getToolsWeUse = async () => {
  try {
    const response = await api.get('/api/v1/tool-we-uses', {
      params: {
        lang: currentLanguage
      }
    });

    if (!response.data?.success || !response.data?.data?.tool_we_use) {
      throw new Error('No tools found or invalid response');
    }

    const tools = response.data.data.tool_we_use;
    
    // إصلاح روابط الصور
    return tools.map(tool => ({
      ...tool,
      image: fixImageUrl(tool.image),
      images: tool.images ? tool.images.map(img => ({
        ...img,
        image: fixImageUrl(img.image)
      })) : []
    }));
    
  } catch (error) {
    throw error;
  }
};

export const getToolWeUseById = async (toolId) => {
  try {
    // جلب جميع الأدوات
    const tools = await getToolsWeUse();
    
    // البحث عن الأداة بواسطة المعرف
    const tool = tools.find(tool => tool.id === parseInt(toolId));
    
    if (!tool) {
      throw new Error('Tool not found');
    }
    
    return tool;
    
  } catch (error) {
    throw error;
  }
};

// وظائف خاصة بوسائل التواصل الاجتماعي
export const getSocialMediaLinks = async () => {
  try {
    const response = await api.get('/api/v1/social-medias', {
      params: {
        lang: currentLanguage
      }
    });

    if (!response.data?.success || !response.data?.data?.social_medias) {
      throw new Error('No social media links found or invalid response');
    }

    const socialMedias = response.data.data.social_medias;
    
    // إصلاح روابط الأيقونات
    return socialMedias.map(sm => ({
      ...sm,
      icon: fixImageUrl(sm.icon)
    }));
    
  } catch (error) {
    return []; // إرجاع مصفوفة فارغة في حالة حدوث خطأ
  }
};

// وظيفة خاصة بالبحث في الموقع
export const searchWebsite = async (query) => {
  try {
    if (!query || query.trim() === '') {
      return { results: [] };
    }
    
    const response = await api.get('/api/v1/search', {
      params: {
        query: query.trim(),
        lang: currentLanguage
      }
    });

    if (!response.data?.success) {
      return { results: [] };
    }

    return {
      results: response.data.data?.results || [],
      totalCount: response.data.data?.total || 0
    };
    
  } catch (error) {
    return { results: [] };
  }
};

// تصدير نسخة Axios المخصصة للاستخدام المباشر إذا لزم الأمر
export default api; 