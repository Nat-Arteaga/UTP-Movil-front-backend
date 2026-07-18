import { useLocalSearchParams, useRouter } from "expo-router";
import { Alert, SafeAreaView, Share, Text, TouchableOpacity } from "react-native";
import { useFeed } from "../../context/FeedContext";
import styles from "./csscompartir";

export default function Compartir() {
  const router = useRouter();
  const { postId } = useLocalSearchParams();
  const { posts } = useFeed();
  const post = posts.find((item) => String(item.id) === String(postId));
  const opciones = [
    "Copiar enlace",
    "WhatsApp",
    "Instagram",
    "Facebook",
    "Twitter",
    "Otros dispositivos",
  ];

  const compartir = async () => {
    if (!post) {
      Alert.alert("Publicación no disponible", "No encontramos la publicación que quieres compartir.");
      return;
    }

    const link = `utpmovilapp://inicio/verpublicaciones?postId=${encodeURIComponent(post.id)}`;
    const message = `${post.usuario} compartió en UTP+ Móvil:\n\n${post.texto}\n\n${link}`;

    try {
      await Share.share({ title: "Compartir publicación", message });
    } catch (error) {
      Alert.alert("No se pudo compartir", "Inténtalo nuevamente.");
      console.error("Error al compartir publicación:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Compartir</Text>

      {opciones.map((op, index) => (
        <TouchableOpacity key={index} style={styles.option} onPress={compartir}>
          <Text style={styles.optionText}>{op}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
        <Text style={styles.closeText}>Cerrar</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
