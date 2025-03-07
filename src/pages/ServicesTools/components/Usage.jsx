import React from 'react';
import Redbackground from "../../../assets/images/Redbackground.png";
import Usageimg from "../../../assets/images/Usageimg.png";
import { useInView } from 'react-intersection-observer';

export default function Usage() {

    const { ref, inView } = useInView({
        threshold: 0.3,
        triggerOnce: true,
    });

    const content = [
        {
            title: "What is Usage & Attitude Studies?",
            description: `Strikethrough asset auto invite thumbnail connection bullet connection draft. Style text figjam subtract link share line component link main. Strikethrough asset auto invite thumbnail connection bullet connection draft. Style text figjam subtract link share line component link main.
Strikethrough asset auto invite thumbnail connection bullet connection draft. Style text figjam subtract link share line component link main.
Strikethrough asset auto invite thumbnail connection bullet
Strikethrough asset auto invite thumbnail connection bullet connection draft. Style text figjam subtract link share line component link main. Strikethrough asset auto invite thumbnail connection bullet connection draft. Style text figjam subtract link share line component link main.`
        }
    ];

    return (
        <section
            className={`min-h-[500px] bg-cover bg-center  flex flex-col lg:flex-row items-center justify-between px-10 lg:px-36 transition-all duration-1000 py-28 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
            style={{ backgroundImage: `url(${Redbackground})` }}
            ref={ref}
        >
            {content.map((item, index) => (
                <div key={index} className="lg:w-1/2 text-left text-black py-10 ">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">{item.title}</h2>
                    <p className="text-lg leading-relaxed text-[#010203]">{item.description}</p>
                </div>
            ))}
            <div className="lg:w-1/2 flex justify-center items-center py-10 lg:mx-12">
                <img src={Usageimg} alt="Usage Study" className="rounded-xl shadow-lg" />
            </div>
        </section>
    );
}
