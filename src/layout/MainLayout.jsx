import { Link, useLocation, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react'; 
import header from "../assets/images/header.png";
import { CustomSvg } from '../components/custom-svg';
import footerbackground from "../assets/images/footerbackground.png";
import { motion } from 'framer-motion';

const MainLayout = () => {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // إغلاق القائمة عند تغيير المسار
    useEffect(() => {
        setIsMenuOpen(false);  // إغلاق القائمة عند الانتقال إلى صفحة جديدة
    }, [location.pathname]);  // عندما يتغير المسار

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/ServicesTools", label: "Services & Tools" },
        { href: "/AboutUs", label: "AboutUs" },
        { href: "/resources", label: "Resources" },
        { href: "/pricing", label: "Pricing Plan" },
        { href: "/contact", label: "Contact Us" },
    ];

    const pageVariants = {
        initial: {
            opacity: 0,
            y: -50,
        },
        animate: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut",
            }
        }
    };

    return (
        <motion.div className='min-h-screen bg-background overflow-x-hidden' initial="initial" animate="animate" variants={pageVariants}>
            <header 
                className="bg-white shadow-md border-b relative h-[80px]" 
                style={{ backgroundImage: `url(${header})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
                <div className="max-w-[1600px] px-4 md:px-16 py-2 flex items-center justify-between relative z-10">
                    <a href="/" className="flex-shrink-0">
                        <img src="/Logo.svg" alt="Logo" className='h-[65px] w-[70px]' />
                    </a> 
                    
                    <nav className="hidden md:flex flex-grow justify-center space-x-5 ml-16">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                to={link.href}
                                className={`transition-colors ${location.pathname === link.href ? "font-semibold text-[#BB2632]" : ""}`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="flex items-center space-x-3">
                        <div className="relative w-[190px] h-[44px]">
                            <input 
                                type="text" 
                                placeholder="Search text" 
                                className="w-full h-full px-4 rounded-full border-2 bg-white bg-opacity-70 text-gray-700 placeholder-gray-500 outline-none focus:ring-2 focus:ring-gray-300 transition" 
                            />
                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                <CustomSvg name="search" className="w-5 h-5" />
                            </div>
                        </div>
                        <div className='px-4'>
                            <CustomSvg name="Language" />
                        </div>
                        
                        <button className="flex items-center space-x-2 lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            <CustomSvg name="menu" className="w-6 h-6 text-red-800" />
                        </button>
                        <button className='hidden lg:block text-[#FFFFFF] border-2 rounded-3xl bg-red-800 w-[137px] h-12 font-headers'>
                            Contact Us
                        </button>
                    </div>
                </div>
                {isMenuOpen && (
                    <motion.div 
                        className="md:hidden bg-white shadow-md border-t p-4 menu z-50 relative" 
                        initial={{ opacity: 0, y: -20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ duration: 0.5 }}
                    >
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                to={link.href}
                                className="block py-2 text-center border-b last:border-b-0 transition-colors hover:text-[#BB2632]"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </motion.div>
                )}
            </header>

            <main className="font-headers">
                <Outlet />
            </main>

            <motion.footer 
                className="bg-orange-200 py-20 px-6 md:px-16 h-auto font-footer text-[#363636]" 
                style={{ backgroundImage: `url(${footerbackground})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                initial={{ opacity: 0, x: -100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                viewport={{ once: true, amount: 0.5 }}
            >
                <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left">
                    <div className='h-auto md:h-[170px]'>
                        <img src="/Logo.svg" alt="Logo" className='h-[146px] w-[150px] mx-auto md:mx-0' />
                        <div className="flex justify-center md:justify-start gap-2 mt-4">
                            <CustomSvg name="facebook" />
                            <CustomSvg name="instagram" />
                            <CustomSvg name="youtube" />
                        </div>
                        <p className='w-full md:w-[168px] text-center mt-2'>Copyright preserved for First Pioneers</p>
                    </div>
                    <div className="hidden md:block mb-4 py-7 p-0">
                        <ul className="space-y-4">
                            <li>Home page</li>
                            <li>Services & Tools</li>
                            <li>About us</li>
                            <li>Research and Insights</li>
                            <li>Contact us</li>
                        </ul>
                    </div>
                    <div className='py-7 mb-4'>
                        <ul className="space-y-4">
                            <li>Privacy Policy</li>
                            <li>Terms & Conditions</li>
                            <li>FAQs</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="mb-4 text-red-700">Join Our Newsletter Box</h3>
                        <div className="flex rounded-3xl overflow-hidden border border-red-600">
                            <input type="email" placeholder="Enter Your Email" className="p-2 w-full outline-none" />
                            <button className="bg-red-600 text-white px-4 flex items-center justify-center" style={{ borderRadius: '0 25px 25px 0' }}>Subscribe</button>
                        </div>
                        <div className="mt-4 text-sm space-y-3 md:space-y-9">
                            <p>📍 8819 Ohio St. South Gate, CA 90280</p>
                            <p>📧 Ourstudio@hello.com</p>
                            <p>📞 +1 386-688-3295</p>
                        </div>
                    </div>
                </div>
            </motion.footer>
        </motion.div>
    );
}

export default MainLayout;
