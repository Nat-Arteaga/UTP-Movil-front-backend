import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "#1A1A1A",
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  closeBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 1,
  },
  tabs: {
    flexDirection: "row",
    marginBottom: 18,
    marginTop: 6,
    backgroundColor: "#111",
    borderRadius: 12,
    padding: 4,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
  },
  tabBtnActivo: {
    backgroundColor: "#E60023",
  },
  tabText: {
    color: "#999",
    fontSize: 13,
    fontWeight: "700",
  },
  tabTextActivo: {
    color: "#FFFFFF",
  },
  label: {
    color: "#CCC",
    fontSize: 13,
    marginBottom: 6,
    marginTop: 10,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#111",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#FFF",
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  codigoInput: {
    letterSpacing: 4,
    fontWeight: "800",
    textAlign: "center",
    fontSize: 18,
  },
  primaryBtn: {
    backgroundColor: "#E60023",
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: "center",
    marginTop: 20,
  },
  primaryBtnText: {
    color: "#FFF",
    fontWeight: "800",
    fontSize: 15,
  },
  exitoContainer: {
    alignItems: "center",
    paddingVertical: 10,
  },
  exitoTitulo: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "800",
    marginTop: 10,
  },
  exitoSubtitulo: {
    color: "#AAA",
    fontSize: 13,
    textAlign: "center",
    marginTop: 6,
    marginBottom: 16,
  },
  codigoBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#111",
    borderWidth: 1,
    borderColor: "#E60023",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    width: "100%",
  },
  codigoTexto: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: 4,
  },
});

export default styles;