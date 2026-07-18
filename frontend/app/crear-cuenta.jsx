import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

export default function CrearCuenta() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");

  // Esta pantalla solo se puede llegar con el correo ya verificado por OTP.
  // Si alguien entra directo (sin pasar por la verificación), lo mandamos
  // a empezar por ahí.
  useEffect(() => {
    if (!params.correo || !params.codigo_estudiante) {
      router.replace("/verificar-correo");
    }
  }, [params.correo, params.codigo_estudiante]);

  const handleContinuar = () => {
    if (password.length < 6) {
      Alert.alert("⚠️ Contraseña muy corta", "Usa al menos 6 caracteres");
      return;
    }

    if (password !== confirmar) {
      Alert.alert("⚠️ Las contraseñas no coinciden", "Vuelve a escribirlas");
      return;
    }

    router.push({
      pathname: "/genero",
      params: {
        correo: params.correo,
        codigo_estudiante: params.codigo_estudiante,
        password,
      },
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center", padding: 24, backgroundColor: "#fff" }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 8 }}>
        Crea tu contraseña
      </Text>
      <Text style={{ color: "#666", marginBottom: 4 }}>
        Correo verificado:
      </Text>
      <Text style={{ fontWeight: "600", marginBottom: 24 }}>
        {params.correo} (código {params.codigo_estudiante})
      </Text>

      <Text style={{ fontWeight: "600", marginBottom: 6 }}>Contraseña</Text>
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
        style={{ backgroundColor: "#E60023", paddingVertical: 16, borderRadius: 10 }}
        onPress={handleContinuar}
      >
        <Text style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}>
          Continuar
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
