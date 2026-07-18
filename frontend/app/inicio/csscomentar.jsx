import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050505",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 45,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  list: {
    flex: 1,
    padding: 20,
  },
  commentItem: {
    flexDirection: "row",
    marginBottom: 22,
  },
  avatarBtn: {
    marginRight: 12,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#2A2A2A",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333",
  },
  avatarText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
  },
  user: {
    color: "white",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 4,
  },
  text: {
    color: "#E5E5E5",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 5,
  },
  time: {
    color: "#666",
    fontSize: 12,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingTop: 12,
    paddingBottom: 35,
    borderTopWidth: 1,
    borderTopColor: "#222",
    backgroundColor: "#0A0A0A",
  },
  input: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: "white",
    fontSize: 14,
    marginRight: 10,
  },
});

export default styles;
