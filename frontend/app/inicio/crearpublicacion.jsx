import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, SafeAreaView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useFeed } from "../../context/FeedContext";
import { useBottomNav } from "../../hooks/useBottomNav";
import styles from "./csscrearpublicacion";

export default function CrearPublicacion() {
  const router = useRouter();
  const { paddingBottom } = useBottomNav();
  const { createPost, currentUser } = useFeed();
  const [texto, setTexto] = useState("");
  const [categoria, setCategoria] = useState("General");
  const [publicando, setPublicando] = useState(false);
  const categorias = ["General", "Académico", "Tecnología", "Social"];

  const publicar = async () => {
    if (!texto.trim()) {
      Alert.alert("Error", "Escribe algo primero");
      return;
    }
    setPublicando(true);
    try {
      await createPost({ texto, categoria });
      Alert.alert("Publicación creada", "Tu publicación ya aparece en el feed.");
      router.back();
    } catch (error) {
      Alert.alert("No se pudo publicar", error.message);
    } finally {
      setPublicando(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { paddingBottom }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="close" size={28} color="white" /></TouchableOpacity>
        <Text style={styles.title}>Crear publicación</Text><View style={{ width: 28 }} />
      </View>
      <View style={styles.userInfo}>
        <View style={styles.avatar}><Text style={styles.avatarText}>{currentUser.nombre.charAt(0).toUpperCase()}</Text></View>
        <Text style={styles.username}>{currentUser.nombre}</Text>
      </View>
      <TextInput placeholder="¿Qué estás pensando?" placeholderTextColor="#888" style={styles.textArea} multiline value={texto} onChangeText={setTexto} />
      <View style={styles.categorySelector}>
        {categorias.map((item) => <TouchableOpacity key={item} style={[styles.categoryButton, categoria === item && styles.categoryButtonActive]} onPress={() => setCategoria(item)}>
          <Text style={[styles.categoryButtonText, categoria === item && styles.categoryButtonTextActive]}>{item}</Text>
        </TouchableOpacity>)}
      </View>
      <View style={styles.options}>
        <TouchableOpacity style={styles.option}><Ionicons name="image" size={24} color="#E60023" /><Text style={styles.optionText}>Foto</Text></TouchableOpacity>
        <TouchableOpacity style={styles.option}><Ionicons name="videocam" size={24} color="#E60023" /><Text style={styles.optionText}>Video</Text></TouchableOpacity>
        <TouchableOpacity style={styles.option}><Ionicons name="pricetag" size={24} color="#E60023" /><Text style={styles.optionText}>Etiqueta</Text></TouchableOpacity>
      </View>
      <TouchableOpacity style={[styles.mainPublishBtn, publicando && { opacity: 0.6 }]} onPress={publicar} disabled={publicando}>
        <Text style={styles.mainPublishText}>{publicando ? "Publicando..." : "Publicar ahora"}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
