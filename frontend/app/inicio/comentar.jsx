import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "./csscomentar";
import { useFeed } from "../../context/FeedContext";

export default function Comentar() {
  const router = useRouter();
  const { postId } = useLocalSearchParams();
  const { posts, addComment } = useFeed();
  const post = posts.find((item) => String(item.id) === String(postId));
  const comentarios = post?.comments ?? [];
  const [nuevoComentario, setNuevoComentario] = useState("");

  const agregarComentario = () => {
    if (post && addComment(post.id, nuevoComentario)) {
      setNuevoComentario("");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Comentarios</Text>
        <View style={{ width: 28 }} />
      </View>

      <FlatList
        data={comentarios}
        keyExtractor={(item) => item.id}
        style={styles.list}
        renderItem={({ item }) => (
          <View style={styles.commentItem}>
            <TouchableOpacity
              style={styles.avatarBtn}
              onPress={() => router.push({ pathname: "/inicio/perfilusuario", params: { nombre: item.usuario } })}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.avatar}</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.content}>
              <TouchableOpacity
                onPress={() => router.push({ pathname: "/inicio/perfilusuario", params: { nombre: item.usuario } })}
              >
                <Text style={styles.user}>{item.usuario}</Text>
              </TouchableOpacity>
              <Text style={styles.text}>{item.texto}</Text>
              <Text style={styles.time}>{item.hora}</Text>
            </View>
          </View>
        )}
      />

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Escribe un comentario..."
          placeholderTextColor="#888"
          style={styles.input}
          value={nuevoComentario}
          onChangeText={setNuevoComentario}
          onSubmitEditing={agregarComentario}
        />
        <TouchableOpacity onPress={agregarComentario}>
          <Ionicons name="send" size={24} color="#E60023" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
