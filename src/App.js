import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import About from './components/About';
import Services from './components/Services';
import Appointment from './components/Appointment';
import Admin from './components/Admin';
import { useLanguage } from './hooks/useLanguage';

function App() {
  const { currentLanguage, updateLanguage, t } = useLanguage();

  return (
    <Router>
      <div className="App">
        <Header 
          currentLanguage={currentLanguage} 
          updateLanguage={updateLanguage} 
          t={t} 
        />
        <main>
          <Routes>
            <Route path="/" element={<Home t={t} />} />
            <Route path="/about" element={<About t={t} />} />
            <Route path="/services" element={<Services t={t} />} />
            <Route path="/appointment" element={<Appointment t={t} />} />
            <Route path="/admin" element={<Admin t={t} />} />
          </Routes>
        </main>
        <Footer t={t} />
      </div>
    </Router>
  );
}

export default App; 