import { createContext, useContext, useEffect, useState } from "react";

import { getData, saveData, STORAGE_KEYS } from "../utils/storage";

import translations from "../translations";

const LanguageContext = createContext();

const LANGUAGES = ["es", "en", "pt", "fr"];

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await getData(STORAGE_KEYS.LANGUAGE);

      if (savedLanguage && LANGUAGES.includes(savedLanguage)) {
        setLanguage(savedLanguage);
      }
    } finally {
      setLoading(false);
    }
  };

  const changeLanguage = async (newLanguage) => {
    if (!LANGUAGES.includes(newLanguage)) return;

    setLanguage(newLanguage);

    await saveData(STORAGE_KEYS.LANGUAGE, newLanguage);
  };

  const t = (key) => {
    return translations[language]?.[key] || key;
  };
  return (
    <LanguageContext.Provider
      value={{
        language,
        changeLanguage,
        loading,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguageContext = () => useContext(LanguageContext);
