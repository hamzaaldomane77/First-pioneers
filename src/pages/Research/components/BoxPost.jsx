import React from "react";
import Redbackground from "../../../assets/images/Redbackground.png";
import { useInView } from "react-intersection-observer";
import Boxpost from '../../../assets/images/BoxPost.png';

const BoxPost = () => {
    const { ref, inView } = useInView({
        threshold: 0.3,
        triggerOnce: true,
    });

    return (
        <section 
            className={`min-h-screen bg-cover bg-center flex items-center justify-center transition-all duration-1000 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
            }`} 
            style={{ backgroundImage: `url(${Redbackground})` }} 
            ref={ref}
        >
            <div className="container mx-auto px-4 flex items-center justify-center h-full py-8">
                <div className="max-w-5xl w-full bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="flex flex-col md:flex-row"> 
                     
                        <div className="w-full md:w-1/3 h-[200px] md:h-[300px]"> {/* Added specific heights for mobile/desktop */}
                            <div className="h-full relative">
                                <img
                                    src={Boxpost}
                                    alt="Mailbox illustration"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        {/* Content Side - Will appear below image on mobile */}
                        <div className="w-full md:w-2/3 p-6 md:p-8 flex flex-col justify-center">
                            <div className="space-y-4 md:space-y-6">
                                <h2 className="text-xl md:text-2xl font-bold text-[#BB2632]">
                                    Subscribe to Our Newsletter
                                </h2>
                                <p className="text-gray-600 text-sm md:text-base">
                                    Get the latest news and updates delivered directly to your inbox. 
                                    Subscribe now to stay informed about our latest developments and insights.
                                </p>
                                
                                <div className="space-y-2 md:space-y-3">
                                    <p className="text-sm text-gray-700">
                                        Your Email Address
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                                        <input
                                            type="email"
                                            placeholder="Enter your email"
                                            className="w-full sm:w-auto flex-grow p-2 md:p-3 border border-gray-300 rounded-md sm:rounded-l-md sm:rounded-r-none focus:outline-none focus:border-[#BB2632]"
                                        />
                                        <button className="w-full sm:w-auto bg-[#BB2632] text-white px-4 md:px-8 py-2 md:py-3 rounded-md sm:rounded-l-none sm:rounded-r-md hover:bg-[#a02029] transition-colors duration-300">
                                            Subscribe
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BoxPost;