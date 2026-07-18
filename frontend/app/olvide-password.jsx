import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

const FORMATO_CORREO_UTP = /^u\d{8}@utp\.edu\.pe$/i;

export default function OlvidePassword() {
  const router = useRouter();
  const [correo, setCorreo] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEnviar = async () => {
    const cleanCorreo = correo.trim().toLowerCase();

    if (!FORMATO_CORREO_UTP.test(cleanCorreo)) {
      Alert.alert(
        "⚠️ Correo inválido",
        "Ingresa tu correo institucional, ej. u12345678@utp.edu.pe"
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://backend-utp-movil-production.up.railway.app/api/auth/enviar-codigo-recuperacion",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ correo: cleanCorreo }),
        }
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error);
      }

      router.push({
        pathname: "/verificar-codigo",
        params: { correo: cleanCorreo, modo: "recuperar" },
      });
    } catch (error) {
      Alert.alert("⚠️ No se pudo enviar el código", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center", padding: 24, backgroundColor: "#fff" }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 8 }}>
        Recupera tu contraseña
      </Text>
      <Text style={{ color: "#666", marginBottom: 24 }}>
        Ingresa el correo institucional de tu cuenta y te mandamos un código para restablecerla.
      </Text>

      <Text style={{ fontWeight: "600", marginBottom: 6 }}>Correo institucional</Text>
      <TextInput
        placeholder="u12345678@utp.edu.pe"
        placeholderTextColor="#999"
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 10,
          padding: 14,
          marginBottom: 24,
        }}
        value={correo}
        onChangeText={setCorreo}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
      />

      <TouchableOpacity
        style={{
          backgroundColor: "#E60023",
          paddingVertical: 16,
          borderRadius: 10,
          opacity: loading ? 0.6 : 1,
        }}
        onPress={handleEnviar}
        disabled={loading}
      >
        <Text style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}>
          {loading ? "Enviando..." : "Enviar código"}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
