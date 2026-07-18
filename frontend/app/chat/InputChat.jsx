import { Ionicons } from "@expo/vector-icons";
import { TextInput, TouchableOpacity, View } from "react-native";
import styles from "./cssInputChat";

export default function InputChat({
  texto,
  onChangeText,
  onEnviar,
  onAdjuntar,
  onSticker,
  onAudio,
}) {
  return (
    <View style={styles.inputArea}>
      <TouchableOpacity style={styles.circleButton} onPress={onAdjuntar}>
        <Ionicons name="add-outline" size={26} color="#E60023" />
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Escribe un mensaje..."
        placeholderTextColor="#8A8A8A"
        value={texto}
        onChangeText={onChangeText}
        multiline
      />

      <TouchableOpacity onPress={onSticker}>
        <Ionicons name="happy-outline" size={26} color="#B8B8B8" />
      </TouchableOpacity>

      <TouchableOpacity onPress={onAudio}>
        <Ionicons name="mic-outline" size={27} color="#E60023" />
      </TouchableOpacity>
    </View>
  );
}
