import { useLanguageContext } from "../context/LanguageContext";

const useLanguage = () => {
  return useLanguageContext();
};

export default useLanguage;
