import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Alert, FlatList, SafeAreaView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useFeed } from "../../context/FeedContext";
import { formatRelativeTime } from "../../utils/time";
import styles from "./csscomentar";

export default function Comentar() {
  const router = useRouter();
  const { postId } = useLocalSearchParams();
  const { posts, addComment } = useFeed();
  const post = posts.find((item) => String(item.id) === String(postId));
  const comentarios = post?.comments ?? [];
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [enviando, setEnviando] = useState(false);
  // Además del estado (para re-renderizar el botón), se usa un ref porque
  // setState es asíncrono: si el usuario toca "enviar" dos veces muy rápido
  // (doble tap, o Enter del teclado + botón), el segundo tap puede ejecutarse
  // antes de que el primer setEnviando(true) se refleje. Esa era la causa
  // real de los comentarios duplicados: dos POST /comentarios en paralelo.
  const enviandoRef = useRef(false);

  const agregarComentario = async () => {
    if (!post || !nuevoComentario.trim() || enviandoRef.current) return;
    enviandoRef.current = true;
    setEnviando(true);
    try {
      const created = await addComment(post.id, nuevoComentario);
      if (created) setNuevoComentario("");
    } catch (error) {
      Alert.alert("No se pudo comentar", error.message);
    } finally {
      enviandoRef.current = false;
      setEnviando(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="close" size={28} color="white" /></TouchableOpacity>
        <Text style={styles.headerTitle}>Comentarios</Text><View style={{ width: 28 }} />
      </View>
      <FlatList data={comentarios} keyExtractor={(item) => String(item.id)} style={styles.list}
        renderItem={({ item }) => <View style={styles.commentItem}>
          <TouchableOpacity style={styles.avatarBtn} onPress={() => router.push({ pathname: "/inicio/perfilusuario", params: { nombre: item.usuario } })}>
            <View style={styles.avatar}><Text style={styles.avatarText}>{item.avatar}</Text></View>
          </TouchableOpacity>
          <View style={styles.content}>
            <TouchableOpacity onPress={() => router.push({ pathname: "/inicio/perfilusuario", params: { nombre: item.usuario } })}><Text style={styles.user}>{item.usuario}</Text></TouchableOpacity>
            <Text style={styles.text}>{item.texto}</Text><Text style={styles.time}>{formatRelativeTime(item.createdAt ?? item.hora)}</Text>
          </View>
        </View>}
      />
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Escribe un comentario..."
          placeholderTextColor="#888"
          style={styles.input}
          value={nuevoComentario}
          onChangeText={setNuevoComentario}
          onSubmitEditing={agregarComentario}
          editable={!enviando}
        />
        <TouchableOpacity onPress={agregarComentario} disabled={enviando} style={enviando ? { opacity: 0.5 } : undefined}>
          <Ionicons name="send" size={24} color="#E60023" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
