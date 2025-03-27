import React from "react";
import Hero from "./components/Hero";
import AboutusHome from "./components/AboutusHome";
import Services from "./components/Services";
import Impact from "./components/Impact";
import Testimonials from "./components/Testimonials";
import Research from "./components/Research";
import Clients from "./components/Clients";
import OurPartners from "./components/OurPartners";
import Transform from "./components/Transform";
import Agency from "./components/Agency";



const Home = () => {
    return (
<>
<Hero />
<AboutusHome /> 
<Agency />
<Services />
<Impact />
<Testimonials />
<Research />
<Clients /> 
<OurPartners />
<Transform />
</>
    );
};

export default Home;
