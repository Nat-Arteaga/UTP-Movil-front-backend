import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050505",
    padding: 20,
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  option: {
    backgroundColor: "#111",
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
  },
  optionText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  closeBtn: {
    backgroundColor: "#333",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  closeText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default styles;
