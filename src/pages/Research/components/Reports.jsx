import React, { useState } from 'react';
import Whitebackground from "../../../assets/images/Whitebackground.png";
import { useInView } from 'react-intersection-observer';
import { CustomSvg } from '../../../components/custom-svg';

export default function Reports() {
    const { ref, inView } = useInView({
        threshold: 0.3,
        triggerOnce: true,
    });

    // Card data - English content
    const cards = [
        {
            id: 1,
            logo: "Logo-main",
            title: "Customers Satisfaction In Consumers Markets 2024",
            description: "Strikethrough asset auto invite thumbnail connection bullet connection draft. Style text figjam. Strikethrough asset auto invite thumbnail connection bullet connection draft."
        },
        {
            id: 2,
            logo: "Logo-main",
            title: "Market Research Report 2024",
            description: "Strikethrough asset auto invite thumbnail connection bullet connection draft. Style text figjam. Strikethrough asset auto invite thumbnail connection bullet."
        },
        {
            id: 3,
            logo: "Logo-main",
            title: "Consumer Trends Analysis",
            description: "Strikethrough asset auto invite thumbnail connection bullet connection draft. Style text figjam. Strikethrough asset auto invite thumbnail connection."
        },
        {
            id: 4,
            logo: "Logo-main",
            title: "Industry Insights 2024",
            description: "Strikethrough asset auto invite thumbnail connection bullet connection draft. Style text figjam. Strikethrough asset auto invite thumbnail connection bullet."
        }
    ];

    return (
        <section
            className={`min-h-[500px] bg-cover bg-center flex flex-col items-center justify-center px-6 lg:px-36 transition-all duration-1000 py-28 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
            style={{ backgroundImage: `url(${Whitebackground})` }}
            ref={ref}
        >
            <div className="w-full max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {cards.map((card) => (
                        <Card 
                            key={card.id} 
                            logo={card.logo} 
                            title={card.title} 
                            description={card.description} 
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

function Card({ logo, title, description }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div 
            className="relative overflow-hidden rounded-s-3xl  shadow-lg bg-white h-96 cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Corner triangle */}
            <div 
                className="absolute top-0 left-0 w-24 h-24 transition-opacity duration-500 rounded-e-fullxl"
                style={{ 
                    opacity: isHovered ? '1' : '0.6',
                    background: 'linear-gradient(to bottom right, #D5996E 0%, #D5996E 50%, transparent 50%, transparent 50%)'
                }}
            />
            
            {/* Logo at the top center */}
            <div className="absolute inset-x-0 top-8 flex items-center justify-center h-32">
                <CustomSvg name={logo} className="w-24 h-24" />
            </div>
            
            
            <div 
                className={`absolute inset-x-0 flex justify-center transition-all duration-500 ease-in-out px-6 ${
                    isHovered 
                        ? 'opacity-0' 
                        : 'opacity-100'
                }`}
                style={{ top: '10rem' }}
            >
                <h3 className="text-xl font-bold text-center text-black">{title}</h3>
            </div>
            
            {/* View Report button */}
            <div 
                className={`absolute bottom-6 inset-x-0 flex justify-center transition-all duration-500 ease-in-out ${
                    isHovered 
                        ? 'opacity-0' 
                        : 'opacity-100'
                }`}
            >
                <button className="px-6 py-2 text-red-700 font-medium">View Report</button>
            </div>
            
            {/* Overlay with title and description that appears on hover */}
            <div 
                className={`absolute inset-0 bg-white bg-opacity-85 flex flex-col items-center justify-center p-6 transition-all duration-1000 ease-in-out ${
                    isHovered 
                        ? 'translate-y-0' 
                        : 'translate-y-full'
                }`}
            >
                <h3 className="text-xl font-bold mb-4 text-center text-red-700">{title}</h3>
                <p className="text-sm text-center mb-6">{description}</p>
                <button className="px-12 py-19 text-red-700 font-medium">View Report</button>
            </div>
        </div>
    );
}