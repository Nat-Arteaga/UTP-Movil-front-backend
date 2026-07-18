import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#111",
    alignItems: "flex-start",
    backgroundColor: "rgba(236, 72, 153, 0.05)",
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
  bgMagenta: {
    backgroundColor: "#EC4899",
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
  hora: {
    color: "#555",
    fontSize: 12,
    marginTop: 6,
  },
  botones: {
    flexDirection: "row",
    gap: 8,
  },
  btnAceptar: {
    backgroundColor: "#10B981",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  btnRechazar: {
    backgroundColor: "#EF4444",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  puntoMagenta: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#EC4899",
    marginLeft: 8,
  },
});

export default styles;
