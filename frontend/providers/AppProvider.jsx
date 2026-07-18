import { FeedProvider } from "../context/FeedContext";
import { LanguageProvider } from "../context/LanguageContext";
import { ThemeProvider } from "../context/ThemeContext";

const AppProvider = ({ children }) => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <FeedProvider>{children}</FeedProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default AppProvider;