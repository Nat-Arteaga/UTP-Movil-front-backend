import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#0D0D0D",
    borderRadius: 14,
    padding: 15,
    marginHorizontal: 20,
    marginTop: 20,
  },
  tarjeta: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 10,
  },
  borderRight: {
    borderRightWidth: 1,
    borderRightColor: "#222",
  },
  iconoContainer: {
    marginBottom: 8,
  },
  titulo: {
    color: "#8A8A8A",
    fontSize: 11,
    fontWeight: "600",
    marginBottom: 5,
    textAlign: "center",
  },
  valor: {
    color: "#FFFFFF",
    fontSize: 12,
    textAlign: "center",
    lineHeight: 16,
  },
});

export default styles;
