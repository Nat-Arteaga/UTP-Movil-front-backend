import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { useLanguageContext } from "../context/LanguageContext";
import { useThemeContext } from "../context/ThemeContext";
import createStyles, { ColorLogin } from "./csslogin";

export default function Login() {
  const router = useRouter();
  const { theme, isDark, toggleTheme } = useThemeContext();
  const { t } = useLanguageContext();
  const styles = createStyles(theme);
  const [verificando, setVerificando] = useState(true);

  // Al abrir la app, si ya hay una sesión guardada y sigue siendo válida,
  // saltamos directo a inicio (sin pasar por esta pantalla ni por SSO).
  useEffect(() => {
    const verificarSesionGuardada = async () => {
      const token = await AsyncStorage.getItem("authToken");

      if (token) {
        try {
          const resp = await fetch(
            "https://front-backend-utp-movil-production.up.railway.app/api/sesion/verificar",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ token }),
            }
          );
          const data = await resp.json();

          if (data.success) {
            router.replace("/inicio/inicio");
            return;
          }
        } catch (error) {
          console.log("No se pudo verificar la sesión guardada:", error.message);
        }

        // Token inválido o expirado: lo limpiamos y nos quedamos en esta pantalla
        await AsyncStorage.removeItem("authToken");
        await AsyncStorage.removeItem("userId");
        await AsyncStorage.removeItem("nombre_usuario");
      }

      setVerificando(false);
    };

    verificarSesionGuardada();
  }, []);

  if (verificando) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ color: theme.colors.text }}>Cargando...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.trianguloDerecha} />
      <View style={styles.trianguloIzquierda} />

      <View style={styles.content}>
        <View style={styles.logoRow}>
          <View style={[styles.logoBox, styles.logoRed]}>
            <Text style={styles.logoText}>U</Text>
          </View>
          <View style={[styles.logoBox, styles.logoDark]}>
            <Text style={styles.logoText}>T</Text>
          </View>
          <View style={[styles.logoBox, styles.logoRed]}>
            <Text style={styles.logoText}>P</Text>
          </View>
          <Text style={styles.plus}>+</Text>
          <Text style={styles.movil}>Movil</Text>
        </View>

        <Text style={styles.title}>{t("welcome")}</Text>
        <Text style={styles.subtitle}>{t("subtitle")}</Text>

        <View style={styles.spacing} />

        <TouchableOpacity
          style={styles.utpButton}
          onPress={() => router.push("/cuenta")}
        >
          <Ionicons name="school" size={24} color={ColorLogin.blanco} />
          <Text style={styles.utpText}>{t("loginButton")}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={toggleTheme}
          style={{
            marginTop: 20,
            alignSelf: "center",
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 10,
            backgroundColor: theme.colors.card,
            borderWidth: 1,
            borderColor: theme.colors.border,
          }}
        >
          <Text style={{ color: theme.colors.text, fontWeight: "bold" }}>
            {isDark ? "☀️ Cambiar a modo claro" : "🌙 Cambiar a modo oscuro"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
