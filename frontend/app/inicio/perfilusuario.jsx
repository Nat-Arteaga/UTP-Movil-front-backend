import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { useFeed } from "../../context/FeedContext";
import styles from "./cssperfilusuario";

export default function PerfilUsuario() {
  const router = useRouter();
  const { nombre, carrera } = useLocalSearchParams();
  const { posts } = useFeed();
  const userName = typeof nombre === "string" ? nombre : "TzNakroth";
  const userPosts = posts.filter((post) => post.usuario === userName);
  const userCareer = typeof carrera === "string" ? carrera : userPosts[0]?.carrera ?? "Estudiante UTP";

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{userName.charAt(0).toUpperCase()}</Text>
      </View>
      <Text style={styles.name}>{userName}</Text>
      <Text style={styles.info}>{userCareer}</Text>
      <Text style={styles.postCount}>{userPosts.length} publicaciones en el feed</Text>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => router.push({ pathname: "/inicio/verpublicaciones", params: { author: userName } })}
      >
        <Text style={styles.btnText}>Ver publicaciones</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
        <Text style={styles.btnText}>Cerrar</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
