import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "./cssEstadoActual";

export default function EstadoActual({ estadoInicial = "", onGuardar }) {
  const [estado, setEstado] = useState(estadoInicial || "");
  const [modalVisible, setModalVisible] = useState(false);
  const [textoEditando, setTextoEditando] = useState("");

  // Sincronizar cuando el padre cambia el estado inicial
  useEffect(() => {
    if (estadoInicial) setEstado(estadoInicial);
  }, [estadoInicial]);

  const abrirEditor = () => {
    setTextoEditando(estado);
    setModalVisible(true);
  };

  const guardarEstado = async () => {
    const nuevoEstado = textoEditando.trim();
    setEstado(nuevoEstado);
    setModalVisible(false);

    // Guardar en AsyncStorage como respaldo local
    await AsyncStorage.setItem("custom_estado", nuevoEstado);

    // Notificar al padre para guardar en el backend
    if (onGuardar) {
      onGuardar(nuevoEstado);
    }
  };

  const textoMostrar = estado || "¿Cómo te encuentras hoy? ✏️";

  return (
    <>
      <View style={styles.container}>
        <Image
          source={require("../../assets/images/tech_bg.png")}
          style={styles.imagenFondo}
        />
        <View style={styles.contenido}>
          <View style={styles.encabezado}>
            <Text style={styles.titulo}>ESTADO ACTUAL</Text>
            <TouchableOpacity onPress={abrirEditor} style={styles.editBtn}>
              <Ionicons name="pencil-outline" size={16} color="#E60023" />
            </TouchableOpacity>
          </View>
          <Text style={styles.textoPrincipal} numberOfLines={2}>
            {textoMostrar}
          </Text>
          {!estado ? (
            <Text style={styles.descripcionVacia}>
              Toca el lápiz para escribir tu estado
            </Text>
          ) : null}
        </View>
      </View>

      {/* MODAL DE EDICIÓN */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitulo}>Editar estado actual</Text>
            <TextInput
              style={styles.modalInput}
              value={textoEditando}
              onChangeText={setTextoEditando}
              placeholder="Ej: Estudiando para exámenes 📚"
              placeholderTextColor="#555"
              multiline
              maxLength={120}
              autoFocus
            />
            <Text style={styles.contador}>{textoEditando.length}/120</Text>
            <View style={styles.modalBotones}>
              <TouchableOpacity
                style={styles.btnCancelar}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.btnCancelarText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnGuardar} onPress={guardarEstado}>
                <Text style={styles.btnGuardarText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
