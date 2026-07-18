import { Image, Text, TouchableOpacity, View } from "react-native";
import styles from "./cssMencion";

export default function Mencion({ data, onPress }) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.initialAvatarText}>
            {data.usuario ? data.usuario.replace("@", "").charAt(0).toUpperCase() : ""}
          </Text>
        </View>
        <View style={[styles.iconoBadge, styles.bgRojo]}>
          <Text style={styles.iconoTexto}>@</Text>
        </View>
      </View>

      <View style={styles.textoContainer}>
        <Text style={styles.textoPrincipal}>
          <Text style={styles.usuarioNegrita}>{data.usuario} </Text>
          te mencionó en {data.grupo}
        </Text>
        {data.detalle && (
          <Text style={styles.textoDetalle}>&quot;{data.detalle}&quot;</Text>
        )}
        <Text style={styles.hora}>{data.hora}</Text>
      </View>

      {!data.visto && <View style={styles.puntoRojo} />}
    </TouchableOpacity>
  );
}
