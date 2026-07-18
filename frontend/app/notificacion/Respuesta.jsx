import { Ionicons } from "@expo/vector-icons";
import { Image, Text, TouchableOpacity, View } from "react-native";
import styles from "./cssRespuesta";

export default function Respuesta({ data, onPress }) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.initialAvatarText}>
            {data.usuario ? data.usuario.replace("@", "").charAt(0).toUpperCase() : ""}
          </Text>
        </View>
        <View style={[styles.iconoBadge, styles.bgAzul]}>
          <Ionicons name="chatbubble" size={14} color="white" />
        </View>
      </View>

      <View style={styles.textoContainer}>
        <Text style={styles.textoPrincipal}>
          <Text style={styles.usuarioNegrita}>{data.usuario} </Text>
          {data.texto}
        </Text>
        {data.detalle && (
          <Text style={styles.textoDetalle}>&quot;{data.detalle}&quot;</Text>
        )}
        <Text style={styles.hora}>{data.hora}</Text>
      </View>

      {!data.visto && <View style={styles.puntoAzul} />}
    </TouchableOpacity>
  );
}
