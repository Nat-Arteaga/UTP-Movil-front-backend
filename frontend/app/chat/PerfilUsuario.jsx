import { Ionicons } from "@expo/vector-icons";
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "./cssPerfilUsuario";

export default function PerfilUsuario({ usuario, onClose, onChatear }) {
  if (!usuario) return null;

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Ionicons name="close" size={28} color="white" />
      </TouchableOpacity>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ paddingHorizontal: 20 }}
      >
        <View style={styles.avatarContainer}>
          <Image source={{ uri: usuario.avatar }} style={styles.avatar} />
          {/* Corrección: Eliminado el espacio en "Ausente" y arreglado el && */}
          <View
            style={[
              styles.statusDot,
              usuario.estado === "Ausente" && styles.statusAway,
            ]}
          />
        </View>

        <Text style={styles.username}>{usuario.nombre}</Text>
        <Text style={styles.carrera}>
          {/* Corrección: Eliminados espacios en "grupo" y "Servidor UTP+" */}
          {usuario.tipo === "grupo"
            ? "Servidor UTP+"
            : "Ing. Sistemas • 4to ciclo"}
        </Text>

        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>245</Text>
            <Text style={styles.statLabel}>Seguidores</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>89</Text>
            <Text style={styles.statLabel}>Siguiendo</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.chatButton} onPress={onChatear}>
          {/* Corrección: Eliminados espacios en name="chatbubble" y color */}
          <Ionicons
            name="chatbubble"
            size={24}
            color="white"
            style={{ marginRight: 10 }}
          />
          <Text style={styles.chatButtonText}>
            Chatear con {usuario.nombre}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Agregar Amigo</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
