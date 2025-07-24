import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = ({ currentLanguage, updateLanguage, t }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isMobileLangDropdownOpen, setIsMobileLangDropdownOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleLangDropdown = () => {
    setIsLangDropdownOpen(!isLangDropdownOpen);
  };

  const toggleMobileLangDropdown = () => {
    setIsMobileLangDropdownOpen(!isMobileLangDropdownOpen);
  };

  const handleLanguageChange = (lang) => {
    updateLanguage(lang);
    setIsLangDropdownOpen(false);
    setIsMobileLangDropdownOpen(false);
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.language-switcher')) {
        setIsLangDropdownOpen(false);
        setIsMobileLangDropdownOpen(false);
      }
      if (!e.target.closest('.mobile-menu') && !e.target.closest('.mobile-menu-btn')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const currentFlag = currentLanguage === 'sq' ? '🇦🇱' : '🇺🇸';
  const currentText = currentLanguage === 'sq' ? 'AL' : 'EN';

  return (
    <header className="header">
      <div className="nav-container">
          <Link to="/" className="logo">
              <img src="/assets/logo.jpeg" alt="Flex    Well Logo" />
              <span>FLEX    WELL</span>
          </Link>

          <ul className="nav-menu">
            <li>
              <Link 
                to="/" 
                className={isActive('/') ? 'active' : ''}
                data-en="HOME" 
                data-sq="KRYEFAQE"
              >
                {t('HOME', 'KRYEFAQE')}
              </Link>
            </li>
            <li>
              <Link 
                to="/about" 
                className={isActive('/about') ? 'active' : ''}
                data-en="ABOUT" 
                data-sq="RRETH NESH"
              >
                {t('ABOUT', 'RRETH NESH')}
              </Link>
            </li>
            <li>
              <Link 
                to="/services" 
                className={isActive('/services') ? 'active' : ''}
                data-en="SERVICES" 
                data-sq="SHËRBIMET"
              >
                {t('SERVICES', 'SHËRBIMET')}
              </Link>
            </li>
            <li>
              <Link 
                to="/appointment" 
                className={isActive('/appointment') ? 'active' : ''}
                data-en="APPOINTMENT" 
                data-sq="TAKIM"
              >
                {t('APPOINTMENT', 'TAKIM')}
              </Link>
            </li>
          </ul>

          <div className="desktop-language">
            <div className="language-switcher">
              <button className="lang-btn" onClick={toggleLangDropdown}>
                <span className="flag">{currentFlag}</span>
                <span className="lang-text">{currentText}</span>
                <span className="arrow">▼</span>
              </button>
              <div className={`lang-dropdown ${isLangDropdownOpen ? 'show' : ''}`}>
                <div className="lang-option" onClick={() => handleLanguageChange('en')}>
                  <span className="flag">🇺🇸</span>
                  <span>English</span>
                </div>
                <div className="lang-option" onClick={() => handleLanguageChange('sq')}>
                  <span className="flag">🇦🇱</span>
                  <span>Shqip</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className={`mobile-menu-btn ${isMobileMenuOpen ? 'active' : ''}`} 
            onClick={toggleMobileMenu}
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>

          {/* Mobile Menu */}
          <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
            <div className="mobile-nav">
              <Link 
                to="/" 
                className={isActive('/') ? 'active' : ''}
                onClick={closeMobileMenu}
                data-en="HOME" 
                data-sq="KRYEFAQE"
              >
                {t('HOME', 'KRYEFAQE')}
              </Link>
              <Link 
                to="/about" 
                className={isActive('/about') ? 'active' : ''}
                onClick={closeMobileMenu}
                data-en="ABOUT" 
                data-sq="RRETH NESH"
              >
                {t('ABOUT', 'RRETH NESH')}
              </Link>
              <Link 
                to="/services" 
                className={isActive('/services') ? 'active' : ''}
                onClick={closeMobileMenu}
                data-en="SERVICES" 
                data-sq="SHËRBIMET"
              >
                {t('SERVICES', 'SHËRBIMET')}
              </Link>
              <Link 
                to="/appointment" 
                className={isActive('/appointment') ? 'active' : ''}
                onClick={closeMobileMenu}
                data-en="APPOINTMENT" 
                data-sq="TAKIM"
              >
                {t('APPOINTMENT', 'TAKIM')}
              </Link>
            </div>
            <div className="mobile-language">
              <div className="language-switcher">
                <button className="lang-btn" onClick={toggleMobileLangDropdown}>
                  <span className="flag">{currentFlag}</span>
                  <span className="lang-text">{currentText}</span>
                  <span className="arrow">▼</span>
                </button>
                <div className={`lang-dropdown ${isMobileLangDropdownOpen ? 'show' : ''}`}>
                  <div className="lang-option" onClick={() => handleLanguageChange('en')}>
                    <span className="flag">🇺🇸</span>
                    <span>English</span>
                  </div>
                  <div className="lang-option" onClick={() => handleLanguageChange('sq')}>
                    <span className="flag">🇦🇱</span>
                    <span>Shqip</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </header>
  );
};

export default Header; 