import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  inputArea: {
    height: 70,
    borderTopWidth: 1,
    borderTopColor: "#1F1F1F",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    gap: 10,
    backgroundColor: "#0D0D0D",
  },
  circleButton: {
    width: 36,
    height: 36,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#E60023",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "#151515",
    borderRadius: 20,
    color: "#FFFFFF",
    paddingHorizontal: 15,
    height: 40,
    fontSize: 14,
    maxHeight: 100,
  },
});

export default styles;
