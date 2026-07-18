import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import styles from "./cssPerfilHeader";

export default function PerfilHeader({ onMenuPress }) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.push("/inicio/inicio")}>
        <Text style={styles.logo}>
          UTP+ <Text style={styles.logoBlanco}>Movil</Text>
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onMenuPress}>
        <Ionicons name="ellipsis-horizontal" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}
