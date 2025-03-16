import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Home from "./pages/Home/Home";
import ServicesTools from "./pages/ServicesTools/ServicesTools";
import Tools from "./pages/ServicesTools/Tools";
import Abouts from "./pages/AboutUs/Abouts";
import Research from "./pages/Research/Research";
import Markets from "./pages/Markets&Resources/Markets";
import AllBlog from "./pages/Research/AllBlog";

import Content from "./pages/Content/Content";
import PrivacyPolicy from "./pages/PrivacyPolicy/PrivacyPolicy";
import Questions from "./pages/Questions/Questions.jsx";


export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="/ServicesTools" element={<ServicesTools />} />
          <Route path="/AboutUs" element={<Abouts />} />
          <Route path="/Tools" element={<Tools />} />
          <Route path="/research-and-insights" element={<Research />} />
          <Route path="/Markets" element={<Markets />} />
          <Route path="/AllBlog" element={<AllBlog />} />
          <Route path="/contact" element={<Content />} />
          <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
          <Route path="/Questions" element={<Questions />} />
        </Route>
      </Routes>
    </Router>
  );
}
