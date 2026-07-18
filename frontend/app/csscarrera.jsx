import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050505",
    padding: 20,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "900",
    marginBottom: 20,
  },
  subtitle: {
    color: "#B8B8B8",
    fontSize: 16,
    marginTop: 25,
    marginBottom: 15,
    fontWeight: "600",
  },
  selectorBox: {
    maxHeight: 220,
    borderWidth: 1,
    borderColor: "#222",
    borderRadius: 16,
    backgroundColor: "#0A0A0A",
  },
  option: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#1A1A1A",
  },
  optionSelected: {
    backgroundColor: "rgba(230, 0, 35, 0.15)",
    borderColor: "#E60023",
  },
  optionText: {
    color: "#888",
    fontSize: 15,
    fontWeight: "500",
  },
  optionTextSelected: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  gridCiclos: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 10,
  },
  cicloBtn: {
    width: "18%",
    paddingVertical: 12,
    backgroundColor: "#111",
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333",
  },
  cicloBtnSelected: {
    backgroundColor: "#E60023",
    borderColor: "#E60023",
  },
  cicloText: {
    color: "#888",
    fontSize: 16,
    fontWeight: "700",
  },
  cicloTextSelected: {
    color: "#FFFFFF",
  },
  continueBtn: {
    backgroundColor: "#E60023",
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 30,
  },
  disabledBtn: {
    backgroundColor: "#333",
    opacity: 0.5,
  },
  continueText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },
});

export default styles;
