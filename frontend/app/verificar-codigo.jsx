import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

export default function VerificarCodigo() {
  const router = useRouter();
  const { correo } = useLocalSearchParams();
  const [codigo, setCodigo] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerificar = async () => {
    const cleanCodigo = codigo.trim();

    if (cleanCodigo.length !== 6) {
      Alert.alert("⚠️ Código incompleto", "Ingresa los 6 dígitos que te enviamos");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://front-backend-utp-movil-production.up.railway.app/api/auth/verificar-codigo",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ correo, codigo: cleanCodigo }),
        }
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error);
      }

      router.push({
        pathname: "/crear-cuenta",
        params: {
          correo: data.correo,
          codigo_estudiante: data.codigo_estudiante,
        },
      });
    } catch (error) {
      Alert.alert("⚠️ No se pudo verificar", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center", padding: 24, backgroundColor: "#fff" }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 8 }}>
        Revisa tu correo
      </Text>
      <Text style={{ color: "#666", marginBottom: 24 }}>
        Te enviamos un código de 6 dígitos a {correo}. Expira en 5 minutos.
      </Text>

      <TextInput
        placeholder="123456"
        placeholderTextColor="#999"
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 10,
          padding: 14,
          marginBottom: 24,
          fontSize: 20,
          textAlign: "center",
          letterSpacing: 6,
        }}
        value={codigo}
        onChangeText={setCodigo}
        keyboardType="number-pad"
        maxLength={6}
      />

      <TouchableOpacity
        style={{
          backgroundColor: "#E60023",
          paddingVertical: 16,
          borderRadius: 10,
          opacity: loading ? 0.6 : 1,
        }}
        onPress={handleVerificar}
        disabled={loading}
      >
        <Text style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}>
          {loading ? "Verificando..." : "Verificar"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={{ marginTop: 16 }} onPress={() => router.back()}>
        <Text style={{ color: "#666", textAlign: "center" }}>
          Usar otro correo
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
