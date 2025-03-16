import { Link, useLocation, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react'; 
import header from "../assets/images/header.png";
import { CustomSvg } from '../components/custom-svg';
import footerbackground from "../assets/images/footerbackground.png";
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Language from '../components/Language';
import LoadingAnimation from '../components/LoadingAnimation';
import { useLoading } from '../context/LoadingContext';
import '../styles/rtl.css';
import '../styles/loading.css';

const MainLayout = () => {
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { isGlobalLoading, setGlobalLoading } = useLoading();

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
                            />
                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                <CustomSvg name="search" className="w-5 h-5" />
                            </div>
                        </div>
                     
                        
                        <button className="flex items-center space-x-2 lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            <CustomSvg name="menu" className="w-6 h-6 text-red-800" />
                        </button>
                        <Language />
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
                            <CustomSvg name="facebook" className="w-6 h-6 hover:scale-110 transition-transform" />
                            <CustomSvg name="instagram" className="w-6 h-6 hover:scale-110 transition-transform" />
                            <CustomSvg name="youtube" className="w-6 h-6 hover:scale-110 transition-transform" />
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
