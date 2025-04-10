import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Redbackground from "../../assets/images/Redbackground.png";
import { getWordInMarketById, setAPILanguage } from '../../services/api';
import parse from 'html-react-parser';
import { ArrowLeft, ArrowRight, Calendar, Tag } from 'lucide-react';
import CardArticles from '../Markets&Resources/components/CardArticles';
import '../Research/blogdetails.css';

const WordsDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';
    const [word, setWord] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [galleryImages, setGalleryImages] = useState([]);
    
    // Memoize the fetch function to prevent unnecessary re-renders
    const fetchWordDetails = useCallback(async () => {
        if (!id) {
            setError(t('words.idMissing', 'Word ID is not available'));
            setLoading(false);
            return;
        }
        
        try {
            setLoading(true);
            setError(null);
            setAPILanguage(i18n.language);
            
            const data = await getWordInMarketById(id);
            setWord(data);
            
            // Extract gallery images if available
            if (data.content) {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = data.content;
                
                // Find all images in the content
                const images = [];
                const imgElements = tempDiv.querySelectorAll('img');
                imgElements.forEach(img => {
                    if (img.src) {
                        images.push(img.src);
                    }
                });
                
                setGalleryImages(images);
            }
        } catch (error) {
            console.error('Error in WordsDetails component:', error);
            setError(error.message || t('common.error', 'Failed to load content'));
        } finally {
            setLoading(false);
        }
    }, [id, i18n.language, t]);

    useEffect(() => {
        fetchWordDetails();
    }, [fetchWordDetails]);

    const processGalleryImages = useCallback((galleryNode) => {
        const images = [];
        const figures = galleryNode.querySelectorAll('figure');
        figures.forEach(figure => {
            const img = figure.querySelector('img');
            if (img && img.src) {
                images.push(img.src);
            }
        });
        return images;
    }, []);

    const renderGallery = useCallback((images) => {
        if (!images || images.length === 0) return null;

        if (images.length === 1) {
            return (
                <div className="mb-8">
                    <img 
                        src={images[0]} 
                        alt="" 
                        className="w-full md:max-w-2xl lg:max-w-3xl mx-auto h-auto rounded-lg shadow-md" 
                    />
                </div>
            );
        }

        if (images.length === 2) {
            return (
                <div className="custom-two-images">
                    {images.map((image, idx) => (
                        <p key={`img-${idx}-${image.slice(-10)}`}>
                            <img src={image} alt="" className="w-full h-full object-cover rounded-lg shadow-md" />
                        </p>
                    ))}
                </div>
            );
        }

        return (
            <div className="custom-three-plus-images">
                {images.map((image, idx) => (
                    <p key={`img-${idx}-${image.slice(-10)}`}>
                        <img src={image} alt="" className="w-full h-full object-cover rounded-lg shadow-md" />
                    </p>
                ))}
            </div>
        );
    }, []);

    const renderContent = useCallback(() => {
        if (!word?.content) return null;

        const options = {
            replace: (domNode) => {
                if (domNode.name === 'figcaption') {
                    return null;
                }

                // Handle gallery divs
                if (domNode.name === 'div' && 
                    domNode.attribs && 
                    domNode.attribs.class && 
                    domNode.attribs.class.includes('attachment-gallery')) {
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = domNode.children.map(child => child.toString()).join('');
                    const images = processGalleryImages(tempDiv);
                    return renderGallery(images);
                }

                // Handle individual figures with images
                if (domNode.name === 'figure') {
                    const imgNode = domNode.children.find(child => child.name === 'img');
                    if (imgNode && imgNode.attribs && imgNode.attribs.src) {
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

                // Handle direct images
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

                // Handle paragraphs with images
                if (domNode.name === 'p' && domNode.children.some(child => child.name === 'img')) {
                    const images = domNode.children
                        .filter(child => child.name === 'img')
                        .map(img => img.attribs.src);
                    return renderGallery(images);
                }
            }
        };

        return parse(word.content, options);
    }, [word, processGalleryImages, renderGallery]);

    // Format date
    const formatDate = useCallback((dateString) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString(
                isRTL ? 'ar-EG' : 'en-US', 
                { year: 'numeric', month: 'long', day: 'numeric' }
            );
        } catch (error) {
            console.error('Error formatting date:', error);
            return dateString;
        }
    }, [isRTL]);

    // Memoize any categories to prevent re-renders
    const categories = useMemo(() => {
        if (!word?.categories) return [];
        return word.categories;
    }, [word?.categories]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#BB2632]"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p className="text-red-500 text-xl">{error}</p>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 px-6 py-2 bg-[#BB2632] text-white rounded-lg hover:bg-[#A31F29] transition-colors"
                >
                    {t('common.goBack', 'Go Back')}
                </button>
            </div>
        );
    }

    if (!word) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p className="text-xl">{t('words.notFound', 'Word not found')}</p>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 px-6 py-2 bg-[#BB2632] text-white rounded-lg hover:bg-[#A31F29] transition-colors"
                >
                    {t('common.goBack', 'Go Back')}
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-0 md:px-2" dir={isRTL ? 'rtl' : 'ltr'}>
            <article className="max-w-full mx-0 bg-white overflow-hidden my-8 md:my-12 px-2 md:px-4">
                <div className="p-2 md:p-4">
                    {/* Categories */}
                    {categories.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4 md:mb-6">
                            {categories.map((category) => (
                                <span
                                    key={`cat-${category.id}`}
                                    className="text-[#BB2632] border border-[#BB2632] px-3 py-1 rounded-full text-xs md:text-sm font-medium hover:bg-[#BB2632] hover:text-white bahnschrift"
                                >
                                    {category.name}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Title */}
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-8 bahnschrift">
                        {word.title}
                    </h1>
                    
                    {/* Date */}
                    <div className="flex items-center text-gray-500 mb-6">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span className="text-sm">{formatDate(word.created_at)}</span>
                    </div>

                    {/* Excerpt */}
                    {word.excerpt && (
                        <p className="text-gray-600 mb-6 text-base md:text-lg bahnschrift">
                            {word.excerpt}
                        </p>
                    )}

                    {/* Cover Image */}
                    {word.image && (
                        <div className="mb-6 md:mb-8">
                            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-lg md:max-w-3xl lg:max-w-4xl mx-auto">
                                <img
                                    src={word.image}
                                    alt={word.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    )}

                    {/* Content */}
                    <div className="custom-html-container mx-0 md:mx-auto md:max-w-3xl lg:max-w-4xl">
                        <div className="custom-html bahnschrift">
                            {renderContent()}
                        </div>
                    </div>
                    
                    {/* Navigation */}
                  
                </div>
            </article>
            
            {/* Related content */}
            {/* <div className="my-8">
                <CardArticles />
            </div> */}
        </div>
    );
};

export default WordsDetails; 