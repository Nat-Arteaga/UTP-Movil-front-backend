import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#111",
    alignItems: "flex-start",
    backgroundColor: "rgba(245, 158, 11, 0.05)",
  },
  avatarContainer: {
    position: "relative",
    marginRight: 12,
    marginTop: 2,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  initialAvatarText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  iconoBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#050505",
  },
  bgNaranja: {
    backgroundColor: "#F59E0B",
  },
  textoContainer: {
    flex: 1,
  },
  textoPrincipal: {
    color: "#B8B8B8",
    fontSize: 14,
    lineHeight: 20,
  },
  usuarioNegrita: {
    color: "white",
    fontWeight: "bold",
  },
  textoDetalle: {
    color: "#8A8A8A",
    fontSize: 13,
    marginTop: 4,
  },
  hora: {
    color: "#555",
    fontSize: 12,
    marginTop: 6,
  },
  puntoNaranja: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#F59E0B",
    marginTop: 8,
  },
});

export default styles;
