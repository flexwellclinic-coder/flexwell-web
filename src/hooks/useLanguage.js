import { useState, useEffect } from 'react';

export const useLanguage = () => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });

  const updateLanguage = (lang) => {
    setCurrentLanguage(lang);
    localStorage.setItem('language', lang);
    
    // Update all elements with data-en and data-sq attributes
    const elements = document.querySelectorAll('[data-en][data-sq]');
    elements.forEach(element => {
      if (lang === 'sq') {
        element.textContent = element.getAttribute('data-sq');
      } else {
        element.textContent = element.getAttribute('data-en');
      }
    });

    // Update form placeholders
    const inputsWithPlaceholders = document.querySelectorAll('input[data-placeholder-en], textarea[data-placeholder-en]');
    inputsWithPlaceholders.forEach(input => {
      if (lang === 'sq' && input.getAttribute('data-placeholder-sq')) {
        input.placeholder = input.getAttribute('data-placeholder-sq');
      } else if (input.getAttribute('data-placeholder-en')) {
        input.placeholder = input.getAttribute('data-placeholder-en');
      }
    });

    // Update select options
    const selectElements = document.querySelectorAll('select option[data-en][data-sq]');
    selectElements.forEach(option => {
      if (lang === 'sq') {
        option.textContent = option.getAttribute('data-sq');
      } else {
        option.textContent = option.getAttribute('data-en');
      }
    });
  };

  const t = (enText, sqText) => {
    return currentLanguage === 'sq' ? sqText : enText;
  };

  useEffect(() => {
    // Apply language on mount
    updateLanguage(currentLanguage);
  }, [currentLanguage]);

  return {
    currentLanguage,
    updateLanguage,
    t
  };
}; 