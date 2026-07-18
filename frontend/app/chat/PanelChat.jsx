import { Image, ScrollView, Text, View } from "react-native";
import styles from "./cssPanelChat";

export default function PanelChat({ chatSeleccionado, mensajes }) {
  if (!chatSeleccionado) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Selecciona un chat para empezar</Text>
      </View>
    );
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.messages}>
      <View style={styles.dayBox}>
        <Text style={styles.dayText}>Hoy</Text>
      </View>

      {/* Corrección: Arreglada la flecha de map () => */}
      {mensajes.map((msg) => (
        <View
          key={msg.id}
          style={[
            styles.messageRow,
            msg.mio ? styles.messageRight : styles.messageLeft,
          ]}
        >
          {/* Corrección: Arreglado el operador && */}
          {!msg.mio && (
            <Image
              source={{ uri: chatSeleccionado.avatar }}
              style={styles.messageAvatar}
            />
          )}
          <View
            style={[
              styles.bubble,
              msg.mio ? styles.myBubble : styles.otherBubble,
            ]}
          >
            <Text style={styles.messageText}>{msg.texto}</Text>
            {/* Corrección: Eliminados espacios en "✓✓ " */}
            <Text style={styles.messageTime}>
              {msg.hora} {msg.mio ? "✓✓" : " "}
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
