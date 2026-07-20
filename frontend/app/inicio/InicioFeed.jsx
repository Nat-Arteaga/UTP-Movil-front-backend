import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useRef, useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import { useBottomNav } from "../../hooks/useBottomNav";
import { useFeed } from "../../context/FeedContext";
import { formatRelativeTime } from "../../utils/time";
import styles from "./cssinicio";

// Reproductor de video de una publicación. Se aisla en su propio
// componente porque useVideoPlayer necesita llamarse igual en cada
// render y no puede vivir dentro de un .map() del componente padre.
function PostVideo({ uri }) {
  const player = useVideoPlayer(uri, (instance) => {
    instance.loop = false;
  });
  return (
    <VideoView
      style={{ width: "100%", aspectRatio: 16 / 9, borderRadius: 12, marginBottom: 10, backgroundColor: "#000" }}
      player={player}
      allowsFullscreen
      allowsPictureInPicture
      nativeControls
    />
  );
}

export default function InicioFeed({ isTab = false, onGoToTab }) {
  const router = useRouter();
  const scrollRef = useRef(null);
  const { paddingBottom } = useBottomNav();
  const { posts, votePost } = useFeed();
  const [activeFilter, setActiveFilter] = useState("destacados");

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ x: 0, y: 0, animated: true });
  };

  const historias = useMemo(
    () => [...new Set(posts.map((post) => post.group).filter(Boolean))],
    [posts],
  );

  const visiblePosts = useMemo(() => {
    const orderedPosts = [...posts];

    if (activeFilter === "destacados") {
      return orderedPosts.sort((first, second) => (Number(second.likes) || 0) - (Number(first.likes) || 0));
    }
    if (activeFilter === "recientes") {
      return orderedPosts.sort((first, second) => new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime());
    }
    if (activeFilter === "siguiendo") {
      return orderedPosts.filter((post) => post.isFollowing);
    }
    if (activeFilter === "grupos") {
      return orderedPosts.filter((post) => post.group);
    }
    return orderedPosts;
  }, [activeFilter, posts]);

  const filters = [
    { id: "destacados", label: "DESTACADOS" },
    { id: "recientes", label: "RECIENTES" },
    { id: "siguiendo", label: "SIGUIENDO" },
    { id: "grupos", label: "GRUPOS" },
  ];

  const containerPaddingBottom = isTab ? 0 : paddingBottom;

  return (
    <SafeAreaView style={[styles.container, { paddingBottom: containerPaddingBottom }]}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={scrollToTop} style={styles.logoContainer}>
          <Text style={styles.logoRed}>UTP+</Text>
          <Text style={styles.logoWhite}>Movil</Text>
        </TouchableOpacity>
        <View style={styles.icons}>
          <TouchableOpacity onPress={() => router.push("/inicio/buscar")}>
            <Ionicons name="search-outline" size={26} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push({ pathname: "/inicio/verpublicaciones", params: { saved: "true" } })}
          >
            <Ionicons name="bookmark-outline" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              if (isTab && onGoToTab) {
                onGoToTab(2); // Ir a notificaciones
              } else {
                router.push("/notificacion/notificaciones");
              }
            }}
          >
            <View style={{ position: "relative" }}>
              <Ionicons name="notifications-outline" size={26} color="white" />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* CONTENIDO SCROLLABLE */}
      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
        {/* HISTORIAS */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.storyScroll}
        >
          <TouchableOpacity
            style={styles.crearStory}
            onPress={() => router.push("/inicio/crearpublicacion")}
          >
            <View style={styles.storyCircle}>
              <Ionicons name="add" size={32} color="#E60023" />
            </View>
            <Text style={styles.storyText}>Crear publicación</Text>
          </TouchableOpacity>

          {historias.map((group) => (
            <TouchableOpacity
              key={group}
              style={styles.storyContainer}
              onPress={() => router.push({ pathname: "/inicio/verpublicaciones", params: { group } })}
            >
              <View style={styles.storyCircle}>
                <Text style={styles.storyInitial}>
                  {group.charAt(0).toUpperCase()}
                </Text>
              </View>
              <Text style={styles.storyLabel}>{group}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* TABS / FILTROS */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabs}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[styles.tabItem, activeFilter === filter.id && styles.tabActive]}
              onPress={() => setActiveFilter(filter.id)}
            >
              <Text style={activeFilter === filter.id ? styles.tabActiveText : styles.tabText}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* POSTS */}
        {visiblePosts.map((post) => (
          <View key={post.id} style={styles.post}>
            <View style={styles.postHeader}>
              <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                <TouchableOpacity
                  style={[styles.avatar, { marginTop: 2 }]}
                  onPress={() => router.push({
                    pathname: "/inicio/perfilusuario",
                    params: { nombre: post.usuario, carrera: post.carrera },
                  })}
                >
                  <Text style={styles.avatarText}>{post.usuario.charAt(0).toUpperCase()}</Text>
                </TouchableOpacity>
                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.user}>{post.usuario}</Text>
                  <Text style={styles.info}>{post.carrera}</Text>
                </View>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.time}>{formatRelativeTime(post.createdAt)}</Text>
                <TouchableOpacity
                  onPress={() => router.push({ pathname: "/inicio/configuracion", params: { postId: post.id } })}
                >
                  <Ionicons
                    name="ellipsis-horizontal"
                    size={18}
                    color="#888"
                    style={{ marginLeft: 5 }}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.postText}>{post.texto}</Text>

            {post.mediaUrl && post.mediaType === "imagen" && (
              <Image
                source={{ uri: post.mediaUrl }}
                style={{ width: "100%", aspectRatio: 4 / 3, borderRadius: 12, marginBottom: 10, backgroundColor: "#111" }}
                resizeMode="cover"
              />
            )}
            {post.mediaUrl && post.mediaType === "video" && <PostVideo uri={post.mediaUrl} />}

            <View style={[styles.category, { backgroundColor: post.colorCat }]}>
              <Text style={styles.categoryText}>{post.categoria}</Text>
            </View>

            {Array.isArray(post.etiquetas) && post.etiquetas.length > 0 && (
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 6, marginBottom: 4 }}>
                {post.etiquetas.map((tag) => (
                  <Text key={tag} style={{ color: "#E60023", fontSize: 13, fontWeight: "600" }}>#{tag}</Text>
                ))}
              </View>
            )}

            <View style={styles.actions}>
              <View style={styles.action}>
                <TouchableOpacity onPress={() => votePost(post.id, "up")}>
                  <Ionicons
                    name={
                      post.userVote === "up" ? "arrow-up" : "arrow-up-outline"
                    }
                    size={24}
                    color={post.userVote === "up" ? "#E60023" : "#888"}
                  />
                </TouchableOpacity>

                <Text
                  style={[
                    styles.actionText,
                    post.userVote === "up" && { color: "#E60023" },
                    post.userVote === "down" && { color: "#888" },
                  ]}
                >
                  {post.likes}
                </Text>

                <TouchableOpacity onPress={() => votePost(post.id, "down")}>
                  <Ionicons
                    name={
                      post.userVote === "down"
                        ? "arrow-down"
                        : "arrow-down-outline"
                    }
                    size={24}
                    color={post.userVote === "down" ? "#E60023" : "#888"}
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.action}
                onPress={() => router.push({ pathname: "/inicio/comentar", params: { postId: post.id } })}
              >
                <Ionicons name="chatbubble-outline" size={22} color="white" />
                <Text style={styles.actionText}>{post.comments?.length ?? 0}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.action}
                onPress={() => router.push({ pathname: "/inicio/compartir", params: { postId: post.id } })}
              >
                <Ionicons name="share-social-outline" size={22} color="white" />
                <Text style={styles.actionText}>Compartir</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {visiblePosts.length === 0 && (
          <Text style={styles.emptyFeedText}>No hay publicaciones para este filtro.</Text>
        )}
      </ScrollView>

      {/* BOTTOM NAVIGATION BAR - Only rendered if NOT inside a parent tab shell */}
      {!isTab && (
        <View style={[styles.bottomNav, { paddingBottom }]}>
          <TouchableOpacity
            style={styles.navItem}
            onPress={scrollToTop}
          >
            <Ionicons name="home" size={26} color="#E60023" />
            <Text style={[styles.navText, styles.navTextActive]}>Inicio</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.push("/chat/chat")}
          >
            <Ionicons name="chatbubble-outline" size={26} color="#888" />
            <Text style={styles.navText}>Chat</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.push("/notificacion/notificaciones")}
          >
            <View style={{ position: "relative" }}>
              <Ionicons name="notifications-outline" size={26} color="#888" />
              <View style={styles.smallBadge}>
                <Text style={styles.smallBadgeText}>3</Text>
              </View>
            </View>
            <Text style={styles.navText}>Notificaciones</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.push("/perfil/perfil")}
          >
            <Ionicons name="person-outline" size={26} color="#888" />
            <Text style={styles.navText}>Perfil</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
