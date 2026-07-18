import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useBottomNav } from "../../hooks/useBottomNav";
import Chat from "../chat/chat";
import Notificaciones from "../notificacion/notificaciones";
import Perfil from "../perfil/perfil";
import styles from "./cssinicio";
import InicioFeed from "./InicioFeed";

const { width: screenWidth } = Dimensions.get("window");
const TAB_WIDTH = screenWidth / 4; // Ancho de cada tab
const LINE_WIDTH = 40; // Ancho de la línea roja

export default function Inicio() {
  const router = useRouter();
  const scrollViewRef = useRef(null);
  const [activeTab, setActiveTab] = useState(0);
  const { paddingBottom } = useBottomNav();
  const isScrollingRef = useRef(false);

  // Animación para la línea indicadora
  const slideAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animar la línea cuando cambia el tab
    Animated.spring(slideAnimation, {
      toValue: activeTab,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, [activeTab]);

  const goToTab = (index) => {
    setActiveTab(index);
    isScrollingRef.current = true;
    scrollViewRef.current?.scrollTo({ x: index * screenWidth, animated: true });
    setTimeout(() => {
      isScrollingRef.current = false;
    }, 350);
  };

  const handleScroll = (event) => {
    if (isScrollingRef.current) return;
    const xOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(xOffset / screenWidth);
    if (index !== activeTab && index >= 0 && index < 4) {
      setActiveTab(index);
    }
  };

  // Calcular posición X de la línea (centrada en cada tab)
  // Fórmula: (index * TAB_WIDTH) + (TAB_WIDTH / 2) - (LINE_WIDTH / 2)
  const linePosition = slideAnimation.interpolate({
    inputRange: [0, 1, 2, 3],
    outputRange: [
      TAB_WIDTH / 2 - LINE_WIDTH / 2, // Tab 0: Inicio
      TAB_WIDTH + TAB_WIDTH / 2 - LINE_WIDTH / 2, // Tab 1: Chat
      TAB_WIDTH * 2 + TAB_WIDTH / 2 - LINE_WIDTH / 2, // Tab 2: Notificaciones
      TAB_WIDTH * 3 + TAB_WIDTH / 2 - LINE_WIDTH / 2, // Tab 3: Perfil
    ],
  });

  return (
    <View style={{ flex: 1, backgroundColor: "#050505" }}>
      {/* Paging Horizontal Content */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        bounces={false}
        style={{ flex: 1 }}
      >
        <View style={{ width: screenWidth }}>
          <InicioFeed isTab={true} onGoToTab={goToTab} />
        </View>
        <View style={{ width: screenWidth }}>
          <Chat isTab={true} onGoToTab={goToTab} />
        </View>
        <View style={{ width: screenWidth }}>
          <Notificaciones isTab={true} onGoToTab={goToTab} />
        </View>
        <View style={{ width: screenWidth }}>
          <Perfil isTab={true} onGoToTab={goToTab} />
        </View>
      </ScrollView>

      {/* GLOBAL BOTTOM NAVIGATION BAR */}
      <View style={[styles.bottomNav, { paddingBottom }]}>
        {/* Línea animada que se desliza */}
        <Animated.View
          style={[
            styles.activeLine,
            {
              transform: [{ translateX: linePosition }],
            },
          ]}
        />

        {/* INICIO TAB */}
        <TouchableOpacity style={styles.navItem} onPress={() => goToTab(0)}>
          <Ionicons
            name={activeTab === 0 ? "home" : "home-outline"}
            size={26}
            color={activeTab === 0 ? "#E60023" : "#888"}
          />
          <Text
            style={[styles.navText, activeTab === 0 && styles.navTextActive]}
          >
            Inicio
          </Text>
        </TouchableOpacity>

        {/* CHAT TAB */}
        <TouchableOpacity style={styles.navItem} onPress={() => goToTab(1)}>
          <Ionicons
            name={activeTab === 1 ? "chatbubble" : "chatbubble-outline"}
            size={26}
            color={activeTab === 1 ? "#E60023" : "#888"}
          />
          <Text
            style={[styles.navText, activeTab === 1 && styles.navTextActive]}
          >
            Chat
          </Text>
        </TouchableOpacity>

        {/* NOTIFICACIONES TAB */}
        <TouchableOpacity style={styles.navItem} onPress={() => goToTab(2)}>
          <View style={{ position: "relative" }}>
            <Ionicons
              name={activeTab === 2 ? "notifications" : "notifications-outline"}
              size={26}
              color={activeTab === 2 ? "#E60023" : "#888"}
            />
            <View style={styles.smallBadge}>
              <Text style={styles.smallBadgeText}>3</Text>
            </View>
          </View>
          <Text
            style={[styles.navText, activeTab === 2 && styles.navTextActive]}
          >
            Notificaciones
          </Text>
        </TouchableOpacity>

        {/* PERFIL TAB */}
        <TouchableOpacity style={styles.navItem} onPress={() => goToTab(3)}>
          <Ionicons
            name={activeTab === 3 ? "person" : "person-outline"}
            size={26}
            color={activeTab === 3 ? "#E60023" : "#888"}
          />
          <Text
            style={[styles.navText, activeTab === 3 && styles.navTextActive]}
          >
            Perfil
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
