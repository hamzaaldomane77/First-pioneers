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

    // وظيفة البحث مع تأخير
    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        
        // إلغاء المؤقت السابق إذا كان موجودًا
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
        
        if (query.trim().length > 2) {
            setIsSearching(true);
            // تأخير البحث لتحسين الأداء
            searchTimeoutRef.current = setTimeout(async () => {
                try {
                    const data = await searchWebsite(query);
                    setSearchResults(data.results);
                    setShowResults(true);
                } catch (error) {
                    setSearchResults([]);
                } finally {
                    setIsSearching(false);
                }
            }, 500);
        } else {
            setShowResults(false);
            setSearchResults([]);
            setIsSearching(false);
        }
    };

    // التنقل إلى صفحة النتيجة عند النقر عليها
    const handleResultClick = (result) => {
        setShowResults(false);
        setSearchQuery('');
        
        // التنقل إلى الصفحة المناسبة بناءً على نوع النتيجة
        if (result.type === 'blog') {
            navigate(`/blog/${result.id}`);
        } else if (result.type === 'service') {
            navigate(`/ServicesTools/service/${result.id}`);
        } else if (result.type === 'tool') {
            navigate(`/ServicesTools/tool/${result.id}`);
        } else if (result.type === 'report') {
            navigate(`/research-and-insights/reports/${result.id}`);
        } else if (result.type === 'word') {
            navigate(`/words/${result.id}`);
        } else if (result.type === 'trend') {
            navigate(`/trends/${result.id}`);
        } else {
            // التنقل إلى الصفحة الرئيسية إذا كان النوع غير معروف
            navigate('/');
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
                                onFocus={() => searchQuery.trim().length > 2 && setShowResults(true)}
                            />
                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                {isSearching ? (
                                    <div className="animate-spin h-5 w-5 border-2 border-red-800 rounded-full border-t-transparent" />
                                ) : (
                                    <CustomSvg name="search" className="w-5 h-5" />
                                )}
                            </div>
                            
                            {/* نتائج البحث */}
                            {showResults && (
                                <div 
                                    ref={searchResultsRef}
                                    className="absolute top-full left-0 right-0 mt-1 bg-white shadow-lg rounded-md max-h-[300px] overflow-y-auto z-50"
                                >
                                    {searchResults.length > 0 ? (
                                        <div>
                                            <div className="p-2 border-b">
                                                <span className="text-sm text-gray-500">
                                                    {t('search.results', { count: searchResults.length })}
                                                </span>
                                            </div>
                                            {searchResults.map((result) => (
                                                <div 
                                                    key={`${result.type}-${result.id}`}
                                                    className="p-3 border-b hover:bg-gray-100 cursor-pointer"
                                                    onClick={() => handleResultClick(result)}
                                                >
                                                    <h4 className="font-medium text-gray-800">{result.title}</h4>
                                                    <p className="text-sm text-gray-600 truncate">{result.description}</p>
                                                    <span className="text-xs text-red-600 mt-1 inline-block">
                                                        {t(`search.types.${result.type}`, result.type)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-4 text-center text-gray-500">{t('search.noResults')}</div>
                                    )}
                                </div>
                            )}
                        </div>
                     
                        
                        <button className="flex items-center space-x-2 lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            <CustomSvg name="menu" className="w-6 h-6 text-red-800" />
                        </button>
                        {/* <Language /> */}
                        <Link 
                            to="/contact" 
                            className='hidden lg:block text-[#FFFFFF] border-2 rounded-3xl bg-red-800 p-3 py-3 font-headers hover:bg-red-900 transition-colors'
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

            <motion.footer 
                className="bg-orange-200 py-20 px-6 md:px-16 h-auto font-footer text-[#363636] footer-enhanced"
                style={{ backgroundImage: `url(${footerbackground})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                initial={{ opacity: 0, x: -100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                viewport={{ once: true, amount: 0.5 }}
            >
                <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-12 text-center md:text-left">
                    <div className='h-auto md:h-[170px]'>
                        <img src="/Logo.svg" alt="Logo" className='h-[146px] w-[150px] mx-auto md:mx-0' />
                        <div className="flex justify-center md:justify-start gap-2 mt-4">
                            {socialMedia.length > 0 ? (
                                // عرض أيقونات وسائل التواصل الاجتماعي من API
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
                                // أيقونات احتياطية في حالة فشل تحميل البيانات
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
                            <li className="hover:text-[#BB2632] transition-colors">{t('Home')}</li>
                            <li className="hover:text-[#BB2632] transition-colors">{t('Services & Tools')}</li>
                            <li className="hover:text-[#BB2632] transition-colors">{t('About Us')}</li>
                            <li className="hover:text-[#BB2632] transition-colors">{t('Research & Insights')}</li>
                            <li className="hover:text-[#BB2632] transition-colors">{t('Contact Us')}</li>
                        </ul>
                    </div>
                    <div className='py-7 mb-4'>
                        <ul className="space-y-5 text-lg">
                            <li><Link to='/PrivacyPolicy' className="hover:text-[#BB2632] transition-colors">{t('footer.privacy')}</Link></li>
                            <li className="hover:text-[#BB2632] transition-colors">{t('footer.terms')}</li>
                            <li><Link to='/Questions' className="hover:text-[#BB2632] transition-colors">{t('footer.faq')}</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="mb-4 text-red-700 text-xl font-semibold">{t('footer.newsletter')}</h3>
                        <div className="flex rounded-3xl overflow-hidden border border-red-600 shadow-md">
                            <input type="email" placeholder={t('footer.email')} className="p-3 w-full outline-none text-base" />
                            <button className="bg-red-600 text-white px-6 flex items-center justify-center text-base font-medium hover:bg-red-700 transition-colors" style={{ borderRadius: '0 25px 25px 0' }}>{t('footer.subscribe')}</button>
                        </div>
                        <div className="mt-6 text-base space-y-4 md:space-y-9">
                            <p className="flex items-center">
                                <CustomSvg name="location" className="w-5 h-5 ml-0 mr-2 rtl:ml-2 rtl:mr-0" />
                                {t('footer.address', { defaultValue: '8819 Ohio St. South Gate, CA 90280' })}
                            </p>
                            <p className="flex items-center">
                                <CustomSvg name="email" className="w-5 h-5 ml-0 mr-2 rtl:ml-2 rtl:mr-0" />
                                {t('footer.email_contact', { defaultValue: 'Ourstudio@hello.com' })}
                            </p>
                            <p className="flex items-center">
                                <CustomSvg name="phone" className="w-5 h-5 ml-0 mr-2 rtl:ml-2 rtl:mr-0" />
                                {t('footer.phone', { defaultValue: '+1 386-688-3295' })}
                            </p>
                        </div>
                    </div>
                </div>
            </motion.footer>
        </motion.div>
    );
}

export default MainLayout;
