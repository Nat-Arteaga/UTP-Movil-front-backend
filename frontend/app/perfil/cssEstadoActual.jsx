import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0D0D0D",
    borderRadius: 14,
    marginHorizontal: 20,
    marginTop: 20,
    overflow: "hidden",
  },
  imagenFondo: {
    width: "100%",
    height: 140,
    opacity: 0.25,
  },
  contenido: {
    padding: 18,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  encabezado: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  titulo: {
    color: "#E60023",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
  },
  editBtn: {
    backgroundColor: "rgba(230,0,35,0.15)",
    borderRadius: 20,
    padding: 6,
  },
  textoPrincipal: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 6,
    lineHeight: 24,
  },
  descripcionVacia: {
    color: "#555",
    fontSize: 13,
    fontStyle: "italic",
  },

  // MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalCard: {
    backgroundColor: "#111",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    borderWidth: 1,
    borderColor: "#222",
  },
  modalTitulo: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  modalInput: {
    backgroundColor: "#1A1A1A",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 12,
    color: "#FFFFFF",
    padding: 14,
    fontSize: 15,
    minHeight: 90,
    textAlignVertical: "top",
    marginBottom: 6,
  },
  contador: {
    color: "#555",
    fontSize: 12,
    textAlign: "right",
    marginBottom: 16,
  },
  modalBotones: {
    flexDirection: "row",
    gap: 12,
  },
  btnCancelar: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#1A1A1A",
    borderWidth: 1,
    borderColor: "#333",
    alignItems: "center",
  },
  btnCancelarText: {
    color: "#8A8A8A",
    fontSize: 15,
    fontWeight: "600",
  },
  btnGuardar: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "#E60023",
    alignItems: "center",
  },
  btnGuardarText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});

export default styles;
