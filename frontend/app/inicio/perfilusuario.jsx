import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "./cssperfilusuario";

const BASE_URL = "https://front-backend-utp-movil-production.up.railway.app";

export default function PerfilUsuario() {
  const router = useRouter();
  const { userId, nombre } = useLocalSearchParams();
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        if (userId) {
          const res = await fetch(`${BASE_URL}/api/perfil/${userId}`);
          const data = await res.json();
          if (data.success && data.perfil) {
            setUsuario(data.perfil);
            return;
          }
        }
        // Fallback si no hay userId
        setUsuario({ username: nombre || "Usuario", carrera: "", ciclo: "" });
      } catch (err) {
        setUsuario({ username: nombre || "Usuario", carrera: "", ciclo: "" });
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, [userId]);

  if (cargando) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#E60023" style={{ flex: 1 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ alignItems: "center", paddingVertical: 30 }}>
        {/* Avatar */}
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {(usuario?.username || "U").charAt(0).toUpperCase()}
          </Text>
        </View>

        {/* Nombre */}
        <Text style={styles.name}>{usuario?.username}</Text>

        {/* Carrera y ciclo */}
        {usuario?.carrera ? (
          <Text style={styles.info}>
            {usuario.carrera}{usuario?.ciclo ? ` • ${usuario.ciclo}` : ""}
          </Text>
        ) : null}

        {/* Bio */}
        {usuario?.bio ? (
          <Text style={{ color: "#aaa", fontSize: 13, marginTop: 8, textAlign: "center", paddingHorizontal: 20 }}>
            "{usuario.bio}"
          </Text>
        ) : null}

        {/* Datos */}
        <View style={{
          flexDirection: "row",
          gap: 16,
          marginTop: 20,
          backgroundColor: "#111",
          borderRadius: 16,
          padding: 16,
          width: "90%",
        }}>
          {usuario?.genero ? (
            <View style={{ alignItems: "center", flex: 1 }}>
              <Text style={{ color: "#E60023", fontSize: 11, fontWeight: "700" }}>GÉNERO</Text>
              <Text style={{ color: "#fff", fontSize: 13, marginTop: 4 }}>{usuario.genero}</Text>
            </View>
          ) : null}
          {usuario?.intereses ? (
            <View style={{ alignItems: "center", flex: 1 }}>
              <Text style={{ color: "#E60023", fontSize: 11, fontWeight: "700" }}>INTERESES</Text>
              <Text style={{ color: "#fff", fontSize: 12, marginTop: 4, textAlign: "center" }}>
                {Array.isArray(usuario.intereses)
                  ? usuario.intereses.slice(0, 3).join(", ")
                  : usuario.intereses}
              </Text>
            </View>
          ) : null}
        </View>

        {/* Estado actual */}
        {usuario?.estado_actual ? (
          <View style={{
            width: "90%",
            marginTop: 16,
            backgroundColor: "#111",
            borderRadius: 16,
            padding: 16,
          }}>
            <Text style={{ color: "#E60023", fontSize: 11, fontWeight: "700" }}>ESTADO ACTUAL</Text>
            <Text style={{ color: "#fff", fontSize: 14, marginTop: 6 }}>{usuario.estado_actual}</Text>
          </View>
        ) : null}

        <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
          <Text style={styles.btnText}>Cerrar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}