import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import styles from "./cssListaPublicaciones";

export default function ListaPublicaciones({ publicaciones }) {
  const router = useRouter();

  const getEtiquetaColor = (etiqueta) => {
    switch (etiqueta) {
      case "Discusión":
        return "#E60023";
      case "Imagen":
        return "#9333EA";
      case "Meme":
        return "#F59E0B";
      default:
        return "#8A8A8A";
    }
  };

  // Estado vacío
  if (!publicaciones || publicaciones.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="document-text-outline" size={40} color="#333" />
        <Text style={styles.emptyText}>Compártenos tu día</Text>
        <Text style={styles.emptySubText}>
          Aún no tienes publicaciones. ¡Sé el primero en compartir algo!
        </Text>
        <TouchableOpacity
          style={styles.emptyBtn}
          onPress={() => router.push("/inicio/crearpublicacion")}
        >
          <Ionicons name="add-circle-outline" size={18} color="#FFFFFF" />
          <Text style={styles.emptyBtnText}>Crear publicación</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View>
      {publicaciones.map((pub) => (
        <TouchableOpacity key={pub.id} style={styles.publicacion}>
          <View style={styles.header}>
            <View style={styles.userInfo}>
              <Image
                source={{ uri: "https://i.pravatar.cc/150?img=12" }}
                style={styles.avatar}
              />
              <Text style={styles.titulo}>{pub.titulo}</Text>
            </View>
            <Ionicons name="ellipsis-horizontal" size={18} color="#8A8A8A" />
          </View>

          <View
            style={[
              styles.etiquetaContainer,
              { backgroundColor: getEtiquetaColor(pub.etiqueta) },
            ]}
          >
            <Text style={styles.etiquetaTexto}>{pub.etiqueta}</Text>
          </View>

          {pub.imagen && (
            <Image source={{ uri: pub.imagen }} style={styles.imagen} />
          )}

          <View style={styles.footer}>
            <View style={styles.stats}>
              <View style={styles.stat}>
                <Ionicons name="arrow-up-outline" size={18} color="#8A8A8A" />
                <Text style={styles.statText}>{pub.likes}</Text>
              </View>
              <View style={styles.stat}>
                <Ionicons name="chatbubble-outline" size={18} color="#8A8A8A" />
                <Text style={styles.statText}>{pub.comentarios}</Text>
              </View>
            </View>
            <Text style={styles.hora}>{pub.hora}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}
