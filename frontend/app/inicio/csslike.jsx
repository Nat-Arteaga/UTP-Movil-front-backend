import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050505",
    padding: 20,
  },
  backBtn: {
    marginBottom: 30,
  },
  counterContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  label: {
    color: "#888",
    fontSize: 18,
    marginBottom: 10,
  },
  count: {
    color: "white",
    fontSize: 64,
    fontWeight: "900",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 40,
  },
  btn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
  },
  activeUp: {
    backgroundColor: "#E60023",
  },
  activeDown: {
    backgroundColor: "#E60023",
  },
});
export default styles;
