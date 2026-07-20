import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useBottomNav } from "../../hooks/useBottomNav";
import { useThemeContext } from "../../context/ThemeContext";
import { useLanguageContext } from "../../context/LanguageContext";
import styles from "./cssperfil";

// Componentes del perfil
import DatosRegistro from "./DatosRegistro";
import EstadoActual from "./EstadoActual";
import ListaComunidades from "./ListaComunidades";
import ListaPublicaciones from "./ListaPublicaciones";
import MenuDesplegable from "./MenuDesplegable";
import PerfilHeader from "./PerfilHeader";
import TarjetaPerfil from "./TarjetaPerfil";
import Preferencias from "./Preferencias";

export default function Perfil({ isTab = false, onGoToTab }) {
  const router = useRouter();
  const navigation = useNavigation();
  const { paddingBottom } = useBottomNav();
  const { theme } = useThemeContext();
  const { t } = useLanguageContext();
  const [menuVisible, setMenuVisible] = useState(false);
  const [usuario, setUsuario] = useState(null); // null = cargando
  const [error, setError] = useState(null);

  const BASE_URL = "https://front-backend-utp-movil-production.up.railway.app";

  // Cargar datos reales desde PostgreSQL
  const cargarPerfil = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) {
        setUsuario({
          username: "Invitado",
          carrera: "Visitante",
          ciclo: "N/A",
          bio: "Bienvenido a UTP+ Movil",
          genero: "",
          intereses: [],
          estado_actual: "",
          privado: false,
          foto_perfil: null,
          comunidades: [],
          publicaciones: [],
        });
        return;
      }

      // Intentar cargar desde el backend real
      try {
        const response = await fetch(`${BASE_URL}/api/perfil/${userId}`, {
          timeout: 8000,
        });
        const data = await response.json();

        if (data.success && data.perfil) {
          const p = data.perfil;
          const perfilData = {
            username: p.username || "Usuario",
            carrera: p.carrera || "UTP",
            ciclo: p.ciclo || "",
            bio: p.bio || "",
            genero: p.genero || "",
            intereses: Array.isArray(p.intereses)
              ? p.intereses
              : typeof p.intereses === "string" && p.intereses
              ? p.intereses.split(",").map((i) => i.trim())
              : [],
            estado_actual: p.estado_actual || "",
            privado: p.privado === true || p.privado === "true",
            foto_perfil: p.foto_perfil || null,
            comunidades: [],
            publicaciones: [],
          };
          setUsuario(perfilData);
          // Guardar en caché local
          await AsyncStorage.setItem("cached_perfil", JSON.stringify(perfilData));
          return;
        }
      } catch (netError) {
        console.log("Backend no disponible, usando caché:", netError.message);
      }

      // Fallback: usar caché local
      const cached = await AsyncStorage.getItem("cached_perfil");
      if (cached) {
        setUsuario(JSON.parse(cached));
        return;
      }

      // Fallback final: datos mínimos de AsyncStorage
      const localUser = await AsyncStorage.getItem("custom_username");
      const localBio = await AsyncStorage.getItem("custom_bio");
      const localEstado = await AsyncStorage.getItem("custom_estado");
      const localPrivado = await AsyncStorage.getItem("perfil_privado");
      const localFoto = await AsyncStorage.getItem("foto_perfil");
      setUsuario({
        username: localUser || "Usuario",
        carrera: "",
        ciclo: "",
        bio: localBio || "",
        genero: "",
        intereses: [],
        estado_actual: localEstado || "",
        privado: localPrivado === "true",
        foto_perfil: localFoto || null,
        comunidades: [],
        publicaciones: [],
      });
    } catch (error) {
      console.error("Error cargando perfil:", error);
      setError("No se pudo cargar el perfil");
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      cargarPerfil();
    });
    return unsubscribe;
  }, [navigation]);


  const containerPaddingBottom = isTab ? 0 : paddingBottom;

  // Mostrar cargando mientras el perfil se obtiene
  if (!usuario) {
    return (
      <SafeAreaView style={[styles.container, { paddingBottom: containerPaddingBottom }]}>
        <PerfilHeader onMenuPress={() => setMenuVisible(!menuVisible)} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E60023" />
          <Text style={styles.loadingText}>
    {t("loading_profile")}
</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
    style={[
        styles.container,
        {
            paddingBottom: containerPaddingBottom,
            backgroundColor: theme.colors.background,
        },
    ]}
    >
      {/* HEADER */}
      <PerfilHeader onMenuPress={() => setMenuVisible(!menuVisible)} />

      {/* MENÚ DESPLEGABLE */}
      {menuVisible && (
        <MenuDesplegable
          visible={menuVisible}
          onClose={() => setMenuVisible(false)}
          //  CERRAR SESIÓN
          onCerrarSesion={async () => {
            try {
              console.log("🔒 Cerrando sesión...");
              const token = await AsyncStorage.getItem("authToken");
              if (token) {
                fetch(
                  "https://front-backend-utp-movil-production.up.railway.app/api/sesion/cerrar",
                  {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ token }),
                }).catch((e) => console.log("No se pudo cerrar la sesión en el servidor:", e.message));
              }
              await AsyncStorage.removeItem("userId");
              await AsyncStorage.removeItem("authToken");
              await AsyncStorage.removeItem("nombre_usuario");
              setMenuVisible(false);
              router.replace("/login");
            } catch (error) {
              console.error("Error al cerrar sesión:", error);
            }
          }}
          // ✏️ EDITAR PERFIL
          onEditarPerfil={() => {
            setMenuVisible(false);
            router.push({
              pathname: "/perfil/EditarPerfil",
              params: {
                username: usuario.username,
                bio: usuario.bio,
                carrera: usuario.carrera,
                ciclo: usuario.ciclo,
                genero: usuario.genero,
                intereses: JSON.stringify(usuario.intereses || []),
                privado: usuario.privado ? "true" : "false",
                fotoPerfil: usuario.foto_perfil || "",
              },
            });
          }}
          // 🔒 PRIVACIDAD
          onPrivacidad={() => {
            setMenuVisible(false);
            router.push({
              pathname: "/perfil/EditarPerfil",
              params: {
                username: usuario.username,
                bio: usuario.bio,
                carrera: usuario.carrera,
                ciclo: usuario.ciclo,
                genero: usuario.genero,
                intereses: JSON.stringify(usuario.intereses || []),
                privado: usuario.privado ? "true" : "false",
                fotoPerfil: usuario.foto_perfil || "",
              },
            });
          }}
          // 🔖 GUARDADOS
          onGuardados={() => {
            setMenuVisible(false);
            router.push("/perfil/Guardados");
          }}
        />
      )}

      {/* CONTENIDO PRINCIPAL */}
      <ScrollView
    showsVerticalScrollIndicator={false}
    style={{
        backgroundColor: theme.colors.background,
    }}
