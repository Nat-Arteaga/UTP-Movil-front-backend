import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView, Text, TouchableOpacity } from "react-native";
import styles from "./cssgenero";

export default function Genero() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const handleSelect = (genero) => {
    router.push({ pathname: "/intereses", params: { ...params, genero } });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>¿Cuál es tu género?</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleSelect("Masculino")}
      >
        <Text style={styles.buttonText}>Masculino</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleSelect("Femenino")}
      >
        <Text style={styles.buttonText}>Femenino</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleSelect("Prefiero no decirlo")}
      >
        <Text style={styles.buttonText}>Prefiero no decirlo</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
