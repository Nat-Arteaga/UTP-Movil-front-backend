import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "./cssGuardados";

export default function Guardados() {
  const router = useRouter();
  const [guardados, setGuardados] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const raw = await AsyncStorage.getItem("publicaciones_guardadas");
        if (raw) {
          setGuardados(JSON.parse(raw));
        }
      } catch (e) {
        console.error("Error cargando guardados:", e);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconCircle}>
        <Ionicons name="bookmark-outline" size={44} color="#333" />
      </View>
      <Text style={styles.emptyTitle}>Aún no tienes guardados</Text>
      <Text style={styles.emptySubtitle}>
        Cuando guardes una publicación, aparecerá aquí para que la veas cuando quieras.
      </Text>
      <TouchableOpacity
        style={styles.explorarBtn}
        onPress={() => router.push("/inicio/inicio")}
      >
        <Ionicons name="compass-outline" size={18} color="#FFFFFF" />
        <Text style={styles.explorarBtnText}>Explorar publicaciones</Text>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardAvatar}>
          <Text style={styles.cardAvatarText}>
            {(item.autor || "?").charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardAutor}>{item.autor || "Usuario"}</Text>
          <Text style={styles.cardFecha}>{item.fecha || ""}</Text>
        </View>
        <Ionicons name="bookmark" size={18} color="#E60023" />
      </View>
      <Text style={styles.cardContenido} numberOfLines={3}>
        {item.contenido || ""}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Guardados</Text>
        <View style={{ width: 24 }} />
      </View>

      {cargando ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="#E60023" size="large" />
        </View>
      ) : (
        <FlatList
          data={guardados}
          keyExtractor={(item, i) => String(item.id || i)}
          renderItem={renderItem}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={
            guardados.length === 0 ? styles.flatListEmpty : styles.flatListContent
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}
