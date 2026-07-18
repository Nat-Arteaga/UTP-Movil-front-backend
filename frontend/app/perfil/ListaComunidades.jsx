import { Ionicons } from "@expo/vector-icons";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import styles from "./cssListaComunidades";

export default function ListaComunidades({ comunidades }) {
  // Estado vacío
  if (!comunidades || comunidades.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="people-outline" size={36} color="#333" />
        <Text style={styles.emptyText}>Aún no te unes a una comunidad</Text>
        <Text style={styles.emptySubText}>
          Explora y únete para conectar con otros estudiantes
        </Text>
      </View>
    );
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {comunidades.map((comunidad) => (
        <TouchableOpacity key={comunidad.id} style={styles.comunidad}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: comunidad.icono }} style={styles.avatar} />
            <View style={styles.statusDot} />
          </View>
          <Text style={styles.nombre}>{comunidad.nombre}</Text>
          <Text style={styles.miembros}>{comunidad.miembros} miembros</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
