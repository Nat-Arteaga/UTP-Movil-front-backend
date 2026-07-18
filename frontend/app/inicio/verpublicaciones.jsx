import { useLocalSearchParams } from "expo-router";
import { FlatList, SafeAreaView, Text, View } from "react-native";
import { useFeed } from "../../context/FeedContext";
import styles from "./cssverpublicaciones";

export default function VerPublicaciones() {
  const { postId, group, author, saved } = useLocalSearchParams();
  const { posts, savedPostIds } = useFeed();
  const visiblePosts = postId
    ? posts.filter((post) => String(post.id) === String(postId))
    : group
      ? posts.filter((post) => post.group === group)
      : author
        ? posts.filter((post) => post.usuario === author)
        : saved === "true"
          ? posts.filter((post) => savedPostIds.includes(post.id))
          : posts;
  const title = postId
    ? "Publicación"
    : group
      ? group
      : author
        ? `Publicaciones de ${author}`
        : saved === "true"
          ? "Guardados"
          : "Feed en Vivo";

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <FlatList
        data={visiblePosts}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay publicaciones para mostrar.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.user}>{item.usuario}</Text>
              <Text style={styles.time}>{item.group ?? item.categoria}</Text>
            </View>
            <Text style={styles.text}>{item.texto}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
