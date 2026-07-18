import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import styles from "./cssMenuDesplegable";

// ✅ Agregamos onEditarPerfil, onPrivacidad y onGuardados a las props
export default function MenuDesplegable({
  visible,
  onClose,
  onCerrarSesion,
  onEditarPerfil,
  onPrivacidad,
  onGuardados,
}) {
  if (!visible) return null;

  const opciones = [
    { icono: "create-outline", texto: "Editar perfil", accion: onEditarPerfil },
    { icono: "lock-closed-outline", texto: "Privacidad", accion: onPrivacidad },
    { icono: "person-outline", texto: "Cuenta", accion: onClose },
    { icono: "bookmark-outline", texto: "Guardados", accion: onGuardados },
  ];

  return (
    <View style={styles.container}>
      {opciones.map((opcion, index) => (
        <TouchableOpacity
          key={index}
          style={styles.opcion}
          onPress={() => {
            onClose();
            if (opcion.accion) opcion.accion();
          }}
        >
          <Ionicons name={opcion.icono} size={20} color="#8A8A8A" />
          <Text style={styles.opcionTexto}>{opcion.texto}</Text>
        </TouchableOpacity>
      ))}

      <View style={styles.divider} />

      <TouchableOpacity style={styles.opcion} onPress={onCerrarSesion}>
        <Ionicons name="log-out-outline" size={20} color="#E60023" />
        <Text style={[styles.opcionTexto, styles.cerrarSesion]}>
          Cerrar sesión
        </Text>
      </TouchableOpacity>
    </View>
  );
}
