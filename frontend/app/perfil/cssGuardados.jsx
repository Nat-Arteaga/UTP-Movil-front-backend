import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050505",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#1f1f1f",
    backgroundColor: "#050505",
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#050505",
  },
  flatListContent: {
    padding: 20,
  },
  flatListEmpty: {
    flexGrow: 1,
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#0D0D0D",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#1F1F1F",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  cardAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E60023",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  cardAvatarText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  cardInfo: {
    flex: 1,
  },
  cardAutor: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  cardFecha: {
    color: "#555",
    fontSize: 12,
  },
  cardContenido: {
    color: "#B8B8B8",
    fontSize: 14,
    lineHeight: 20,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
    paddingVertical: 40,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#222",
  },
  emptyTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  emptySubtitle: {
    color: "#666",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 30,
  },
  explorarBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E60023",
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  explorarBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default styles;
