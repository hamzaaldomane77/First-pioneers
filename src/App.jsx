import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Home from "./pages/Home/Home";
import ServicesTools from "./pages/ServicesTools/ServicesTools";

import Abouts from "./pages/AboutUs/Abouts";
import Research from "./pages/Research/Research";
import Markets from "./pages/Markets&Resources/Markets";
import AllBlog from "./pages/Research/AllBlog";
import Content from "./pages/Content/Content";
import PrivacyPolicy from "./pages/PrivacyPolicy/PrivacyPolicy";
import Questions from "./pages/Questions/Questions.jsx";
import BlogDetails from "./pages/Research/Blogdetails.jsx";
import ResourcesPage from "./pages/Resources";
import ResourceDetails from "./pages/Resources/ResourceDetails";
import { LoadingProvider } from "./context/LoadingContext";
import Toolsdetils from "./pages/ServicesTools/Toolsdetils.jsx";
import Servicesdetils from "./pages/ServicesTools/Servicesdetils.jsx";
import AllTrends from "./pages/Research/AllTrends.jsx";
import TrendDetails from "./pages/Research/MarktsDetails.jsx";
import ReportDetails from "./pages/Research/ReportDetails.jsx";
import AllWords from "./pages/Research/AllWords.jsx";
import WordsDetails from "./pages/Research/WordsDetails.jsx";
import ToolDetails from "./pages/ServicesTools/ToolDetails.jsx";

export default function App() {
  return (
    <LoadingProvider>
      <Router>
        <Routes>
          <Route element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="/ServicesTools" element={<ServicesTools />} />
            <Route path="/AboutUs" element={<Abouts />} />
            <Route path="/Toolsdetils" element={<Toolsdetils />} />
            <Route path="/research-and-insights" element={<Research />} />
            <Route path="/Markets" element={<Markets />} />
            <Route path="/AllBlog" element={<AllBlog />} />
            <Route path="/contact" element={<Content />} />
            <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
            <Route path="/Questions" element={<Questions />} />
            <Route path="/Blogdetails/:slug" element={<BlogDetails />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/resources/:id" element={<ResourceDetails />} />
         
            <Route path="/servicesdetils/:id" element={<Servicesdetils />} />
            <Route path="/all-trends" element={<AllTrends />} />
            <Route path="/trends/:id" element={<TrendDetails />} />
            <Route path="/reports/:id" element={<ReportDetails />} />
            <Route path="/words" element={<AllWords />} />
            <Route path="/words/:id" element={<WordsDetails />} />
            <Route path="/tools/:id" element={<ToolDetails />} />
          </Route>
        </Routes>
      </Router>
    </LoadingProvider>
  );
}
