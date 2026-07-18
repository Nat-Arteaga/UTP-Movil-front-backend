import { Ionicons } from "@expo/vector-icons";
import { Image, Text, TouchableOpacity, View } from "react-native";
import styles from "./cssSAE";

export default function SAE({ data, onPress }) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.initialAvatarText}>
            {data.usuario ? data.usuario.replace("@", "").charAt(0).toUpperCase() : ""}
          </Text>
        </View>
        <View style={[styles.iconoBadge, styles.bgNaranja]}>
          <Ionicons name="warning" size={14} color="white" />
        </View>
      </View>

      <View style={styles.textoContainer}>
        <Text style={styles.textoPrincipal}>
          <Text style={styles.usuarioNegrita}>⚠️ {data.usuario} </Text>
          {data.texto}
        </Text>
        <Text style={styles.textoDetalle}>{data.detalle}</Text>
        <Text style={styles.hora}>{data.hora}</Text>
      </View>

      {!data.visto && <View style={styles.puntoNaranja} />}
    </TouchableOpacity>
  );
}
