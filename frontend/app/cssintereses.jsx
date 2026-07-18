import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#050505", padding: 25 },
  title: {
    color: "white",
    fontSize: 30,
    fontWeight: "900",
    marginTop: 40,
    marginBottom: 30,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    backgroundColor: "#111",
    borderWidth: 1,
    borderColor: "#E60023",
    padding: 22,
    borderRadius: 16,
    marginBottom: 18,
    alignItems: "center",
  },
  cardSelected: { backgroundColor: "#E60023", borderColor: "#E60023" },
  cardText: { color: "white", fontWeight: "bold", fontSize: 16 },
  nextButton: {
    backgroundColor: "#E60023",
    padding: 18,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 20,
  },
  nextText: { color: "white", fontSize: 18, fontWeight: "bold" },
});
export default styles;
