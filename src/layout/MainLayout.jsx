import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react'; 
import header from "../assets/images/header.png";
import { CustomSvg } from '../components/custom-svg';
import footerbackground from "../assets/images/footerbackground.png";
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Language from '../components/Language';
import LoadingAnimation from '../components/LoadingAnimation';
import { useLoading } from '../context/LoadingContext';
import { getSocialMediaLinks, setAPILanguage, searchWebsite } from '../services/api';
import { FaPhone, FaFax, FaEnvelope } from 'react-icons/fa';
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

    const isRTL = i18n.language === 'ar';

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

    // تحديث وظيفة التمرير إلى القسم
    const scrollToSection = (sectionId, delay = 100) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const element = document.getElementById(sectionId);
                if (element) {
                    const headerOffset = 100;
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                    resolve(true);
                } else {
                    resolve(false);
                }
            }, delay);
        });
    };

    // وظيفة البحث المحدثة
    const handleSearchChange = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
        
        if (query.trim().length > 1) {
            searchTimeoutRef.current = setTimeout(() => {
                const currentLang = i18n.language;
                const matchedSections = searchableSections.filter(section => {
                    const sectionTitle = section.title[currentLang].toLowerCase();
                    return sectionTitle.includes(query);
                });
                
                setSearchResults(matchedSections);
                setShowResults(matchedSections.length > 0);
            }, 300);
        } else {
            setShowResults(false);
            setSearchResults([]);
        }
    };

    // مراقبة تغيرات المسار للتمرير بعد تحميل الصفحة
    useEffect(() => {
        if (pendingScroll) {
            const attemptScroll = async () => {
                // محاولة أولى بعد تحميل الصفحة مباشرة
                let success = await scrollToSection(pendingScroll, 100);
                
                // إذا فشلت المحاولة الأولى، حاول مرة أخرى بعد فترة أطول
                if (!success) {
                    success = await scrollToSection(pendingScroll, 500);
                }
                
                // إذا فشلت المحاولة الثانية، حاول مرة أخيرة بعد فترة أطول
                if (!success) {
                    await scrollToSection(pendingScroll, 1000);
                }
                
                setPendingScroll(null);
            };

            attemptScroll();
        }
    }, [location.pathname, pendingScroll]);

    // تحديث وظيفة معالجة النقر على نتيجة البحث
    const handleResultClick = async (result) => {
        setShowResults(false);
        setSearchQuery('');
        
        if (location.pathname === result.path) {
            // إذا كنا في نفس الصفحة، نقوم بالتمرير مباشرة
            await scrollToSection(result.section);
        } else {
            // إذا كنا في صفحة مختلفة، نحفظ القسم المستهدف ثم ننتقل
            setPendingScroll(result.section);
            navigate(result.path);
        }
    };

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
                                <CustomSvg name="search" className="w-5 h-5" />
                            </div>
                            
                            {showResults && (
                                <div 
                                    ref={searchResultsRef}
                                    className="absolute top-full left-0 right-0 mt-1 bg-white shadow-lg rounded-md max-h-[300px] overflow-y-auto z-50"
                                >
                                    {searchResults.map((result) => (
                                        <div 
                                            key={result.id}
                                            className="p-3 border-b hover:bg-gray-100 cursor-pointer"
                                            onClick={() => handleResultClick(result)}
                                        >
                                            <h4 className="font-medium text-gray-800">
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
                            <li><Link to='/terms' className="hover:text-[#BB2632] transition-colors">{t('footer.terms')}</Link></li>
                            <li><Link to='/Questions' className="hover:text-[#BB2632] transition-colors">{t('footer.faq')}</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="mb-4 text-red-700 text-xl font-semibold text-center">{t('footer.newsletter')}</h3>
                        <div className={`flex rounded-3xl overflow-hidden border border-red-600 shadow-md ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <input 
                                type="email" 
                                placeholder={t('footer.email')} 
                                className={`p-3 w-full outline-none text-base ${isRTL ? 'text-right' : 'text-left'}`} 
                            />
                            <button 
                                className={`bg-red-600 text-white px-6 flex items-center justify-center text-base font-medium hover:bg-red-700 transition-colors ${
                                    isRTL ? 'rounded-r-3xl' : 'rounded-l-3xl'
                                }`}
                                style={{
                                    borderRadius: isRTL ? '1.5rem 0 0 1.5rem' : '0 1.5rem 1.5rem 0'
                                }}
                            >
                                {t('footer.subscribe')}
                            </button>
                        </div>
                        <div className="mt-6 text-base space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="flex items-center justify-center bg-red-600 p-2 rounded-full">
                                    <FaPhone className="w-5 h-5 text-white" />
                                </div>
                                <a href="tel:+963112322014" className="hover:text-[#BB2632] transition-colors">+963 11 2322 014</a>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center justify-center bg-red-600 p-2 rounded-full">
                                    <FaFax className="w-5 h-5 text-white" />
                                </div>
                                <a href="tel:+963112322015" className="hover:text-[#BB2632] transition-colors">+963 11 2322 015</a>
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
        </motion.div>
    );
}

export default MainLayout;
