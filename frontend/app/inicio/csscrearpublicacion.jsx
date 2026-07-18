import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050505",
    paddingTop: 40, // Espacio para la barra de estado
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  title: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  publishBtn: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  mainPublishBtn: {
    backgroundColor: "#E60023",
    marginHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  mainPublishText: {
    color: "white",
    fontSize: 18,
    fontWeight: "900",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "white",
    fontWeight: "bold",
  },
  username: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 12,
  },
  textArea: {
    backgroundColor: "#111",
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 15,
    color: "white",
    fontSize: 16,
    minHeight: 150,
    marginBottom: 20,
  },
  categorySelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  categoryButton: {
    borderWidth: 1,
    borderColor: "#444",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  categoryButtonActive: {
    backgroundColor: "#E60023",
    borderColor: "#E60023",
  },
  categoryButtonText: {
    color: "#AAA",
    fontSize: 12,
    fontWeight: "700",
  },
  categoryButtonTextActive: {
    color: "#FFF",
  },
  options: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
  },
  option: {
    alignItems: "center",
  },
  optionText: {
    color: "#888",
    fontSize: 12,
    marginTop: 5,
  },
});

export default styles;