>

        <TarjetaPerfil usuario={usuario} />

        <DatosRegistro usuario={usuario} />

        <Preferencias />

        {!(usuario.privado === true || usuario.privado === "true") ? (
          <>
            <EstadoActual
              estadoInicial={usuario.estado_actual || ""}
              onGuardar={async (nuevoEstado) => {
                setUsuario((prev) => ({ ...prev, estado_actual: nuevoEstado }));
                const userId = await AsyncStorage.getItem("userId");
                if (userId) {
                  fetch(`${BASE_URL}/api/perfil/${userId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ estado_actual: nuevoEstado }),
                  }).catch((e) => console.log("No se pudo guardar estado en backend:", e.message));
                }
              }}
            />

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
              <Text
                style={[
                  styles.sectionTitle,
                  {
                    color: theme.colors.text,
                  },
                ]}
              >
                {t("communities")}
              </Text>
                <TouchableOpacity>
                  <Text style={styles.verTodas}>{t("see_all")} → →</Text>
                </TouchableOpacity>
              </View>
              <ListaComunidades comunidades={usuario.comunidades || []} />
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
              <Text
    style={[
        styles.sectionTitle,
        {
            color: theme.colors.text,
        },
    ]}
>{t("my_posts")}</Text>
                <TouchableOpacity>
                  <Text style={styles.verTodas}>{t("see_all")} →  →</Text>
                </TouchableOpacity>
              </View>
              <ListaPublicaciones publicaciones={usuario.publicaciones || []} />
            </View>
          </>
        ) : (
          <View style={styles.privadoContainer}>
            <View style={styles.lockCircle}>
              <Ionicons name="lock-closed" size={32} color="#888" />
            </View>
          <Text
    style={[
        styles.sectionTitle,
        {
            color: theme.colors.text,
        },
    ]}
>{t("private_profile")}</Text>
            <Text style={styles.privadoSubtitle}>
              {t("private_profile_description")}
            </Text>
          </View>
        )}

        {/* BOTÓN CERRAR SESIÓN FINAL */}
      <TouchableOpacity 
          style={[
            styles.logoutButton,
            {
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
            },
          ]}
          onPress={async () => {
            const token = await AsyncStorage.getItem("authToken");
            if (token) {
              fetch(
                "https://front-backend-utp-movil-production.up.railway.app/api/sesion/cerrar", 
                {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token }),
              }).catch((e) => console.log("No se pudo cerrar la sesión en el servidor:", e.message));
            }
            await AsyncStorage.removeItem("userId");
            await AsyncStorage.removeItem("authToken");
            await AsyncStorage.removeItem("nombre_usuario");
            router.replace("/login");
          }}
        >
          <Ionicons name="log-out-outline" size={20} color="#E60023" />
          <Text style={styles.logoutText}>{t("logout")}</Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* BOTTOM NAV */}
      {!isTab && (
        <View
          style={[
            styles.bottomNav,
            {
              paddingBottom,
              backgroundColor: theme.colors.tabBar,
              borderTopColor: theme.colors.border,
            },
          ]}
        >
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.push("/inicio/inicio")}
          >
            <Ionicons name="home-outline" size={26} color="#888" />
            <Text style={styles.navText}>{t("home")}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.push("/chat/chat")}
          >
            <Ionicons name="chatbubble-outline" size={26} color="#888" />
            <Text style={styles.navText}>{t("chat")}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.push("/notificacion/notificaciones")}
          >
            <View style={{ position: "relative" }}>
              <Ionicons name="notifications-outline" size={26} color="#888" />
              <View style={styles.smallBadge}>
                <Text style={styles.smallBadgeText}>3</Text>
              </View>
            </View>
            <Text style={styles.navText}>{t("notifications")}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="person" size={26} color="#E60023" />
            <Text style={[styles.navText, styles.navTextActive]}>{t("profile")}</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}