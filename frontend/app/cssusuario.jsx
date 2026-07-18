import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050505",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  contentBox: {
    backgroundColor: "#0D0D0D",
    borderRadius: 24,
    padding: 28,
    borderWidth: 1,
    borderColor: "#1A1A1A",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    color: "#888",
    fontSize: 15,
    textAlign: "center",
    marginBottom: 35,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111",
    borderRadius: 16,
    paddingHorizontal: 18,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#333",
  },
  atSymbol: {
    color: "#E60023",
    fontSize: 22,
    fontWeight: "bold",
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 18,
    paddingVertical: 16,
  },
  button: {
    backgroundColor: "#E60023",
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: "center",
  },
  disabledBtn: {
    backgroundColor: "#2A2A2A",
    opacity: 0.6,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },
});

export default styles;
