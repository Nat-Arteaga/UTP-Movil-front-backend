import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "./cssusuario";

export default function Usuario() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegistro = async () => {
    const cleanUser = username.replace(/^@/, "").trim();

    if (!cleanUser) {
      Alert.alert("⚠️ Falta dato", "Ingresa un nombre de usuario válido");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://front-backend-utp-movil-production.up.railway.app/api/registro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre_usuario: cleanUser,
          genero: params.genero,
          intereses: params.intereses,
          carrera: params.carrera,
          ciclo: params.ciclo,
          correo: params.correo,
          password: params.password,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error);
      }

      await AsyncStorage.setItem("userId", String(data.userId));
      await AsyncStorage.setItem("nombre_usuario", cleanUser);
      if (data.token) {
        await AsyncStorage.setItem("authToken", data.token);
      }

      Alert.alert("✅ Éxito", "Registro completado");

      router.replace("/inicio/inicio");
    } catch (error) {
      console.error(error);
      Alert.alert("⚠️ Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentBox}>
        <Text style={styles.title}>Último paso</Text>
        <Text style={styles.subtitle}>Elige tu nombre de usuario único</Text>

        <View style={styles.inputWrapper}>
          <Text style={styles.atSymbol}>@</Text>
          <TextInput
            placeholder="TuUsuario"
            placeholderTextColor="#666"
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.disabledBtn]}
          onPress={handleRegistro}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Creando cuenta..." : "Finalizar Registro"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
