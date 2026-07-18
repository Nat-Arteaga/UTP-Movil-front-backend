import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useBottomNav } from "../../hooks/useBottomNav";
import styles from "./cssnotificaciones";

// Importar los 6 componentes
import NotificacionAmistad from "./Amistad";
import NotificacionGrupo from "./Grupo";
import NotificacionMencion from "./Mencion";
import NotificacionPublicacion from "./Publicacion";
import NotificacionRespuesta from "./Respuesta";
import NotificacionSAE from "./SAE";

export default function Notificaciones({ isTab = false, onGoToTab }) {
  const router = useRouter();
  const { paddingBottom } = useBottomNav();
  const [filtroActivo, setFiltroActivo] = useState("Todas");
  const [busqueda, setBusqueda] = useState("");

  // Datos de ejemplo organizados por tipo
  const todasNotificaciones = [
    {
      id: 1,
      tipo: "mencion",
      usuario: "@Ana",
      grupo: "Gamers UTP",
      detalle: "entra al grupo para ranked 👀",
      hora: "Hace 2 min",
      visto: false,
      avatar: "https://i.pravatar.cc/150?u=ana",
    },
    {
      id: 2,
      tipo: "publicacion",
      usuario: "@SofiDev",
      detalle: "Ya terminé mi proyecto de React Native 🔥",
      hora: "Hace 10 min",
      visto: false,
      avatar: "https://i.pravatar.cc/150?u=sofi",
    },
    {
      id: 3,
      tipo: "grupo",
      grupo: "Gamers UTP",
      texto: "tiene 7 mensajes nuevos",
      detalle: 'Último mensaje: "¿Quién para jugar hoy?"',
      hora: "Hace 15 min",
      visto: true,
      avatar: "https://i.pravatar.cc/150?u=gamers",
    },
    {
      id: 4,
      tipo: "sae",
      usuario: "SAE",
      texto: "revisó tu publicación",
      detalle: "Tu publicación recibió una advertencia por lenguaje ofensivo.",
      hora: "Hace 20 min",
      visto: true,
      avatar: "https://i.pravatar.cc/150?u=utp",
    },
    {
      id: 5,
      tipo: "reporte",
      usuario: "@TzNakroth",
      texto: "te denunció",
      detalle: "Reporte enviado al sistema SAE.",
      hora: "Hace 1 h",
      visto: true,
      avatar: "https://i.pravatar.cc/150?u=tz",
    },
    {
      id: 6,
      tipo: "amistad",
      usuario: "@MichiUTP",
      hora: "Hace 1 h",
      visto: false,
      avatar: "https://i.pravatar.cc/150?u=michi",
    },
    {
      id: 7,
      tipo: "respuesta",
      usuario: "@MichiUTP",
      texto: "respondió tu comentario",
      detalle: "Pasa el código bro 😎",
      hora: "Hace 1 h",
      visto: true,
      avatar: "https://i.pravatar.cc/150?u=michi2",
    },
    {
      id: 8,
      tipo: "publicacion",
      usuario: "@CodeMaster",
      detalle: "Nuevo tutorial de JavaScript disponible 🚀",
      hora: "Hace 2 h",
      visto: true,
      avatar: "https://i.pravatar.cc/150?u=code",
    },
    {
      id: 9,
      tipo: "grupo",
      grupo: "Ing. Sistemas",
      texto: "tiene 12 mensajes nuevos",
      detalle: 'Último mensaje: "Alguien tiene los archivos del proyecto?"',
      hora: "Hace 2 h",
      visto: true,
      avatar: "https://i.pravatar.cc/150?u=sistemas",
    },
  ];

  // Filtrar notificaciones según la pestaña activa y búsqueda
  const notificacionesFiltradas = todasNotificaciones.filter((notif) => {
    // Filtrar por categoría
    const coincideCategoria =
      filtroActivo === "Todas" ||
      (filtroActivo === "Menciones" &&
        (notif.tipo === "mencion" || notif.tipo === "reporte")) ||
      (filtroActivo === "Grupos" && notif.tipo === "grupo") ||
      (filtroActivo === "Respuestas" && notif.tipo === "respuesta") ||
      (filtroActivo === "SAE / Reportes" &&
        (notif.tipo === "sae" || notif.tipo === "reporte")) ||
      (filtroActivo === "Amigos" && notif.tipo === "amistad");

    // Filtrar por búsqueda
    const textoBusqueda = busqueda.toLowerCase();
    const coincideBusqueda =
      !busqueda ||
      notif.usuario?.toLowerCase().includes(textoBusqueda) ||
      notif.grupo?.toLowerCase().includes(textoBusqueda) ||
      notif.detalle?.toLowerCase().includes(textoBusqueda) ||
      notif.texto?.toLowerCase().includes(textoBusqueda);

    return coincideCategoria && coincideBusqueda;
  });

  const handleAceptarAmistad = (id) => {
    console.log("Aceptar amistad:", id);
  };

  const handleRechazarAmistad = (id) => {
    console.log("Rechazar amistad:", id);
  };

  const renderNotificacion = (notif) => {
    switch (notif.tipo) {
      case "mencion":
        return (
          <NotificacionMencion key={notif.id} data={notif} onPress={() => {}} />
        );
      case "publicacion":
        return (
          <NotificacionPublicacion
            key={notif.id}
            data={notif}
            onPress={() => {}}
          />
        );
      case "grupo":
        return (
          <NotificacionGrupo key={notif.id} data={notif} onPress={() => {}} />
        );
      case "sae":
        return (
          <NotificacionSAE key={notif.id} data={notif} onPress={() => {}} />
        );
      case "reporte":
        return (
          <NotificacionSAE key={notif.id} data={notif} onPress={() => {}} />
        );
      case "respuesta":
        return (
          <NotificacionRespuesta
            key={notif.id}
            data={notif}
            onPress={() => {}}
          />
        );
      case "amistad":
        return (
          <NotificacionAmistad
            key={notif.id}
            data={notif}
            onAceptar={() => handleAceptarAmistad(notif.id)}
            onRechazar={() => handleRechazarAmistad(notif.id)}
          />
        );
      default:
        return null;
    }
  };

  const filtros = [
    { nombre: "Todas", cantidad: todasNotificaciones.length },
    {
      nombre: "Menciones",
      cantidad: todasNotificaciones.filter(
        (n) => n.tipo === "mencion" || n.tipo === "reporte",
      ).length,
    },
    {
      nombre: "Grupos",
      cantidad: todasNotificaciones.filter((n) => n.tipo === "grupo").length,
    },
    {
      nombre: "Respuestas",
      cantidad: todasNotificaciones.filter((n) => n.tipo === "respuesta")
        .length,
    },
    {
      nombre: "SAE / Reportes",
      cantidad: todasNotificaciones.filter(
        (n) => n.tipo === "sae" || n.tipo === "reporte",
      ).length,
    },
    {
      nombre: "Amigos",
      cantidad: todasNotificaciones.filter((n) => n.tipo === "amistad").length,
    },
  ];

  const containerPaddingBottom = isTab ? 0 : paddingBottom;

  return (
    <SafeAreaView style={[styles.container, { paddingBottom: containerPaddingBottom }]}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            if (isTab && onGoToTab) {
              onGoToTab(0);
            } else {
              router.push("/inicio/inicio");
            }
          }}
          style={styles.logoContainer}
        >
          <Text style={styles.logoRed}>UTP+</Text>
          <Text style={styles.logoWhite}>Movil</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.marcarLeidas}>Marcar todas como leídas</Text>
        </TouchableOpacity>
      </View>

      {/* BARRA DE BÚSQUEDA */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#8A8A8A" />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por @usuario, grupo o texto..."
          placeholderTextColor="#8A8A8A"
          value={busqueda}
          onChangeText={setBusqueda}
        />
        {busqueda.length > 0 && (
          <TouchableOpacity onPress={() => setBusqueda("")}>
            <Ionicons name="close-circle" size={20} color="#8A8A8A" />
          </TouchableOpacity>
        )}
      </View>

      {/* FILTROS */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtros}
      >
        {filtros.map((filtro) => (
          <TouchableOpacity
            key={filtro.nombre}
            style={[
              styles.filtro,
              filtroActivo === filtro.nombre && styles.filtroActivo,
            ]}
            onPress={() => setFiltroActivo(filtro.nombre)}
          >
            <Text
              style={[
                styles.filtroTexto,
                filtroActivo === filtro.nombre && styles.filtroTextoActivo,
              ]}
            >
              {filtro.nombre}
            </Text>
            <View
              style={[
                styles.filtroBadge,
                filtroActivo === filtro.nombre
                  ? styles.filtroBadgeActivo
                  : styles.filtroBadgeInactivo,
              ]}
            >
              <Text style={styles.filtroBadgeText}>{filtro.cantidad}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* LISTA DE NOTIFICACIONES */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {notificacionesFiltradas.map((notif) => renderNotificacion(notif))}

        {notificacionesFiltradas.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="notifications-off-outline" size={48} color="#333" />
            <Text style={styles.emptyText}>No hay notificaciones</Text>
          </View>
        )}
      </ScrollView>

      {/* BOTTOM NAV */}
      {!isTab && (
        <View style={[styles.bottomNav, { paddingBottom }]}>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.push("/inicio/inicio")}
          >
            <Ionicons name="home-outline" size={26} color="#888" />
            <Text style={styles.navText}>Inicio</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.push("/chat/chat")}
          >
            <Ionicons name="chatbubble-outline" size={26} color="#888" />
            <Text style={styles.navText}>Chat</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem}>
            <View style={{ position: "relative" }}>
              <Ionicons name="notifications" size={26} color="#E60023" />
              <View style={styles.smallBadge}>
                <Text style={styles.smallBadgeText}>3</Text>
              </View>
            </View>
            <Text style={[styles.navText, styles.navTextActive]}>
              Notificaciones
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => router.push("/perfil/perfil")}
          >
            <Ionicons name="person-outline" size={26} color="#888" />
            <Text style={styles.navText}>Perfil</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
