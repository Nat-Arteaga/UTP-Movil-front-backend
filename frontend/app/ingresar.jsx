import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

export default function Ingresar() {
  const router = useRouter();
  const [codigo, setCodigo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleIngresar = async () => {
    const cleanCodigo = codigo.trim();

    if (!cleanCodigo || !password) {
      Alert.alert("⚠️ Faltan datos", "Ingresa tu código de estudiante y tu contraseña");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://front-backend-utp-movil-production.up.railway.app/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ codigo_estudiante: cleanCodigo, password }),
        }
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error);
      }

      await AsyncStorage.setItem("userId", String(data.userId));
      await AsyncStorage.setItem("nombre_usuario", data.nombre_usuario);
      await AsyncStorage.setItem("authToken", data.token);

      router.replace("/inicio/inicio");
    } catch (error) {
      console.error(error);
      Alert.alert("⚠️ No se pudo iniciar sesión", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center", padding: 24, backgroundColor: "#fff" }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 24 }}>
        Inicia sesión
      </Text>

      <Text style={{ fontWeight: "600", marginBottom: 6 }}>Código de estudiante</Text>
      <TextInput
        placeholder="U12345678"
        placeholderTextColor="#999"
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 10,
          padding: 14,
          marginBottom: 16,
        }}
        value={codigo}
        onChangeText={setCodigo}
        autoCapitalize="characters"
        autoCorrect={false}
        maxLength={9}
      />

      <Text style={{ fontWeight: "600", marginBottom: 6 }}>Contraseña</Text>
      <TextInput
        placeholder="Tu contraseña"
        placeholderTextColor="#999"
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 10,
          padding: 14,
          marginBottom: 24,
        }}
        value={password}
        onChangeText={setPassword}
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
        onPress={handleIngresar}
        disabled={loading}
      >
        <Text style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}>
          {loading ? "Ingresando..." : "Entrar"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={{ marginTop: 16 }} onPress={() => router.push("/verificar-correo")}>
        <Text style={{ color: "#666", textAlign: "center" }}>
          No tengo cuenta, quiero crear una
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
