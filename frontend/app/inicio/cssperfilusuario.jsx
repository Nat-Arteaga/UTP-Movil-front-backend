import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050505",
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  avatarText: {
    color: "white",
    fontSize: 48,
    fontWeight: "bold",
  },
  name: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  info: {
    color: "#888",
    fontSize: 16,
    marginBottom: 30,
    textAlign: "center",
  },
  postCount: {
    color: "#BBB",
    fontSize: 14,
    marginTop: -18,
    marginBottom: 24,
  },
  btn: {
    backgroundColor: "#E60023",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginBottom: 15,
    minWidth: 200,
    alignItems: "center",
  },
  btnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  closeBtn: {
    backgroundColor: "#333",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 12,
    minWidth: 200,
    alignItems: "center",
  },
});
export default styles;
