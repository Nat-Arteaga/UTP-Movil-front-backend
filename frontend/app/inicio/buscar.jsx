import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useFeed } from "../../context/FeedContext";
import styles from "./cssbuscar";

const normalize = (value) => value
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase();

export default function Buscar() {
  const router = useRouter();
  const [busqueda, setBusqueda] = useState("");
  const { posts } = useFeed();

  const resultados = useMemo(() => {
    const query = normalize(busqueda.trim());
    if (!query) return [];

    const publicaciones = posts
      .filter((post) => normalize(`${post.texto} ${post.usuario} ${post.categoria}`).includes(query))
      .map((post) => ({
        id: `post-${post.id}`,
        nombre: post.usuario,
        descripcion: post.texto,
        tipo: "Publicación",
        postId: post.id,
      }));

    const usuarios = [...new Map(posts.map((post) => [post.usuario, post])).values()]
      .filter((post) => normalize(`${post.usuario} ${post.carrera}`).includes(query))
      .map((post) => ({
        id: `user-${post.usuario}`,
        nombre: post.usuario,
        descripcion: post.carrera,
        tipo: "Usuario",
        carrera: post.carrera,
      }));

    const grupos = [...new Set(posts.map((post) => post.group).filter(Boolean))]
      .filter((group) => normalize(group).includes(query))
      .map((group) => ({
        id: `group-${group}`,
        nombre: group,
        descripcion: "Ver publicaciones del grupo",
        tipo: "Grupo",
        group,
      }));

    return [...publicaciones, ...usuarios, ...grupos];
  }, [busqueda, posts]);

  const openResult = (item) => {
    if (item.tipo === "Publicación") {
      router.push({ pathname: "/inicio/verpublicaciones", params: { postId: item.postId } });
    } else if (item.tipo === "Grupo") {
      router.push({ pathname: "/inicio/verpublicaciones", params: { group: item.group } });
    } else {
      router.push({ pathname: "/inicio/perfilusuario", params: { nombre: item.nombre, carrera: item.carrera } });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Buscar</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.searchBox}>
        <Ionicons name="search" size={24} color="#888" />
        <TextInput
          placeholder="Buscar usuarios, temas o publicaciones..."
          placeholderTextColor="#888"
          style={styles.searchInput}
          value={busqueda}
          onChangeText={setBusqueda}
          autoFocus
        />
      </View>

      <Text style={styles.sectionTitle}>
        {busqueda.trim() ? `Resultados (${resultados.length})` : "Escribe para buscar"}
      </Text>
      <FlatList
        data={resultados}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={busqueda.trim() ? <Text style={styles.emptyText}>No encontramos resultados.</Text> : null}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.resultItem} onPress={() => openResult(item)}>
            <View style={styles.resultAvatar}>
              <Text style={styles.resultInitial}>{item.nombre[0]}</Text>
            </View>
            <View style={styles.resultInfo}>
              <Text style={styles.resultName}>{item.nombre}</Text>
              <Text style={styles.resultType}>{item.tipo}</Text>
              <Text style={styles.resultDescription} numberOfLines={2}>{item.descripcion}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}
