import { useLocalSearchParams, useRouter } from "expo-router";
import { Alert, SafeAreaView, Text, TouchableOpacity } from "react-native";
import { useFeed } from "../../context/FeedContext";
import styles from "./cssconfiguracion";

export default function Configuracion() {
  const router = useRouter();
  const { postId } = useLocalSearchParams();
  const { posts, savedPostIds, toggleSavedPost, reportPost } = useFeed();
  const post = posts.find((item) => String(item.id) === String(postId));
  const isSaved = post ? savedPostIds.includes(post.id) : false;

  const handleSave = async () => {
    if (!post) return;
    try {
      const saved = await toggleSavedPost(post.id);
      Alert.alert("Publicación actualizada", saved ? "Se guardó en tu perfil." : "Se quitó de tus guardados.");
      router.back();
    } catch (error) {
      Alert.alert("No se pudo actualizar", error.message);
    }
  };

  const handleReport = () => {
    if (!post || post.reported) return;
    Alert.alert("Reportar publicación", "¿Quieres enviar este reporte para revisarlo?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Reportar", style: "destructive", onPress: () => {
        reportPost(post.id);
        Alert.alert("Reporte enviado", "Gracias. Guardamos tu reporte localmente.");
        router.back();
      } },
    ]);
  };

  const handleViewMore = () => {
    if (post) router.replace({ pathname: "/inicio/verpublicaciones", params: { postId: post.id } });
  };

  return <SafeAreaView style={styles.container}>
    <Text style={styles.title}>Opciones</Text>
    <TouchableOpacity style={styles.option} onPress={handleSave}><Text style={styles.optionText}>{isSaved ? "Quitar de guardados" : "Guardar en perfil"}</Text></TouchableOpacity>
    <TouchableOpacity style={styles.option} onPress={handleReport}><Text style={[styles.optionText, { color: "#E60023" }]}>{post?.reported ? "Reporte enviado" : "Reportar"}</Text></TouchableOpacity>
    <TouchableOpacity style={styles.option} onPress={handleViewMore}><Text style={styles.optionText}>Ver publicación completa</Text></TouchableOpacity>
    <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}><Text style={styles.closeText}>Cerrar</Text></TouchableOpacity>
  </SafeAreaView>;
}
