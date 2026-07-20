import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useThemeContext } from "../../context/ThemeContext";
import { useLanguageContext } from "../../context/LanguageContext";

import styles from "./cssperfil";

export default function Preferencias() {
const {
theme,
isDark,
toggleTheme,
} = useThemeContext();

const {
    language,
    changeLanguage,
    t,
} = useLanguageContext();

return (
    <View style={styles.section}>

    <Text style={styles.sectionTitle}>
        {t("preferences")}
    </Text>

      {/* Tema */}

    <TouchableOpacity
        style={styles.preferenceItem}
        onPress={toggleTheme}
    >
        <View style={styles.preferenceLeft}>
        <Ionicons
            name={isDark ? "moon" : "sunny"}
            size={22}
            color={theme.colors.primary}
        />

        <Text
    style={[
        styles.preferenceText,
        {
            color: theme.colors.text,
        },
    ]}
>
            {t("theme")}
        </Text>
        </View>

        <Text style={styles.preferenceValue}>
        {isDark ? t("dark") : t("light")}
        </Text>
    </TouchableOpacity>

      {/* Idiomas */}

    <Text
    style={[
        styles.languageTitle,
        {
            color: theme.colors.textSecondary,
        },
    ]}
>
        {t("language")}
    </Text>

    <View style={styles.languageContainer}>

        <TouchableOpacity
        style={[
            styles.languageButton,
            language === "es" && styles.languageButtonActive,
        ]}
        onPress={() => changeLanguage("es")}
        >
        <Text style={styles.languageButtonText}>
            ES
        </Text>
        </TouchableOpacity>

        <TouchableOpacity
        style={[
            styles.languageButton,
            language === "en" && styles.languageButtonActive,
        ]}
        onPress={() => changeLanguage("en")}
        >
        <Text style={styles.languageButtonText}>
            EN
        </Text>
        </TouchableOpacity>

        <TouchableOpacity
        style={[
            styles.languageButton,
            language === "pt" && styles.languageButtonActive,
        ]}
        onPress={() => changeLanguage("pt")}
        >
        <Text style={styles.languageButtonText}>
            PT
        </Text>
        </TouchableOpacity>

        <TouchableOpacity
        style={[
            styles.languageButton,
            language === "fr" && styles.languageButtonActive,
        ]}
        onPress={() => changeLanguage("fr")}
        >
        <Text style={styles.languageButtonText}>
            FR
        </Text>
        </TouchableOpacity>

    </View>

    </View>
);
}