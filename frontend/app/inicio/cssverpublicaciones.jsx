import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050505",
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#0D0D0D",
    margin: 15,
    borderRadius: 18,
    padding: 18,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  user: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  time: {
    color: "#777",
  },
  text: {
    color: "white",
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 15,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 12,
  },
  emptyText: {
    color: "#888",
    textAlign: "center",
    marginTop: 36,
    fontSize: 15,
  },
});
export default styles;
