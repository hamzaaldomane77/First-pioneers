import React from 'react';
    import Whitebackground from "../../../assets/images/Whitebackground.png";
    import worksecimg from "../../../assets/images/worksecimg.png";
    import { useInView } from 'react-intersection-observer';

export default function Worksec() {

    const { ref, inView } = useInView({
        threshold: 0.3,
        triggerOnce: true,
    });

    const content = [
        {
            title: "How will it benefit your work?",
            description: `Strikethrough asset auto invite
            Strikethrough asset auto invite thumbnail connection bullet connection draft.
            Strikethrough asset auto invite
            Strikethrough asset auto invite thumbnail connection bullet connection draft.
            Strikethrough asset auto invite thumbnail connection bullet
            Strikethrough asset auto invite thumbnail connection bullet connection draft. Style text figjam subtract link share line component link main.`
        }
    ];

    return (
        <section
            className={`min-h-[500px] bg-cover bg-center flex flex-col lg:flex-row-reverse items-center justify-between px-10 lg:px-36 transition-all duration-1000 py-28 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
            style={{ backgroundImage: `url(${Whitebackground})` }}
            ref={ref}
        >
         
            {content.map((item, index) => (
                <div key={index} className="lg:w-1/2 text-left text-black py-10  lg:mx-12">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">{item.title}</h2>
                    <p className="text-lg leading-relaxed text-[#010203] whitespace-pre-line">{item.description}</p>
                </div>
            ))}

         <div className="lg:w-1/2 flex justify-center items-center py-10 ">
                <img src={worksecimg} alt="Work Section" className="rounded-xl shadow-lg" />
            </div>
        </section>
    );
}
