import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LibraryPortal from "./pages/library";
import Library2 from "./pages/library2";
import StudentLogin from "./pages/studentlogin";
import Faculty from "./pages/facultylogin";
import AdminLogin from "./pages/adminlogin";
import Librarian from "./pages/librarian";
import Librarian1 from "./pages/librarian1";
import About from "./pages/about";
import Contact from "./pages/contact";
import Services from "./pages/services";
import Home from "./pages/home";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<LibraryPortal />} />

        <Route path="/studentlogin" element={<StudentLogin />} />
        <Route path="/facultylogin" element={<Faculty />} />
        <Route path="/adminlogin" element={<AdminLogin />} />

        {/* flow: librarian → librarian1 */}
        <Route path="/librarian" element={<Librarian />} />
        <Route path="/librarian1" element={<Librarian1 />} />

        <Route path="/home" element={<Home />} />
        <Route path="/library2" element={<Library2 />} />

        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/services" element={<Services />} />

        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;