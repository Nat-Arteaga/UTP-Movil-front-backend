import { createContext, useContext, useEffect, useState } from "react";

import darkTheme from "../constants/theme/darkTheme";
import lightTheme from "../constants/theme/lightTheme";

import { getData, saveData, STORAGE_KEYS } from "../utils/storage";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [theme, setTheme] = useState(lightTheme);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
  try {
    const savedTheme = await getData(STORAGE_KEYS.THEME);

    if (savedTheme === "dark") {
      setTheme(darkTheme);
      setIsDark(true);
    } else {
      setTheme(lightTheme);
      setIsDark(false);
    }
  } finally {
    setLoading(false);
  }
};

const toggleTheme = async () => {
  try {
    const newDark = !isDark;

    setIsDark(newDark);

    if (newDark) {
      setTheme(darkTheme);
      await saveData(STORAGE_KEYS.THEME, "dark");
    } else {
      setTheme(lightTheme);
      await saveData(STORAGE_KEYS.THEME, "light");
    }
  } catch (error) {
    console.log("Error cambiando tema:", error);
  }
};

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark,
        loading,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);
