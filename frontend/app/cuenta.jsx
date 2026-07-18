import { useRouter } from "expo-router";
import { SafeAreaView, Text, TouchableOpacity } from "react-native";

export default function Cuenta() {
  const router = useRouter();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
        backgroundColor: "#fff",
      }}
    >
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: 30,
        }}
      >
        ¿Ya tienes una cuenta creada en UTP+ Movil?
      </Text>

      <TouchableOpacity
        style={{
          backgroundColor: "#E60023",
          paddingVertical: 16,
          paddingHorizontal: 24,
          borderRadius: 10,
          width: "100%",
          marginBottom: 12,
        }}
        onPress={() => router.push("/ingresar")}
      >
        <Text style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}>
          Sí, ya tengo cuenta
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          backgroundColor: "#111",
          paddingVertical: 16,
          paddingHorizontal: 24,
          borderRadius: 10,
          width: "100%",
        }}
        onPress={() => router.push("/verificar-correo")}
      >
        <Text style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}>
          No, quiero crear una cuenta
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
