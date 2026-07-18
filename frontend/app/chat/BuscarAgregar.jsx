import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "./cssBuscarAgregar";

export default function BuscarAgregar({ onClose, onEnviarSolicitud }) {
  const [busqueda, setBusqueda] = useState("");

  const usuariosDisponibles = [
    {
      id: "1",
      username: "@TzNakroth",
      nombreReal: "TzNakroth",
      carrera: "Ing. Sistemas",
      ciclo: "4to ciclo",
      avatar: "https://i.pravatar.cc/150?img=12",
    },
    {
      id: "2",
      username: "@CodeMaster",
      nombreReal: "Code Master",
      carrera: "Ing. Software",
      ciclo: "6to ciclo",
      avatar: "https://i.pravatar.cc/150?img=13",
    },
    {
      id: "3",
      username: "@SofiDev",
      nombreReal: "Sofi Developer",
      carrera: "Ciencia de Datos",
      ciclo: "5to ciclo",
      avatar: "https://i.pravatar.cc/150?img=47",
    },
  ];

  const resultados = usuariosDisponibles.filter(
    (user) =>
      user.username.toLowerCase().includes(busqueda.toLowerCase()) ||
      user.nombreReal.toLowerCase().includes(busqueda.toLowerCase()),
  );

  const handleEnviarSolicitud = (usuario) => {
    Alert.alert(
      "✅ Solicitud enviada",
      `${usuario.username} recibirá una notificación para aceptar tu solicitud`,
      [{ text: "OK", onPress: () => onEnviarSolicitud(usuario) }],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Agregar Amigos</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={22} color="#888" />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre o @usuario..."
          placeholderTextColor="#888"
          value={busqueda}
          onChangeText={setBusqueda}
          autoFocus
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.results}>
        {resultados.map((user) => (
          <View key={user.id} style={styles.userCard}>
            <Image source={{ uri: user.avatar }} style={styles.userAvatar} />
            <View style={styles.userInfo}>
              <Text style={styles.username}>{user.username}</Text>
              <Text style={styles.userReal}>{user.nombreReal}</Text>
              <Text style={styles.userCarrera}>
                {user.carrera} • {user.ciclo}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => handleEnviarSolicitud(user)}
            >
              <Ionicons name="person-add" size={22} color="white" />
            </TouchableOpacity>
          </View>
        ))}

        {resultados.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={48} color="#333" />
            <Text style={styles.emptyText}>No se encontraron usuarios</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
