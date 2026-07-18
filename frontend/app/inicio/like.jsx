import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import styles from "./csslike";

export default function Like() {
  const router = useRouter();
  const [likes, setLikes] = useState(128);
  const [userVote, setUserVote] = useState(null);

  const handleVote = (type) => {
    if (userVote === type) {
      setUserVote(null);
      if (type === "up") setLikes(likes - 1);
    } else {
      if (userVote === "up") setLikes(likes - 1);
      setUserVote(type);
      if (type === "up") setLikes(likes + 1);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={28} color="white" />
      </TouchableOpacity>

      <View style={styles.counterContainer}>
        <Text style={styles.label}>Puntos</Text>
        <Text style={styles.count}>{likes}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.btn, userVote === "up" && styles.activeUp]}
          onPress={() => handleVote("up")}
        >
          <Ionicons
            name="arrow-up"
            size={32}
            color={userVote === "up" ? "#E60023" : "white"}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, userVote === "down" && styles.activeDown]}
          onPress={() => handleVote("down")}
        >
          <Ionicons
            name="arrow-down"
            size={32}
            color={userVote === "down" ? "#E60023" : "white"}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
