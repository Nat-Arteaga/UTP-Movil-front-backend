import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

export default function NuevaPassword() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [loading, setLoading] = useState(false);

  // Solo se puede llegar aquí con un resetToken (obtenido al verificar el
  // código); si alguien entra directo, lo mandamos a empezar de nuevo.
  useEffect(() => {
    if (!params.resetToken) {
      router.replace("/olvide-password");
    }
  }, [params.resetToken]);

  const handleGuardar = async () => {
    if (password.length < 6) {
      Alert.alert("⚠️ Contraseña muy corta", "Usa al menos 6 caracteres");
      return;
    }

    if (password !== confirmar) {
      Alert.alert("⚠️ Las contraseñas no coinciden", "Vuelve a escribirlas");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://backend-utp-movil-production.up.railway.app/api/auth/restablecer-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resetToken: params.resetToken, password }),
        }
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error);
      }

      Alert.alert("✅ Listo", "Tu contraseña se cambió correctamente. Inicia sesión con la nueva.");
      router.replace("/ingresar");
    } catch (error) {
      Alert.alert("⚠️ No se pudo cambiar la contraseña", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center", padding: 24, backgroundColor: "#fff" }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 24 }}>
        Escribe tu nueva contraseña
      </Text>

      <Text style={{ fontWeight: "600", marginBottom: 6 }}>Contraseña nueva</Text>
      <TextInput
        placeholder="Mínimo 6 caracteres"
        placeholderTextColor="#999"
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 10,
          padding: 14,
          marginBottom: 16,
        }}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />

      <Text style={{ fontWeight: "600", marginBottom: 6 }}>Confirmar contraseña</Text>
      <TextInput
        placeholder="Repite tu contraseña"
        placeholderTextColor="#999"
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 10,
          padding: 14,
          marginBottom: 24,
        }}
        value={confirmar}
        onChangeText={setConfirmar}
        secureTextEntry
        autoCapitalize="none"
      />

      <TouchableOpacity
        style={{
          backgroundColor: "#E60023",
          paddingVertical: 16,
          borderRadius: 10,
          opacity: loading ? 0.6 : 1,
        }}
        onPress={handleGuardar}
        disabled={loading}
      >
        <Text style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}>
          {loading ? "Guardando..." : "Guardar contraseña"}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
