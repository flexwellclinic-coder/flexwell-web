import { useState, useEffect } from 'react';

export const useLanguage = () => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    try {
      return localStorage.getItem('language') || 'en';
    } catch (error) {
      console.warn('localStorage not available:', error);
      return 'en';
    }
  });

  const updateLanguage = (lang) => {
    setCurrentLanguage(lang);
    try {
      localStorage.setItem('language', lang);
    } catch (error) {
      console.warn('Could not save language to localStorage:', error);
    }
    
    // Update all elements with data-en and data-sq attributes
    try {
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
    } catch (error) {
      console.warn('Error updating DOM elements:', error);
    }
  };

  const t = (enText, sqText) => {
    return currentLanguage === 'sq' ? sqText : enText;
  };

  useEffect(() => {
    // Apply language on mount
    try {
      updateLanguage(currentLanguage);
    } catch (error) {
      console.warn('Error applying language on mount:', error);
    }
  }, [currentLanguage]);

  return {
    currentLanguage,
    updateLanguage,
    t
  };
}; 