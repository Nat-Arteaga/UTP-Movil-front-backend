import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBottomNav } from "../../hooks/useBottomNav";
import { useChat } from "../../hooks/useChat";
import GrupoModal from "./GrupoModal";
import styles from "./csschat";

const InitialAvatar = ({ nombre, sizeStyle, textStyle }) => (
  <View style={[styles.initialAvatarContainer, sizeStyle]}>
    <Text style={[styles.initialAvatarText, textStyle]}>
      {nombre ? nombre.charAt(0).toUpperCase() : ""}
    </Text>
  </View>
);

export default function Chat({ isTab = false, onGoToTab }) {
  const router = useRouter();
  const scrollRef = useRef(null);
  const { paddingBottom } = useBottomNav();

  const {
    contactos,
    chatSeleccionado,
    setChatSeleccionado,
    mensajesActuales,
    enviarMensaje,
    emitirEscribiendo,
    conectado,
    quienEscribe,
    reportarMensaje,
    eliminarMensaje,
    reaccionarMensaje,
    crearChatPrivado, // ← nueva
  } = useChat();

  const [textoInput, setTextoInput] = useState("");
  const [mostrarChat, setMostrarChat] = useState(false);
  const [msgMenuAbierto, setMsgMenuAbierto] = useState(null);
  const [modalGrupoVisible, setModalGrupoVisible] = useState(false);
  const [busquedaActiva, setBusquedaActiva] = useState(false);
  const [textoBusqueda, setTextoBusqueda] = useState("");

  const amigos = contactos
    .filter((item) => item.tipo === "amigo")
    .filter((item) => item.nombre.toLowerCase().includes(textoBusqueda.toLowerCase()));
  const grupos = contactos
    .filter((item) => item.tipo === "grupo")
    .filter((item) => item.nombre.toLowerCase().includes(textoBusqueda.toLowerCase()));

  const navPaddingBottom = isTab ? 0 : paddingBottom;

  const handleSeleccionarContacto = (item) => {
    setChatSeleccionado(item);
    setMostrarChat(true);
  };

  const handleVolver = () => {
    setMostrarChat(false);
    setMsgMenuAbierto(null);
  };

  const handleLogoPress = () => {
    if (isTab && onGoToTab) {
      onGoToTab(0);
    } else {
      router.push("/inicio/inicio");
    }
  };

  const handleIniciarChatPrivado = (contacto) => {
  crearChatPrivado(contacto.id, contacto.nombre);
  setMostrarChat(true);
  };

  const handleEnviar = () => {
    if (!textoInput.trim()) return;
    enviarMensaje(textoInput.trim());
    setTextoInput("");
    emitirEscribiendo(false);
  };

  const handleReportar = (msg) => {
    Alert.alert(
      "Reportar mensaje",
      `¿Quieres reportar este mensaje?\n\n"${msg.texto}"`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Reportar",
          style: "destructive",
          onPress: () => {
            reportarMensaje(msg.id);
            setMsgMenuAbierto(null);
            Alert.alert("✅ Reportado", "Tu reporte fue enviado.");
          },
        },
      ]
    );
  };

  const handleEliminar = (msg) => {
    Alert.alert(
      "Eliminar mensaje",
      "¿Para quién quieres eliminar este mensaje?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar para mí",
          onPress: () => {
            eliminarMensaje(msg.id, false);
            setMsgMenuAbierto(null);
          },
        },
        {
          text: "Eliminar para todos",
          style: "destructive",
          onPress: () => {
            eliminarMensaje(msg.id, true);
            setMsgMenuAbierto(null);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { paddingBottom: navPaddingBottom }]} edges={["top"]}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleLogoPress}>
          <Text style={styles.logo}>
            UTP+ <Text style={styles.logoBlanco}>Movil</Text>
          </Text>
        </TouchableOpacity>
        <View style={styles.headerIcons}>
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: conectado ? "#30D158" : "#555",
              marginRight: 4,
            }}
          />
          <TouchableOpacity onPress={() => setBusquedaActiva((prev) => !prev)}>
            <Ionicons name="search-outline" size={28} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setModalGrupoVisible(true)}>
            <Ionicons name="add-circle-outline" size={29} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* VISTA: Lista de contactos */}
      {!mostrarChat && (
        <ScrollView style={{ flex: 1, paddingHorizontal: 8 }}>
          {busquedaActiva && (
            <TextInput
              style={{
                backgroundColor: "#1A1A1A",
                borderRadius: 10,
                paddingHorizontal: 14,
                paddingVertical: 10,
                color: "#FFF",
                marginBottom: 12,
                marginHorizontal: 8,
                marginTop: 8,
                borderWidth: 1,
                borderColor: "#2A2A2A",
              }}
              placeholder="Buscar amigo o grupo..."
              placeholderTextColor="#888"
              value={textoBusqueda}
              onChangeText={setTextoBusqueda}
              autoFocus
            />
          )}
          <Text style={[styles.sectionTitle, { marginLeft: 8, marginTop: 10, marginBottom: 10 }]}>AMIGOS</Text>
          {amigos.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.contactItem, { paddingHorizontal: 12, marginBottom: 4 }]}
              onPress={() => handleSeleccionarContacto(item)}
            >
              <View style={{ position: "relative", marginRight: 14 }}>
                <InitialAvatar nombre={item.nombre} />
                <View style={[styles.statusDot, item.estado === "Ausente" && styles.statusAway]} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.contactName}>{item.nombre}</Text>
                <Text style={styles.contactStatus}>• {item.estado}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#555" />
            </TouchableOpacity>
          ))}

          <Text style={[styles.sectionTitle, { marginLeft: 8, marginTop: 20, marginBottom: 10 }]}>GRUPOS</Text>
          {grupos.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.contactItem, { paddingHorizontal: 12, marginBottom: 4 }]}
              onPress={() => handleSeleccionarContacto(item)}
            >
              <View style={{ marginRight: 14 }}>
                <InitialAvatar nombre={item.nombre} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.contactName}>{item.nombre}</Text>
                <Text style={styles.contactStatus}>Servidor UTP+</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#555" />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* VISTA: Panel del chat */}
      {mostrarChat && chatSeleccionado && (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
          {/* Header del chat */}
          <View style={styles.chatHeader}>
            <TouchableOpacity onPress={handleVolver} style={{ marginRight: 8 }}>
              <Ionicons name="chevron-back-outline" size={30} color="white" />
            </TouchableOpacity>
            <InitialAvatar
              nombre={chatSeleccionado.nombre}
              sizeStyle={styles.initialAvatarHeader}
              textStyle={styles.initialAvatarHeaderText}
            />
            <View style={styles.chatHeaderInfo}>
              <Text style={styles.chatName}>{chatSeleccionado.nombre}</Text>
              <Text style={styles.chatStatus}>
                {chatSeleccionado.tipo === "grupo"
                  ? "Chat grupal"
                  : chatSeleccionado.estado}
              </Text>
            </View>
            <Ionicons name="information-circle-outline" size={30} color="white" />
          </View>

          {/* Mensajes */}
          <ScrollView
            ref={scrollRef}
            style={styles.messages}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
            onLayout={() => scrollRef.current?.scrollToEnd({ animated: true })}
          >
            <View style={styles.dayBox}>
              <Text style={styles.dayText}>Hoy</Text>
            </View>

            {mensajesActuales.map((msg) => (
              <View
                key={msg.id}
                style={[styles.messageRow, msg.mio ? styles.messageRight : styles.messageLeft]}
              >
                {!msg.mio && (
                  <InitialAvatar
                    nombre={msg.remitente || chatSeleccionado.nombre}
                    sizeStyle={styles.initialAvatarMessage}
                    textStyle={styles.initialAvatarMessageText}
                  />
                )}

                <View style={{ maxWidth: "100%" }}>
                  {/* Burbuja del mensaje — long press abre el menú */}
                  <TouchableOpacity
                    onLongPress={() => setMsgMenuAbierto(msg.id === msgMenuAbierto ? null : msg.id)}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.bubble, msg.mio ? styles.myBubble : styles.otherBubble,
                      msg.eliminado && { opacity: 0.5 }
                    ]}>
                      <Text style={[styles.messageText, msg.eliminado && { fontStyle: "italic" }]}>
                        {msg.texto}
                      </Text>
                      <Text style={styles.messageTime}>
                        {msg.hora} {msg.mio ? "✓✓" : ""}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  {/* Reacciones */}
                  {msg.reacciones && Object.keys(msg.reacciones).length > 0 && (
                    <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 4, gap: 4 }}>
                      {Object.entries(msg.reacciones).map(([emoji, count]) => (
                        <View key={emoji} style={{
                          flexDirection: "row",
                          alignItems: "center",
                          backgroundColor: "#1a1a1a",
                          borderRadius: 12,
                          paddingHorizontal: 6,
                          paddingVertical: 2,
                        }}>
                          <Text style={{ fontSize: 14, lineHeight: 20 }}>{emoji}</Text>
                          <Text style={{ color: "#fff", fontSize: 11, marginLeft: 3 }}>{count}</Text>
                        </View>
                      ))}
                    </View>
                  )}

                  {/* Menú — aparece al hacer long press */}
                  {msgMenuAbierto === msg.id && !msg.eliminado && (
                    <View style={{ alignSelf: msg.mio ? "flex-end" : "flex-start" }}>
                      {/* Emojis de reacción */}
                      <View style={{
                        flexDirection: "row",
                        backgroundColor: "#1a1a1a",
                        borderRadius: 20,
                        paddingHorizontal: 8,
                        paddingVertical: 12,
                        marginTop: 4,
                        gap: 7,
                        width: 260,
                        justifyContent: "space-between",
                        overflow: "visible",
                      }}>
                        {["❤️", "😂", "😮", "😢", "👍", "🔥"].map((emoji) => (
                          <TouchableOpacity
                            key={emoji}
                            onPress={() => {
                              reaccionarMensaje(msg.id, emoji);
                              setMsgMenuAbierto(null);
                            }}
                          >
                            <Text style={{ fontSize: 30, lineHeight: 32 }}>{emoji}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>

                      {/* Reportar */}
                      <TouchableOpacity
                        onPress={() => handleReportar(msg)}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          backgroundColor: "#1a1a1a",
                          borderRadius: 8,
                          paddingHorizontal: 10,
                          paddingVertical: 6,
                          marginTop: 4,
                          borderWidth: 1,
                          borderColor: "#E60023",
                        }}
                      >
                        <Ionicons name="flag-outline" size={14} color="#E60023" />
                        <Text style={{ color: "#E60023", fontSize: 12, marginLeft: 5 }}>
                          Reportar mensaje
                        </Text>
                      </TouchableOpacity>

                      {/* Iniciar chat privado — solo si no es tuyo */}
                      {!msg.mio && (
                        <TouchableOpacity
                          onPress={() => {
                            setMsgMenuAbierto(null);
                            handleIniciarChatPrivado({
                              id: msg.remitenteId,
                              nombre: msg.remitente,
                              tipo: "amigo",
                              estado: "En línea",
                            });
                          }}
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            backgroundColor: "#1a1a1a",
                            borderRadius: 8,
                            paddingHorizontal: 10,
                            paddingVertical: 6,
                            marginTop: 4,
                            borderWidth: 1,
                            borderColor: "#30D158",
                          }}
                        >
                          <Ionicons name="person-add-outline" size={14} color="#30D158" />
                          <Text style={{ color: "#30D158", fontSize: 12, marginLeft: 5 }}>
                            Iniciar chat privado
                          </Text>
                        </TouchableOpacity>
                      )}

                      {/* Eliminar — solo si es tuyo */}
                      {msg.mio && (
                        <TouchableOpacity
                          onPress={() => handleEliminar(msg)}
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            backgroundColor: "#1a1a1a",
                            borderRadius: 8,
                            paddingHorizontal: 10,
                            paddingVertical: 6,
                            marginTop: 4,
                            borderWidth: 1,
                            borderColor: "#555",
                          }}
                        >
                          <Ionicons name="trash-outline" size={14} color="#aaa" />
                          <Text style={{ color: "#aaa", fontSize: 12, marginLeft: 5 }}>
                            Eliminar mensaje
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
                </View>
              </View>
            ))}

            {quienEscribe && (
              <View style={[styles.messageRow, styles.messageLeft]}>
                <View style={[styles.bubble, styles.otherBubble]}>
                  <Text style={[styles.messageText, { opacity: 0.6 }]}>
                    {quienEscribe} está escribiendo...
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Input */}
          <View style={styles.inputArea}>
            <TouchableOpacity style={styles.circleButton}>
              <Ionicons name="add-outline" size={26} color="#E60023" />
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Escribe un mensaje..."
              placeholderTextColor="#8A8A8A"
              value={textoInput}
              onChangeText={(t) => {
                setTextoInput(t);
                emitirEscribiendo(t.length > 0);
              }}
              onSubmitEditing={handleEnviar}
              blurOnSubmit={false}
            />
            <Ionicons name="happy-outline" size={26} color="#B8B8B8" />
            <TouchableOpacity style={{ marginLeft: 10 }} onPress={handleEnviar}>
              <Ionicons name="send" size={24} color="#E60023" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}

      {/* BOTTOM NAV */}
      {!isTab && (
        <View style={[styles.bottomNav, { paddingBottom: navPaddingBottom }]}>
          <TouchableOpacity style={styles.navItem} onPress={() => router.push("/inicio/inicio")}>
            <Ionicons name="home-outline" size={26} color="#888" />
            <Text style={styles.navText}>Inicio</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => router.push("/chat/chat")}>
            <Ionicons name="chatbubble" size={26} color="#E60023" />
            <Text style={[styles.navText, styles.navTextActive]}>Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => router.push("/notificacion/notificaciones")}>
            <View style={{ position: "relative" }}>
              <Ionicons name="notifications-outline" size={26} color="#888" />
              <View style={styles.smallBadge}>
                <Text style={styles.smallBadgeText}>3</Text>
              </View>
            </View>
            <Text style={styles.navText}>Notificaciones</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => router.push("/perfil/perfil")}>
            <Ionicons name="person-outline" size={26} color="#888" />
            <Text style={styles.navText}>Perfil</Text>
          </TouchableOpacity>
        </View>
      )}

      <GrupoModal
        visible={modalGrupoVisible}
        onClose={() => setModalGrupoVisible(false)}
      />
    </SafeAreaView>
  );
}