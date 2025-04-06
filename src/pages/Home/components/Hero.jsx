import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import ReactPlayer from 'react-player';
import { getHomePageData, setAPILanguage } from '../../../services/api';
import { Link } from 'react-router-dom';

export default function Hero() {
  const [homeData, setHomeData] = useState({
    title: '',
    description: '',
    button_text: 'Contact Us',
    video: '',
    video_alt: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isImage, setIsImage] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        setError(null);
        setAPILanguage(i18n.language);
        
        const data = await getHomePageData();
        console.log('Received home data:', data);
        
        // تحديد ما إذا كان المحتوى فيديو أو صورة
        const videoUrl = data.video || '';
        const isVideoContent = videoUrl.includes('.mp4') || 
                            videoUrl.includes('youtube.com') || 
                            videoUrl.includes('youtu.be') || 
                            videoUrl.includes('vimeo.com');
        
        setIsImage(!isVideoContent);
        setHomeData(data);
        setRetryCount(0); 
      } catch (error) {
        console.error('Error in Hero component:', error);
        setError(error.message || t('common.error', 'Failed to load content'));
        
       
        if (retryCount < 3) {
          const nextRetry = retryCount + 1;
          console.log(`Retrying connection (${nextRetry}/3) in 2 seconds...`);
          setTimeout(() => {
            setRetryCount(nextRetry);
          }, 2000);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, [i18n.language, t, retryCount]);

  const handleVideoError = () => {
    console.error('Video playback error, switching to image mode');
    setIsImage(true);
  };

  if (loading) {
    return (
      <section className="h-screen w-full flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#BB2632] mb-4"></div>
          {retryCount > 0 && (
            <p className="text-gray-600">
              {t('common.retrying', 'Retrying')} ({retryCount}/3)...
            </p>
          )}
        </div>
      </section>
    );
  }

  return (
    <section
      className="h-screen w-full relative overflow-hidden"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      
      <div className="absolute inset-0 w-full h-full">
        {isImage ? (
          
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center" 
            style={{ backgroundImage: `url(${homeData.video})` }}
            aria-label={homeData.video_alt || ''}
          />
        ) : (
         
          <div className={`absolute inset-0 w-full h-full ${!isVideoReady ? 'bg-black' : ''}`}>
            {homeData.video && (
              <ReactPlayer
                url={homeData.video}
                playing={true}
                loop={true}
                muted={true}
                width="100%"
                height="100%"
                onReady={() => {
                  console.log('Video ready to play');
                  setIsVideoReady(true);
                }}
                onError={handleVideoError}
                style={{ objectFit: 'cover', position: 'absolute', top: 0, left: 0 }}
                config={{
                  file: {
                    attributes: {
                      style: {
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      },
                      'aria-label': homeData.video_alt
                    }
                  }
                }}
              />
            )}
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>

      
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-4 md:px-16 space-y-6">
        {error ? (
          <div className="bg-red-500 bg-opacity-75 p-4 rounded-lg">
            <p className="text-white">{error}</p>
            {retryCount >= 3 && (
              <p className="text-white mt-2 text-sm">
                {t('common.maxRetries', 'Maximum retry attempts reached. Please try again later.')}
              </p>
            )}
          </div>
        ) : (
          <>
            <motion.h1 
              initial={{ opacity: 0, y: -50 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 1 }} 
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              {homeData.title || t('home.defaultTitle', 'Welcome')}
            </motion.h1>
            <motion.h2 
              initial={{ opacity: 0, y: 50 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 1.2, delay: 0.3 }} 
              className="text-xl md:text-2xl max-w-[900px] leading-relaxed"
            >
              {homeData.description || t('home.defaultDescription', 'Loading description...')}
            </motion.h2>
        <Link to="/contact" className='shad'>
        <motion.button 
              initial={{ opacity: 0, scale: 0.5 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 1.5, delay: 0.6 }} 
              className="mt-8 px-8 py-4 bg-[#BB2632] text-white text-lg rounded-full hover:bg-red-700 transition-colors duration-300 transform hover:scale-105"
            >
              {homeData.button_text}
            </motion.button></Link>
          </>
        )}
      </div>
    </section>
  );
}
