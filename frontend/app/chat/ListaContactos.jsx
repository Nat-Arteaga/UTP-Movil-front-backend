import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import GrupoModal from "./GrupoModal";
import styles from "./cssListaContactos";
const InitialAvatar = ({ nombre }) => (
  <View style={styles.initialAvatarContainer}>
    <Text style={styles.initialAvatarText}>
      {nombre ? nombre.charAt(0).toUpperCase() : ""}
    </Text>
  </View>
);

export default function ListaContactos({
  contactos,
  chatSeleccionado,
  onSelectChat,
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const amigos = contactos.filter((item) => item.tipo === "amigo");
  const grupos = contactos.filter((item) => item.tipo === "grupo");

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.sectionHeader}>
        <Ionicons name="people-outline" size={18} color="#E60023" />
        <Text style={styles.sectionTitle}>AMIGOS</Text>
      </View>

      {amigos.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={[
            styles.contactItem,
            chatSeleccionado?.id === item.id && styles.contactActive,
          ]}
          onPress={() => onSelectChat(item)}
        >
          <View style={styles.avatarContainer}>
            <InitialAvatar nombre={item.nombre} />
            <View
              style={[
                styles.statusDot,
                item.estado === "Ausente" && styles.statusAway,
              ]}
            />
          </View>
          <View style={styles.contactInfo}>
            <Text style={styles.contactName}>{item.nombre}</Text>
            <Text style={styles.contactStatus}>• {item.estado}</Text>
          </View>
        </TouchableOpacity>
      ))}

      <View style={[styles.sectionHeader, styles.marginTop, { justifyContent: "space-between" }]}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons name="people-outline" size={18} color="#E60023" />
          <Text style={styles.sectionTitle}>SERVIDORES UTP+</Text>
        </View>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="add-circle-outline" size={22} color="#E60023" />
        </TouchableOpacity>
      </View>

      {grupos.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={[
            styles.contactItem,
            chatSeleccionado?.id === item.id && styles.contactActive,
          ]}
          onPress={() => onSelectChat(item)}
        >
          <InitialAvatar nombre={item.nombre} />
          <View style={styles.contactInfo}>
            <Text style={styles.contactName}>{item.nombre}</Text>
            <Text style={styles.contactStatus}>Servidor UTP+</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.mensajesNoLeidos || 0}</Text>
          </View>
        </TouchableOpacity>
      ))}

      <GrupoModal visible={modalVisible} onClose={() => setModalVisible(false)} />
    </ScrollView>
  );
}