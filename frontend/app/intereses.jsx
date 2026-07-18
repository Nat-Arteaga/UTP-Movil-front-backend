import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useBottomNav } from "../hooks/useBottomNav";
import styles from "./cssintereses";

export default function Intereses() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { paddingBottom } = useBottomNav();
  const [selected, setSelected] = useState([]);

  const intereses = [
    "🎮 Videojuegos",
    "💻 Tecnología",
    "😂 Memes",
    "🎵 Música",
    "🎬 Entretenimiento",
    "🏋️ Gym",
    "📚 Estudio",
    "🎨 Arte",
    "📷 Fotografía",
    "🍕 Comida",
    "✈️ Viajes",
    "🐶 Mascotas",
    "⚽ Deportes",
    "📺 Series",
    "🎧 Podcasts",
    "📖 Lectura",
    "💼 Emprendimiento",
    "🤖 IA / Programación",
    "🎲 Juegos de Mesa",
    "🌱 Vida Saludable",
  ];

  const toggle = (item) => {
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item],
    );
  };

  return (
    <SafeAreaView style={[styles.container, { paddingBottom: Math.max(paddingBottom, 25) }]}>
      <Text style={styles.title}>Selecciona tus intereses</Text>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <View style={styles.grid}>
          {intereses.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={[
                styles.card,
                selected.includes(item) && styles.cardSelected,
              ]}
              onPress={() => toggle(item)}
            >
              <Text style={styles.cardText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <TouchableOpacity
        style={styles.nextButton}
        onPress={() =>
          router.push({
          pathname: "/carrera",
          params: {
            ...params,
            genero: params.genero,
            intereses: selected.join(", "),
          },
        })
        }
      >
        <Text style={styles.nextText}>Continuar</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
