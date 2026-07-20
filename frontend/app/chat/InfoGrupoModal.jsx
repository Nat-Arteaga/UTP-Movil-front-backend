import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useChat } from "../../hooks/useChat";
import styles from "./cssGrupoModal";

export default function InfoGrupoModal({ visible, onClose, chat, onSalir }) {
  const {
    userId,
    obtenerMiembrosGrupo,
    expulsarMiembro,
    actualizarGrupo,
    salirDeGrupo,
    regenerarCodigoGrupo,
  } = useChat();

  const [miembros, setMiembros] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [nombreEdit, setNombreEdit] = useState(chat?.nombre || "");
  const [codigoActual, setCodigoActual] = useState(null);

  const soyAdmin = miembros.find((m) => String(m.id) === String(userId))?.rol === "admin";

  const cargarMiembros = async () => {
    if (!chat?.id) return;
    setCargando(true);
    try {
      const data = await obtenerMiembrosGrupo(chat.id);
      setMiembros(data);
    } catch (err) {
      Alert.alert("Error", err.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (visible) {
      setNombreEdit(chat?.nombre || "");
      cargarMiembros();
    }
  }, [visible, chat?.id]);

  const handleExpulsar = (miembro) => {
    Alert.alert(
      "Expulsar miembro",
      `¿Seguro que quieres expulsar a ${miembro.username}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Expulsar",
          style: "destructive",
          onPress: async () => {
            try {
              await expulsarMiembro(chat.id, miembro.id);
              cargarMiembros();
            } catch (err) {
              Alert.alert("Error", err.message);
            }
          },
        },
      ]
    );
  };

  const handleGuardarNombre = async () => {
    if (!nombreEdit.trim()) return;
    try {
      await actualizarGrupo(chat.id, nombreEdit.trim(), undefined);
      Alert.alert("Listo", "Nombre del grupo actualizado.");
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  const handleSalir = () => {
    Alert.alert(
      "Salir del grupo",
      `¿Seguro que quieres salir de "${chat?.nombre}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Salir",
          style: "destructive",
          onPress: async () => {
            try {
              await salirDeGrupo(chat.id);
              onClose();
              onSalir?.();
            } catch (err) {
              Alert.alert("Error", err.message);
            }
          },
        },
      ]
    );
  };

  const handleRegenerarCodigo = async () => {
    try {
      const { codigo } = await regenerarCodigoGrupo(chat.id);
      setCodigoActual(codigo);
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  const copiarCodigo = async () => {
    if (!codigoActual) return;
    await Clipboard.setStringAsync(codigoActual);
    Alert.alert("Copiado", "El código se copió al portapapeles.");
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.card, { maxHeight: "80%" }]}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Ionicons name="close" size={22} color="#999" />
          </TouchableOpacity>

          <Text style={{ color: "#FFF", fontSize: 18, fontWeight: "800", marginBottom: 4 }}>
            {chat?.nombre}
          </Text>
          <Text style={{ color: "#888", fontSize: 12, marginBottom: 16 }}>
            {miembros.length} {miembros.length === 1 ? "miembro" : "miembros"}
          </Text>

          {soyAdmin && (
            <>
              <Text style={styles.label}>Nombre del grupo</Text>
              <View style={{ flexDirection: "row", gap: 8 }}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  value={nombreEdit}
                  onChangeText={setNombreEdit}
                  placeholderTextColor="#888"
                />
                <TouchableOpacity
                  style={{ backgroundColor: "#E60023", borderRadius: 10, paddingHorizontal: 14, justifyContent: "center" }}
                  onPress={handleGuardarNombre}
                >
                  <Ionicons name="checkmark" size={20} color="#FFF" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={{ flexDirection: "row", alignItems: "center", marginTop: 14, gap: 6 }}
                onPress={handleRegenerarCodigo}
              >
                <Ionicons name="refresh-outline" size={16} color="#E60023" />
                <Text style={{ color: "#E60023", fontSize: 13, fontWeight: "700" }}>
                  Regenerar código de invitación
                </Text>
              </TouchableOpacity>

              {codigoActual && (
                <TouchableOpacity style={[styles.codigoBox, { marginTop: 10, paddingVertical: 10 }]} onPress={copiarCodigo}>
                  <Text style={[styles.codigoTexto, { fontSize: 18 }]}>{codigoActual}</Text>
                  <Ionicons name="copy-outline" size={18} color="#E60023" />
                </TouchableOpacity>
              )}
            </>
          )}

          <Text style={[styles.label, { marginTop: 18 }]}>Miembros</Text>

          {cargando ? (
            <ActivityIndicator color="#E60023" style={{ marginTop: 10 }} />
          ) : (
            <View style={{ marginTop: 6 }}>
              {miembros.map((m) => (
                <View
                  key={m.id}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingVertical: 8,
                    borderBottomWidth: 1,
                    borderBottomColor: "#2A2A2A",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <View
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 16,
                        backgroundColor: "#2A2A2A",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text style={{ color: "#FFF", fontWeight: "700" }}>
                        {m.username?.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <View>
                      <Text style={{ color: "#FFF", fontSize: 14 }}>{m.username}</Text>
                      {m.rol === "admin" && (
                        <Text style={{ color: "#E60023", fontSize: 11, fontWeight: "700" }}>ADMIN</Text>
                      )}
                    </View>
                  </View>

                  {soyAdmin && String(m.id) !== String(userId) && (
                    <TouchableOpacity onPress={() => handleExpulsar(m)}>
                      <Ionicons name="person-remove-outline" size={20} color="#E60023" />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>
          )}

          <TouchableOpacity
            style={[styles.primaryBtn, { backgroundColor: "#2A2A2A", marginTop: 18 }]}
            onPress={handleSalir}
          >
            <Text style={[styles.primaryBtnText, { color: "#E60023" }]}>Salir del grupo</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
