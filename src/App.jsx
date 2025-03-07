import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Home from "./pages/Home/Home";
import ServicesTools from "./pages/ServicesTools/ServicesTools";
import Tools from "./pages/ServicesTools/Tools";
import Abouts from "./pages/AboutUs/Abouts";


export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="/ServicesTools" element={<ServicesTools />} />
          <Route path="/AboutUs" element={<Abouts />} />
          <Route path="/Tools" element={<Tools />} />
        </Route>
      </Routes>
    </Router>
  );
}
