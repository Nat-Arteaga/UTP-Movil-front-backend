import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, Image, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useFeed } from "../../context/FeedContext";
import { useBottomNav } from "../../hooks/useBottomNav";
import { subirMediaPublicacion } from "../../utils/supabaseStorage";
import styles from "./csscrearpublicacion";

export default function CrearPublicacion() {
  const router = useRouter();
  const { paddingBottom } = useBottomNav();
  const { createPost, currentUser } = useFeed();
  const [texto, setTexto] = useState("");
  const [categoria, setCategoria] = useState("General");
  const [publicando, setPublicando] = useState(false);
  const categorias = ["General", "Académico", "Tecnología", "Social"];

  // Media (foto o video) seleccionada localmente; se sube recién al publicar.
  const [mediaLocalUri, setMediaLocalUri] = useState(null);
  const [mediaType, setMediaType] = useState(null); // "imagen" | "video"

  // Etiquetas
  const [etiquetas, setEtiquetas] = useState([]);
  const [mostrarInputEtiqueta, setMostrarInputEtiqueta] = useState(false);
  const [nuevaEtiqueta, setNuevaEtiqueta] = useState("");

  const pedirPermisoGaleria = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permiso requerido", "Necesitamos acceso a tu galería para adjuntar archivos.");
      return false;
    }
    return true;
  };

  const elegirFoto = async () => {
    if (!(await pedirPermisoGaleria())) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets.length > 0) {
      setMediaLocalUri(result.assets[0].uri);
      setMediaType("imagen");
    }
  };

  const elegirVideo = async () => {
    if (!(await pedirPermisoGaleria())) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 0.8,
      videoMaxDuration: 60,
    });
    if (!result.canceled && result.assets.length > 0) {
      setMediaLocalUri(result.assets[0].uri);
      setMediaType("video");
    }
  };

  const quitarMedia = () => {
    setMediaLocalUri(null);
    setMediaType(null);
  };

  const agregarEtiqueta = () => {
    const limpia = nuevaEtiqueta.trim().replace(/^#/, "").toLowerCase();
    if (limpia && !etiquetas.includes(limpia) && etiquetas.length < 10) {
      setEtiquetas((previas) => [...previas, limpia]);
    }
    setNuevaEtiqueta("");
  };

  const quitarEtiqueta = (tag) => {
    setEtiquetas((previas) => previas.filter((item) => item !== tag));
  };

  const publicar = async () => {
    if (!texto.trim()) {
      Alert.alert("Error", "Escribe algo primero");
      return;
    }
    setPublicando(true);
    try {
      let mediaUrl = null;
      if (mediaLocalUri && mediaType) {
        try {
          mediaUrl = await subirMediaPublicacion(mediaLocalUri, mediaType, currentUser.id);
        } catch (mediaError) {
          setPublicando(false);
          Alert.alert("No se pudo subir el archivo", mediaError.message);
          return;
        }
      }

      await createPost({
        texto,
        categoria,
        ...(mediaUrl ? { mediaUrl, mediaType } : {}),
        ...(etiquetas.length ? { etiquetas } : {}),
      });
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
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.userInfo}>
          <View style={styles.avatar}><Text style={styles.avatarText}>{currentUser.nombre.charAt(0).toUpperCase()}</Text></View>
          <Text style={styles.username}>{currentUser.nombre}</Text>
        </View>
        <TextInput placeholder="¿Qué estás pensando?" placeholderTextColor="#888" style={styles.textArea} multiline value={texto} onChangeText={setTexto} />

        {mediaLocalUri && mediaType === "imagen" && (
          <View style={{ marginHorizontal: 20, marginBottom: 16 }}>
            <Image source={{ uri: mediaLocalUri }} style={{ width: "100%", aspectRatio: 4 / 3, borderRadius: 12, backgroundColor: "#111" }} resizeMode="cover" />
            <TouchableOpacity onPress={quitarMedia} style={{ position: "absolute", top: 8, right: 8, backgroundColor: "rgba(0,0,0,0.6)", borderRadius: 16, padding: 6 }}>
              <Ionicons name="close" size={18} color="white" />
            </TouchableOpacity>
          </View>
        )}
        {mediaLocalUri && mediaType === "video" && (
          <View style={{ marginHorizontal: 20, marginBottom: 16, backgroundColor: "#111", borderRadius: 12, padding: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="videocam" size={22} color="#E60023" />
              <Text style={{ color: "white", marginLeft: 10 }}>Video listo para publicar</Text>
            </View>
            <TouchableOpacity onPress={quitarMedia}><Ionicons name="close" size={20} color="#888" /></TouchableOpacity>
          </View>
        )}

        <View style={styles.categorySelector}>
          {categorias.map((item) => <TouchableOpacity key={item} style={[styles.categoryButton, categoria === item && styles.categoryButtonActive]} onPress={() => setCategoria(item)}>
            <Text style={[styles.categoryButtonText, categoria === item && styles.categoryButtonTextActive]}>{item}</Text>
          </TouchableOpacity>)}
        </View>

        {etiquetas.length > 0 && (
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginHorizontal: 20, marginBottom: 12 }}>
            {etiquetas.map((tag) => (
              <TouchableOpacity key={tag} onPress={() => quitarEtiqueta(tag)} style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#111", borderRadius: 14, paddingHorizontal: 10, paddingVertical: 6 }}>
                <Text style={{ color: "#E60023", fontWeight: "600", marginRight: 4 }}>#{tag}</Text>
                <Ionicons name="close" size={14} color="#888" />
              </TouchableOpacity>
            ))}
          </View>
        )}
        {mostrarInputEtiqueta && (
          <View style={{ flexDirection: "row", alignItems: "center", marginHorizontal: 20, marginBottom: 12 }}>
            <TextInput
              placeholder="Escribe una etiqueta y presiona enter"
              placeholderTextColor="#888"
              style={[styles.textArea, { flex: 1, minHeight: 44, marginBottom: 0, marginHorizontal: 0 }]}
              value={nuevaEtiqueta}
              onChangeText={setNuevaEtiqueta}
              onSubmitEditing={agregarEtiqueta}
              autoFocus
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={agregarEtiqueta} style={{ marginLeft: 10 }}>
              <Ionicons name="add-circle" size={30} color="#E60023" />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.options}>
          <TouchableOpacity style={styles.option} onPress={elegirFoto}>
            <Ionicons name="image" size={24} color="#E60023" />
            <Text style={styles.optionText}>Foto</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option} onPress={elegirVideo}>
            <Ionicons name="videocam" size={24} color="#E60023" />
            <Text style={styles.optionText}>Video</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option} onPress={() => setMostrarInputEtiqueta((prev) => !prev)}>
            <Ionicons name="pricetag" size={24} color="#E60023" />
            <Text style={styles.optionText}>Etiqueta</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={[styles.mainPublishBtn, publicando && { opacity: 0.6 }]} onPress={publicar} disabled={publicando}>
          {publicando ? <ActivityIndicator color="white" /> : <Text style={styles.mainPublishText}>Publicar ahora</Text>}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
