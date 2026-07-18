import { Ionicons } from "@expo/vector-icons";
import { Image, Text, TouchableOpacity, View } from "react-native";
import styles from "./cssAmistad";

export default function Amistad({ data, onAceptar, onRechazar }) {
  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.initialAvatarText}>
            {data.usuario ? data.usuario.replace("@", "").charAt(0).toUpperCase() : ""}
          </Text>
        </View>
        <View style={[styles.iconoBadge, styles.bgMagenta]}>
          <Ionicons name="person-add" size={14} color="white" />
        </View>
      </View>

      <View style={styles.textoContainer}>
        <Text style={styles.textoPrincipal}>
          <Text style={styles.usuarioNegrita}>{data.usuario} </Text>
          quiere ser tu amigo
        </Text>
        <Text style={styles.hora}>{data.hora}</Text>
      </View>

      <View style={styles.botones}>
        <TouchableOpacity style={styles.btnAceptar} onPress={onAceptar}>
          <Ionicons name="checkmark" size={20} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnRechazar} onPress={onRechazar}>
          <Ionicons name="close" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Corrección: Operador && corregido */}
      {!data.visto && <View style={styles.puntoMagenta} />}
    </View>
  );
}
