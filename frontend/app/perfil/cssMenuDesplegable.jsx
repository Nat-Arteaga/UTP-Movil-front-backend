import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 60,
    right: 20,
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    paddingVertical: 8,
    width: 200,
    zIndex: 1000,
    borderWidth: 1,
    borderColor: "#333",
  },
  opcion: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  opcionTexto: {
    color: "#8A8A8A",
    fontSize: 15,
    marginLeft: 12,
  },
  cerrarSesion: {
    color: "#E60023",
  },
  divider: {
    height: 1,
    backgroundColor: "#333",
    marginVertical: 5,
  },
});

export default styles;
