import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050505",
  },

  // ── HEADER ──────────────────────────────────────────────────────
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#1f1f1f",
    backgroundColor: "#050505",
  },
  headerBtn: {
    minWidth: 70,
    paddingVertical: 4,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
    flex: 1,
  },
  cancelText: {
    color: "#8a8a8a",
    fontSize: 16,
    fontWeight: "600",
  },
  saveText: {
    color: "#e60023",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "right",
  },
  saveTextDisabled: {
    color: "#5a0010",
  },

  // ── SCROLL ──────────────────────────────────────────────────────
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // ── FOTO DE PERFIL ──────────────────────────────────────────────
  fotoSection: {
    alignItems: "center",
    paddingVertical: 28,
    borderBottomWidth: 1,
    borderBottomColor: "#111",
  },
  fotoWrapper: {
    position: "relative",
    marginBottom: 10,
  },
  fotoImg: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: "#E60023",
  },
  fotoPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#1A1A1A",
    borderWidth: 3,
    borderColor: "#E60023",
    justifyContent: "center",
    alignItems: "center",
  },
  fotoInicial: {
    color: "#FFFFFF",
    fontSize: 38,
    fontWeight: "bold",
  },
  fotoEditBadge: {
    position: "absolute",
    bottom: 2,
    right: 2,
    backgroundColor: "#E60023",
    borderRadius: 14,
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#050505",
  },
  fotoLabel: {
    color: "#E60023",
    fontSize: 13,
    fontWeight: "600",
  },

  // ── FORM ────────────────────────────────────────────────────────
  form: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  label: {
    color: "#999",
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 8,
    marginTop: 4,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  input: {
    backgroundColor: "#111",
    borderWidth: 1,
    borderColor: "#222",
    borderRadius: 12,
    color: "#FFFFFF",
    paddingHorizontal: 15,
    height: 50,
    fontSize: 15,
    marginBottom: 18,
  },
  inputMultiline: {
    height: 90,
    paddingTop: 13,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111",
    borderWidth: 1,
    borderColor: "#222",
    borderRadius: 12,
    marginBottom: 18,
    paddingHorizontal: 13,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  inputWithIcon: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 15,
    height: "100%",
  },
  hintText: {
    color: "#444",
    fontSize: 12,
    marginTop: 4,
    marginBottom: 20,
    paddingLeft: 4,
  },

  // ── SECCIÓN PRIVACIDAD ──────────────────────────────────────────
  separador: {
    height: 1,
    backgroundColor: "#1A1A1A",
    marginVertical: 8,
    marginBottom: 20,
  },
  seccionTitulo: {
    color: "#555",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginBottom: 16,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#111",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#222",
  },
  switchInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
  },
  switchTextos: {
    marginLeft: 12,
    flex: 1,
  },
  switchLabel: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 3,
  },
  switchDesc: {
    color: "#555",
    fontSize: 12,
    lineHeight: 16,
  },
});

export default styles;
