import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { useState } from "react";
import {
  Alert,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useChat } from "../../hooks/useChat";
import styles from "./cssGrupoModal";

export default function GrupoModal({ visible, onClose }) {
  const { crearGrupo, unirseGrupo } = useChat();

  const [tab, setTab] = useState("crear"); // "crear" | "unirse"
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [codigoInput, setCodigoInput] = useState("");
  const [codigoGenerado, setCodigoGenerado] = useState(null);
  const [cargando, setCargando] = useState(false);

  const resetYCerrar = () => {
    setNombre("");
    setDescripcion("");
    setCodigoInput("");
    setCodigoGenerado(null);
    setTab("crear");
    onClose();
  };

  const handleCrear = async () => {
    if (!nombre.trim()) {
      Alert.alert("Falta el nombre", "Ponle un nombre a tu grupo.");
      return;
    }
    setCargando(true);
    try {
      const grupo = await crearGrupo(nombre.trim(), descripcion.trim());
      setCodigoGenerado(grupo.codigo);
    } catch (err) {
      Alert.alert("Error", err.message || "No se pudo crear el grupo");
    } finally {
      setCargando(false);
    }
  };

  const handleUnirse = async () => {
    if (!codigoInput.trim()) {
      Alert.alert("Falta el código", "Ingresa el código de invitación.");
      return;
    }
    setCargando(true);
    try {
      const grupo = await unirseGrupo(codigoInput.trim().toUpperCase());
      Alert.alert("Listo", `Te uniste a "${grupo.nombre}"`);
      resetYCerrar();
    } catch (err) {
      Alert.alert("Error", err.message || "Código inválido");
    } finally {
      setCargando(false);
    }
  };

  const copiarCodigo = async () => {
    await Clipboard.setStringAsync(codigoGenerado);
    Alert.alert("Copiado", "El código se copió al portapapeles.");
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={resetYCerrar}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <TouchableOpacity style={styles.closeBtn} onPress={resetYCerrar}>
            <Ionicons name="close" size={22} color="#999" />
          </TouchableOpacity>

          {!codigoGenerado ? (
            <>
              <View style={styles.tabs}>
                <TouchableOpacity
                  style={[styles.tabBtn, tab === "crear" && styles.tabBtnActivo]}
                  onPress={() => setTab("crear")}
                >
                  <Text style={[styles.tabText, tab === "crear" && styles.tabTextActivo]}>
                    Crear grupo
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.tabBtn, tab === "unirse" && styles.tabBtnActivo]}
                  onPress={() => setTab("unirse")}
                >
                  <Text style={[styles.tabText, tab === "unirse" && styles.tabTextActivo]}>
                    Unirse con código
                  </Text>
                </TouchableOpacity>
              </View>

              {tab === "crear" ? (
                <>
                  <Text style={styles.label}>Nombre del grupo</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Ej. Proyecto Final BD"
                    placeholderTextColor="#888"
                    value={nombre}
                    onChangeText={setNombre}
                  />
                  <Text style={styles.label}>Descripción (opcional)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="¿De qué trata el grupo?"
                    placeholderTextColor="#888"
                    value={descripcion}
                    onChangeText={setDescripcion}
                  />
                  <TouchableOpacity
                    style={styles.primaryBtn}
                    onPress={handleCrear}
                    disabled={cargando}
                  >
                    <Text style={styles.primaryBtnText}>
                      {cargando ? "Creando..." : "Crear grupo"}
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={styles.label}>Código de invitación</Text>
                  <TextInput
                    style={[styles.input, styles.codigoInput]}
                    placeholder="EJ. AB3XQZ"
                    placeholderTextColor="#888"
                    autoCapitalize="characters"
                    maxLength={6}
                    value={codigoInput}
                    onChangeText={setCodigoInput}
                  />
                  <TouchableOpacity
                    style={styles.primaryBtn}
                    onPress={handleUnirse}
                    disabled={cargando}
                  >
                    <Text style={styles.primaryBtnText}>
                      {cargando ? "Uniendo..." : "Unirse"}
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </>
          ) : (
            <View style={styles.exitoContainer}>
              <Ionicons name="checkmark-circle" size={48} color="#4CAF50" />
              <Text style={styles.exitoTitulo}>¡Grupo creado!</Text>
              <Text style={styles.exitoSubtitulo}>
                Comparte este código para que otros se unan:
              </Text>
              <TouchableOpacity style={styles.codigoBox} onPress={copiarCodigo}>
                <Text style={styles.codigoTexto}>{codigoGenerado}</Text>
                <Ionicons name="copy-outline" size={20} color="#E60023" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryBtn} onPress={resetYCerrar}>
                <Text style={styles.primaryBtnText}>Listo</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}
