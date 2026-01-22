import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import vi from "./vi";
import en from "./en";

i18n.use(initReactI18next).init({
  resources: {
    vi,
    en,
  },
  lng: "vi", // Ngôn ngữ mặc định là tiếng Việt
  fallbackLng: "vi",
  compatibilityJSON: "v3", // Fix Intl API warning in React Native
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
