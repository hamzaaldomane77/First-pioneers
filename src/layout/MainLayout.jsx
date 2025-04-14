import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef, useMemo } from 'react'; 
import header from "../assets/images/header.png";
import { CustomSvg } from '../components/custom-svg';
import footerbackground from "../assets/images/footerbackground.png";
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Language from '../components/Language';
import LoadingAnimation from '../components/LoadingAnimation';
import { useLoading } from '../context/LoadingContext';
import { getSocialMediaLinks, setAPILanguage, searchWebsite, subscribeToNewsletter } from '../services/api';
import { FaPhone, FaFax, FaEnvelope, FaCheck, FaExclamationTriangle, FaTimes, FaEdit } from 'react-icons/fa';
import Fuse from 'fuse.js';
import '../styles/rtl.css';
import '../styles/loading.css';

const MainLayout = () => {
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { isGlobalLoading, setGlobalLoading } = useLoading();
    const [socialMedia, setSocialMedia] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const searchTimeoutRef = useRef(null);
    const searchResultsRef = useRef(null);
    const [pendingScroll, setPendingScroll] = useState(null);
    const fuseRef = useRef(null);
    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [newsletterStatus, setNewsletterStatus] = useState(null); // 'success', 'error', or null
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [editableEmail, setEditableEmail] = useState('');
    const [isSubscriptionLocked, setIsSubscriptionLocked] = useState(false);
    const [lockEndTime, setLockEndTime] = useState(null);
    const [remainingLockTime, setRemainingLockTime] = useState(0);
    const lockTimeoutRef = useRef(null);

    const isRTL = i18n.language === 'ar';

    // Load subscription lock status from localStorage on component mount
    useEffect(() => {
        try {
            const storedLockEndTime = localStorage.getItem('subscriptionLockEndTime');
            if (storedLockEndTime) {
                const endTime = parseInt(storedLockEndTime, 10);
                const now = Date.now();
                
                if (endTime > now) {
                    // Lock is still active
                    setIsSubscriptionLocked(true);
                    setLockEndTime(endTime);
                    setRemainingLockTime(Math.ceil((endTime - now) / 1000));
                    
                    // Start countdown
                    startLockCountdown(endTime);
                } else {
                    // Lock has expired, clear it
                    localStorage.removeItem('subscriptionLockEndTime');
                }
            }
        } catch (error) {
            console.error('Error accessing localStorage:', error);
        }
    }, []);

    // Function to start the lock countdown
    const startLockCountdown = (endTime) => {
        // Clear any existing interval
        if (lockTimeoutRef.current) {
            clearInterval(lockTimeoutRef.current);
        }
        
        // Set up a new interval
        lockTimeoutRef.current = setInterval(() => {
            const now = Date.now();
            const secondsRemaining = Math.ceil((endTime - now) / 1000);
            
            if (secondsRemaining <= 0) {
                // Lock has expired
                clearInterval(lockTimeoutRef.current);
                setIsSubscriptionLocked(false);
                setRemainingLockTime(0);
                localStorage.removeItem('subscriptionLockEndTime');
            } else {
                setRemainingLockTime(secondsRemaining);
            }
        }, 1000);
    };

    // Clean up interval on component unmount
    useEffect(() => {
        return () => {
            if (lockTimeoutRef.current) {
                clearInterval(lockTimeoutRef.current);
            }
        };
    }, []);

    // تعريف جميع الأقسام القابلة للبحث في الموقع
    const searchableSections = [
        // الصفحة الرئيسية
        { id: 'hero', title: { ar: 'الصفحة الرئيسية', en: 'Home' }, path: '/', section: 'hero' },
        { id: 'about-home', title: { ar: 'من نحن', en: 'About Us' }, path: '/', section: 'about-section' },
        { id: 'services-home', title: { ar: 'خدماتنا', en: 'Our Services' }, path: '/', section: 'services-section' },
        { id: 'research-home', title: { ar: 'البحوث والرؤى', en: 'Research & Insights' }, path: '/', section: 'research-section' },
        { id: 'clients', title: { ar: 'عملاؤنا', en: 'Our Clients' }, path: '/', section: 'clients-section' },
        { id: 'partners', title: { ar: 'شركاؤنا', en: 'Our Partners' }, path: '/', section: 'partners-section' },
        
        // صفحة من نحن
        { id: 'about-vision', title: { ar: 'رؤيتنا', en: 'Our Vision' }, path: '/AboutUs', section: 'vision-section' },
        { id: 'about-mission', title: { ar: 'مهمتنا', en: 'Our Mission' }, path: '/AboutUs', section: 'mission-section' },
        { id: 'about-values', title: { ar: 'قيمنا', en: 'Our Values' }, path: '/AboutUs', section: 'values-section' },
        { id: 'about-team', title: { ar: 'فريقنا', en: 'Our Team' }, path: '/AboutUs', section: 'team-section' },
        
        // صفحة الخدمات والأدوات
        { id: 'services', title: { ar: 'الخدمات', en: 'Services' }, path: '/ServicesTools', section: 'services-section' },
        { id: 'tools', title: { ar: 'الأدوات', en: 'Tools' }, path: '/ServicesTools', section: 'tools-section' },
        
        // صفحة البحوث والرؤى
        { id: 'research-blog', title: { ar: 'المدونة', en: 'Blog' }, path: '/research-and-insights', section: 'blog-section' },
        { id: 'research-reports', title: { ar: 'التقارير', en: 'Reports' }, path: '/research-and-insights', section: 'reports-section' },
        { id: 'research-words', title: { ar: 'كلمات في الأسواق', en: 'Words in Markets' }, path: '/research-and-insights', section: 'words-section' },
        
        // صفحة الاتصال
        { id: 'contact', title: { ar: 'تواصل معنا', en: 'Contact Us' }, path: '/contact', section: 'contact-section' }
    ];

    // إعداد Fuse.js للبحث الضبابي
    useEffect(() => {
        const currentLang = i18n.language;
        // إعداد خيارات البحث الضبابي
        const options = {
            keys: [`title.${currentLang}`],
            includeScore: true,
            threshold: 0.4, // كلما كانت القيمة أقل، كلما كانت المطابقة أكثر دقة
            distance: 100
        };
        
        fuseRef.current = new Fuse(searchableSections, options);
    }, [i18n.language]);

    useEffect(() => {
        setIsMenuOpen(false); 
        document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    }, [location.pathname, i18n.language]);  

    useEffect(() => {
        // عرض رسوم التحميل عند تغيير المسار
        setIsLoading(true);
        setGlobalLoading(true);
        
        // إخفاء رسوم التحميل بعد فترة قصيرة
        const timer = setTimeout(() => {
            setIsLoading(false);
            setGlobalLoading(false);
        }, 1200);
        
        return () => clearTimeout(timer);
    }, [location.pathname, setGlobalLoading]);

    // استدعاء API لجلب وسائل التواصل الاجتماعي
    useEffect(() => {
        const fetchSocialMedia = async () => {
            try {
                setAPILanguage(i18n.language);
                const data = await getSocialMediaLinks();
                setSocialMedia(data);
            } catch (error) {
                // تم إزالة console.error
            }
        };

        fetchSocialMedia();
    }, [i18n.language]);

    // إغلاق نتائج البحث عند النقر خارجها
    useEffect(() => {
        function handleClickOutside(event) {
            if (searchResultsRef.current && !searchResultsRef.current.contains(event.target)) {
                setShowResults(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Helper function to find the correct element by trying different ID formats
    const findSectionElement = (sectionId) => {
        // Try different ID formats
        const possibleIds = [
            sectionId,
            `${sectionId}-section`,
            sectionId.replace('-section', ''),
            `section-${sectionId}`,
            sectionId.replace('section-', '')
        ];
        
        // Try to find the element with any of these IDs
        for (const id of possibleIds) {
            const element = document.getElementById(id);
            if (element) {
                console.log(`Found section with ID: ${id}`);
                return element;
            }
        }
        
        // If no element found by ID, try looking for data-section attribute
        const elements = document.querySelectorAll(`[data-section="${sectionId}"]`);
        if (elements.length > 0) {
            console.log(`Found section with data-section attribute: ${sectionId}`);
            return elements[0];
        }
        
        return null;
    };

    // تحديث وظيفة التمرير إلى القسم
    const scrollToSection = (sectionId, delay = 100) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const element = findSectionElement(sectionId);
                if (element) {
                    const headerOffset = 100;
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                    console.log(`Scrolled to section: ${sectionId}`);
                    resolve(true);
                } else {
                    console.log(`Section not found: ${sectionId}`);
                    resolve(false);
                }
            }, delay);
        });
    };

    // وظيفة البحث الضبابي المحدثة باستخدام Fuse.js
    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
        
        if (query.trim().length > 1) {
            setIsSearching(true);
            searchTimeoutRef.current = setTimeout(() => {
                // استخدام Fuse.js للبحث الضبابي
                const results = fuseRef.current.search(query);
                
                // استخراج النتائج المطابقة وترتيبها حسب درجة المطابقة
                const matchedSections = results
                    .map(result => result.item)
                    .slice(0, 5); // الحد من عدد النتائج المعروضة
                
                setSearchResults(matchedSections);
                setShowResults(matchedSections.length > 0);
                setIsSearching(false);
            }, 300);
        } else {
            setShowResults(false);
            setSearchResults([]);
            setIsSearching(false);
        }
    };

    // تحديث وظيفة معالجة النقر على نتيجة البحث
    const handleResultClick = async (result) => {
        setShowResults(false);
        setSearchQuery('');
        
        if (location.pathname === result.path) {
            // إذا كنا في نفس الصفحة، نقوم بالتمرير مباشرة
            console.log(`Attempting to scroll to section: ${result.section}`);
            // تجربة مع تأخيرات مختلفة للتأكد من أن العنصر موجود
            let success = await scrollToSection(result.section, 100);
            if (!success) {
                success = await scrollToSection(result.section, 300);
            }
            if (!success) {
                // محاولة أخيرة مع تأخير أطول
                success = await scrollToSection(result.section, 600);
                
                // If all attempts failed, use a fallback method
                if (!success) {
                    fallbackScroll(result);
                }
            }
        } else {
            // إذا كنا في صفحة مختلفة، نحفظ القسم المستهدف ثم ننتقل
            console.log(`Navigating to ${result.path} and setting pending scroll to ${result.section}`);
            setPendingScroll(result.section);
            navigate(result.path);
        }
    };
    
    // Fallback scroll method when section IDs aren't found
    const fallbackScroll = (result) => {
        console.log('Using fallback scroll method');
        
        // Try to find section by looking for text content that matches the section title
        const allSections = document.querySelectorAll('section, div.section, [class*="section"]');
        const currentLang = i18n.language;
        const targetTitle = result.title[currentLang];
        
        // Look through all potential sections to find matching content
        for (const section of allSections) {
            if (section.textContent.includes(targetTitle)) {
                console.log(`Found section by text content: ${targetTitle}`);
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                return true;
            }
        }
        
        // If no matching section found, use hardcoded positions based on path
        if (result.path === '/') {
            const positions = {
                'hero': 0,
                'about-section': 500,
                'services-section': 1000,
                'research-section': 1500,
                'clients-section': 2000,
                'partners-section': 2500
            };
            
            const position = positions[result.section] || 0;
            window.scrollTo({
                top: position,
                behavior: 'smooth'
            });
            return true;
        }
        
        // Last resort: scroll proportionally down the page
        const pageHeight = document.body.scrollHeight;
        const sectionIndex = searchableSections.findIndex(s => 
            s.section === result.section && s.path === result.path
        );
        const totalSections = searchableSections.filter(s => s.path === result.path).length;
        
        // Calculate a proportional position based on section order
        const proportion = totalSections > 0 ? (sectionIndex + 1) / totalSections : 0.3;
        const scrollPosition = pageHeight * proportion;
        
        window.scrollTo({
            top: scrollPosition,
            behavior: 'smooth'
        });
        return true;
    };

    // مراقبة تغيرات المسار للتمرير بعد تحميل الصفحة
    useEffect(() => {
        if (pendingScroll) {
            console.log(`Pending scroll detected to section: ${pendingScroll}`);
            const attemptScroll = async () => {
                // إنتظر لحظة للتأكد من تحميل الصفحة
                await new Promise(resolve => setTimeout(resolve, 500));
                
                // محاولة أولى بعد تحميل الصفحة
                let success = await scrollToSection(pendingScroll, 100);
                
                // إذا فشلت المحاولة الأولى، حاول مرة أخرى بعد فترة أطول
                if (!success) {
                    success = await scrollToSection(pendingScroll, 800);
                }
                
                // إذا فشلت المحاولة الثانية، حاول مرة أخيرة بعد فترة أطول
                if (!success) {
                    success = await scrollToSection(pendingScroll, 1500);
                    
                    // If all attempts failed, use fallback method
                    if (!success) {
                        // Find the result object that matches the pending scroll
                        const result = searchableSections.find(
                            section => section.section === pendingScroll && section.path === location.pathname
                        );
                        
                        if (result) {
                            fallbackScroll(result);
                        }
                    }
                }
                
                setPendingScroll(null);
            };

            attemptScroll();
        }
    }, [location.pathname, pendingScroll]);

    const navLinks = [
        { to: "/", label: t('Home') },
        { to: "/ServicesTools", label: t('Services & Tools') },
        { to: "/AboutUs", label: t('About Us') },
        { to: "/research-and-insights", label: t('Research & Insights') },
    ];

    const pageVariants = {
        initial: { opacity: 0, y: -50 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };

    // Function to validate email format
    const isValidEmail = (email) => {
        // Check only if the email is not empty
        return email && email.trim() !== '';
    };

    // Format remaining lock time for display
    const formatRemainingTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    // Handle newsletter form submission - now just shows the confirmation modal
    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        
        // Basic validation - only check if not empty
        if (!newsletterEmail || newsletterEmail.trim() === '') {
            setNewsletterStatus('error');
            return;
        }
        
        // If subscription is locked, show message
        if (isSubscriptionLocked) {
            setNewsletterStatus('locked');
            return;
        }
        
        // Show confirmation modal with the email for review
        setEditableEmail(newsletterEmail);
        setShowConfirmModal(true);
    };

    // Handle final confirmation and subscription
    const handleConfirmSubscription = async () => {
        try {
            setIsSubmitting(true);
            await subscribeToNewsletter(editableEmail);
            setNewsletterStatus('success');
            setNewsletterEmail('');
            setShowConfirmModal(false);
            
            // Lock subscription for 5 minutes (300000 ms)
            const lockEndTime = Date.now() + 300000;
            setIsSubscriptionLocked(true);
            setLockEndTime(lockEndTime);
            setRemainingLockTime(300);
            
            // Store lock end time in localStorage
            try {
                localStorage.setItem('subscriptionLockEndTime', lockEndTime.toString());
            } catch (error) {
                console.error('Error setting localStorage:', error);
            }
            
            // Start countdown
            startLockCountdown(lockEndTime);
            
            // Reset success status after 5 seconds
            setTimeout(() => {
                setNewsletterStatus(null);
            }, 5000);
        } catch (error) {
            console.error('Failed to subscribe:', error);
            setNewsletterStatus('error');
            setShowConfirmModal(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Close modal without subscribing
    const handleCancelSubscription = () => {
        setShowConfirmModal(false);
    };

    return (
        <motion.div 
            className={`min-h-screen bg-background overflow-x-hidden ${isRTL ? 'rtl' : ''}`}
            initial="initial" 
            animate="animate" 
            variants={pageVariants}
        >
            <AnimatePresence>
                <LoadingAnimation isLoading={isLoading || isGlobalLoading} />
            </AnimatePresence>
            
            <header 
                className="bg-white shadow-md border-b relative h-[80px] " 
                style={{ backgroundImage: `url(${header})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
                <div className="max-w-[1600px] px-4 md:px-16 py-2 flex items-center justify-between relative z-10">
                    <Link to="/" className="flex-shrink-0">
                        <img src="/Logo.svg" alt="Logo" className='h-[65px] w-[70px]' />
                    </Link> 
                    
                    <nav className="hidden md:flex flex-grow justify-center space-x-5 ml-16">
                        {navLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`transition-colors ${location.pathname === link.to ? "font-semibold text-[#BB2632]" : ""}`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="flex items-center space-x-3">
                        <div className="relative w-[190px] h-[44px]">
                            <input 
                                type="text" 
                                placeholder={t('search.placeholder')}
                                className="w-full h-full px-4 rounded-full border-2 bg-white bg-opacity-70 text-gray-700 placeholder-gray-500 outline-none focus:ring-2 focus:ring-gray-300 transition" 
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                {isSearching ? (
                                    <div className="w-5 h-5 border-t-2 border-red-600 rounded-full animate-spin"></div>
                                ) : (
                                    <CustomSvg name="search" className="w-5 h-5" />
                                )}
                            </div>
                            
                            {showResults && (
                                <div 
                                    ref={searchResultsRef}
                                    className="absolute top-full left-0 right-0 mt-1 bg-white shadow-lg rounded-md max-h-[300px] overflow-y-auto z-50"
                                >
                                    {searchResults.map((result) => (
                                        <div 
                                            key={result.id}
                                            className="p-3 border-b hover:bg-gray-100 cursor-pointer transition-colors duration-200"
                                            onClick={() => handleResultClick(result)}
                                        >
                                            <h4 className="font-medium text-gray-800 hover:text-[#BB2632]">
                                                {result.title[i18n.language]}
                                            </h4>
                                            <p className="text-xs text-gray-500">
                                                {t('search.inSection', { section: t(`sections.${result.section}`) })}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                     
                        
                        <button className="flex items-center space-x-2 lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            <CustomSvg name="menu" className="w-6 h-6 text-red-800" />
                        </button>
                         <Language /> 
                        <Link 
                            to="/contact" 
                            className='hidden lg:block text-[#FFFFFF] border-2 rounded-3xl bg-[#BB2632] p-3 py-3 font-headers hover:bg-red-900 transition-colors'
                        >
                            {t('Contact Us')}
                        </Link>
                    </div>
                  
                </div>
                
                {isMenuOpen && (
                    <motion.div 
                        className="md:hidden bg-white shadow-md border-t p-4 absolute w-full z-50" 
                        initial={{ opacity: 0, y: -20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ duration: 0.5 }}
                    >
                        {navLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className="block py-2 text-center transition-colors hover:text-[#BB2632]"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <Link
                            to="/contact"
                            className="block py-2 text-center text-black mt-2 rounded-md bg-white hover:text-red-800 transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {t('Contact Us')}
                        </Link>
                    </motion.div>
                )}
            </header>

            <main className="font-headers">
                <Outlet />
            </main>

            <footer 
                className="bg-orange-200 py-20 px-6 md:px-16 h-auto font-footer text-[#363636] footer-enhanced"
                style={{ backgroundImage: `url(${footerbackground})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
                <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-12 text-center md:text-left">
                    <div className='h-auto md:h-[170px]'>
                        <img src="/Logo.svg" alt="Logo" className='h-[146px] w-[150px] mx-auto md:mx-0' />
                        <div className="flex justify-center md:justify-start gap-2 mt-4 text-center">
                            {socialMedia.length > 0 ? (
                                socialMedia.map((item) => (
                                    <a 
                                        key={item.id} 
                                        href={item.link} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        title={item.link_placeholder}
                                        className="hover:scale-110 transition-transform"
                                    >
                                        <img 
                                            src={item.icon} 
                                            alt={item.name} 
                                            className="w-6 h-6 object-contain"
                                        />
                                    </a>
                                ))
                            ) : (
                                <>
                                    <CustomSvg name="facebook" className="w-6 h-6 hover:scale-110 transition-transform" />
                                    <CustomSvg name="instagram" className="w-6 h-6 hover:scale-110 transition-transform" />
                                    <CustomSvg name="youtube" className="w-6 h-6 hover:scale-110 transition-transform" />
                                </>
                            )}
                        </div>
                        <p className='w-full md:w-[168px] text-center mt-2 text-base'>{t('footer.copyright')}</p>
                    </div>
                    <div className="hidden md:block mb-4 py-7 p-0">
                        <ul className="space-y-5 text-lg">
                            <li><Link to="/" className="hover:text-[#BB2632] transition-colors">{t('Home')}</Link></li>
                            <li><Link to="/ServicesTools" className="hover:text-[#BB2632] transition-colors">{t('Services & Tools')}</Link></li>
                            <li><Link to="/AboutUs" className="hover:text-[#BB2632] transition-colors">{t('About Us')}</Link></li>
                            <li><Link to="/research-and-insights" className="hover:text-[#BB2632] transition-colors">{t('Research & Insights')}</Link></li>
                            <li><Link to="/contact" className="hover:text-[#BB2632] transition-colors">{t('Contact Us')}</Link></li>
                        </ul>
                    </div>
                    <div className='py-7 mb-4'>
                        <ul className="space-y-5 text-lg">
                            <li><Link to='/PrivacyPolicy' className="hover:text-[#BB2632] transition-colors">{t('footer.privacy')}</Link></li>
                            <li><Link to='/terms-and-conditions' className="hover:text-[#BB2632] transition-colors">{t('footer.terms')}</Link></li>
                            <li><Link to='/Questions' className="hover:text-[#BB2632] transition-colors">{t('footer.faq')}</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="mb-4 text-red-700 text-xl font-semibold text-center">{t('footer.newsletter')}</h3>
                        <form onSubmit={handleNewsletterSubmit} className="relative">
                            <div className={`flex rounded-3xl overflow-hidden border border-red-600 shadow-md ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <input 
                                    type="email" 
                                    placeholder={t('footer.email')} 
                                    className={`p-3 w-full outline-none text-base ${isRTL ? 'text-right' : 'text-left'}`}
                                    value={newsletterEmail}
                                    onChange={(e) => setNewsletterEmail(e.target.value)}
                                    disabled={isSubmitting || isSubscriptionLocked}
                                />
                                <button 
                                    type="submit"
                                    className={`bg-red-600 text-white px-6 flex items-center justify-center text-base font-medium hover:bg-red-700 transition-colors ${
                                        isRTL ? 'rounded-r-3xl' : 'rounded-l-3xl'
                                    } ${isSubscriptionLocked ? 'opacity-60 cursor-not-allowed' : ''}`}
                                    style={{
                                        borderRadius: isRTL ? '1.5rem 0 0 1.5rem' : '0 1.5rem 1.5rem 0'
                                    }}
                                    disabled={isSubmitting || isSubscriptionLocked}
                                >
                                    {isSubmitting ? (
                                        <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin"></div>
                                    ) : (
                                        t('footer.subscribe')
                                    )}
                                </button>
                            </div>
                            
                            {/* Status messages */}
                            {newsletterStatus === 'success' && (
                                <div className="absolute mt-2 inset-x-0 bg-green-100 text-green-800 p-2 rounded-md flex items-center">
                                    <FaCheck className="mr-2" />
                                    <span className="text-sm">{isRTL ? 'تم الاشتراك بنجاح!' : 'Successfully subscribed!'}</span>
                                </div>
                            )}
                            
                            {newsletterStatus === 'error' && (
                                <div className="absolute mt-2 inset-x-0 bg-red-100 text-red-800 p-2 rounded-md flex items-center">
                                    <FaExclamationTriangle className="mr-2" />
                                    <span className="text-sm">{isRTL ? 'يرجى إدخال أي قيمة في حقل البريد الإلكتروني' : 'Please enter a value in the email field'}</span>
                                </div>
                            )}
                            
                            {newsletterStatus === 'locked' && (
                                <div className="absolute mt-2 inset-x-0 bg-yellow-100 text-yellow-800 p-2 rounded-md flex items-center">
                                    <FaExclamationTriangle className="mr-2" />
                                    <span className="text-sm">
                                        {isRTL 
                                            ? `لقد اشتركت بالفعل. يرجى الانتظار ${formatRemainingTime(remainingLockTime)} قبل المحاولة مرة أخرى.`
                                            : `You have already subscribed. Please wait ${formatRemainingTime(remainingLockTime)} before trying again.`
                                        }
                                    </span>
                                </div>
                            )}
                            
                            {isSubscriptionLocked && newsletterStatus !== 'locked' && newsletterStatus !== 'success' && (
                                <div className="mt-2 text-xs text-gray-600">
                                    {isRTL 
                                        ? `انتظر ${formatRemainingTime(remainingLockTime)} قبل الاشتراك التالي.`
                                        : `Wait ${formatRemainingTime(remainingLockTime)} before next subscription.`
                                    }
                                </div>
                            )}
                        </form>
                        
                        <div className="mt-6 text-base space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="flex items-center justify-center bg-red-600 p-2 rounded-full">
                                    <FaPhone className="w-5 h-5 text-white" />
                                </div>
                                <a href="tel:+963112322014" className="hover:text-[#BB2632] transition-colors">011 232 2014</a>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center justify-center bg-red-600 p-2 rounded-full">
                                    <FaFax className="w-5 h-5 text-white" />
                                </div>
                                <a href="tel:+963112322015" className="hover:text-[#BB2632] transition-colors">+963 993 371 526</a>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center justify-center bg-red-600 p-2 rounded-full">
                                    <FaEnvelope className="w-5 h-5 text-white" />
                                </div>
                                <a href="mailto:info@first-pioneers.com" className="hover:text-[#BB2632] transition-colors">info@first-pioneers.com</a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className={`bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 ${isRTL ? 'rtl' : 'ltr'}`}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-gray-800">
                                {isRTL ? 'تأكيد الاشتراك' : 'Confirm Subscription'}
                            </h3>
                            <button 
                                onClick={handleCancelSubscription}
                                className="text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                <FaTimes />
                            </button>
                        </div>
                        
                        <p className="mb-4 text-gray-600">
                            {isRTL
                                ? 'هل تريد الاشتراك باستخدام هذا البريد الإلكتروني؟ يمكنك تعديله إذا كان هناك خطأ.'
                                : 'Do you want to subscribe using this email? You can edit it if there\'s a mistake.'
                            }
                        </p>
                        
                        <div className="flex items-center mb-6 border rounded overflow-hidden">
                            <input
                                type="text"
                                value={editableEmail}
                                onChange={(e) => setEditableEmail(e.target.value)}
                                className={`p-3 flex-grow outline-none ${isRTL ? 'text-right' : 'text-left'}`}
                            />
                            <div className="bg-gray-100 p-3 text-gray-500">
                                <FaEdit />
                            </div>
                        </div>
                        
                        <div className="flex justify-end space-x-3">
                            {!isRTL && (
                                <button
                                    onClick={handleCancelSubscription}
                                    className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                    {isRTL ? 'إلغاء' : 'Cancel'}
                                </button>
                            )}
                            
                            <button
                                onClick={handleConfirmSubscription}
                                disabled={!editableEmail.trim() || isSubmitting}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-60"
                            >
                                {isSubmitting ? (
                                    <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mx-auto"></div>
                                ) : (
                                    isRTL ? 'تأكيد الاشتراك' : 'Confirm Subscription'
                                )}
                            </button>
                            
                            {isRTL && (
                                <button
                                    onClick={handleCancelSubscription}
                                    className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 transition-colors mr-3"
                                >
                                    {isRTL ? 'إلغاء' : 'Cancel'}
                                </button>
                            )}
                        </div>
                        
                        <p className="mt-4 text-xs text-gray-500">
                            {isRTL
                                ? 'بعد التأكيد، سيتم منع الاشتراك لمدة 5 دقائق.'
                                : 'After confirmation, subscription will be blocked for 5 minutes.'
                            }
                        </p>
                    </div>
                </div>
            )}
        </motion.div>
    );
}

export default MainLayout;
