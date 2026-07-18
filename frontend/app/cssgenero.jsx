import { StyleSheet } from "react-native";
const ColorGenero = {
  fondo: "#050505",
  rojo: "#E60023",
  blanco: "#FFFFFF",
  grisOscuro: "#1A1A1A",
  grisTexto: "#B8B8B8",
  grisInput: "#2A2A2A",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ColorGenero.fondo,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  title: {
    color: ColorGenero.blanco,
    fontSize: 28,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    color: ColorGenero.grisTexto,
    fontSize: 16,
    textAlign: "center",
    marginBottom: 40,
  },
  button: {
    backgroundColor: ColorGenero.grisOscuro,
    paddingVertical: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: ColorGenero.grisInput,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonSelected: {
    backgroundColor: ColorGenero.rojo,
    borderColor: ColorGenero.rojo,
  },
  buttonText: {
    color: ColorGenero.grisTexto,
    fontSize: 18,
    fontWeight: "700",
  },
  buttonTextSelected: {
    color: ColorGenero.blanco,
  },
});
export default styles;
