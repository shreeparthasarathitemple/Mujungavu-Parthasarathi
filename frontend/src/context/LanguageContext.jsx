import React, { createContext, useState, useContext } from 'react';
import { translations } from '../utils/translations';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('kn'); // Default to Kannada based on previous step

  const toggleLanguage = () => {
    setLanguage((prevLang) => (prevLang === 'kn' ? 'en' : 'kn'));
  };

  const t = (section, key) => {
    if (translations[section] && translations[section][key]) {
      return translations[section][key][language];
    }
    return key; // Fallback
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
