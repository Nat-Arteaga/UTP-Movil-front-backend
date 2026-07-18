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
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  headerTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111",
    borderRadius: 12,
    paddingHorizontal: 15,
    marginHorizontal: 20,
    marginVertical: 20,
    height: 50,
  },
  searchInput: {
    flex: 1,
    color: "white",
    fontSize: 16,
    marginLeft: 10,
  },
  results: {
    flex: 1,
    paddingHorizontal: 20,
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0D0D0D",
    borderRadius: 14,
    padding: 15,
    marginBottom: 12,
  },
  userAvatar: {
    width: 55,
    height: 55,
    borderRadius: 27,
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  username: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  userReal: {
    color: "#888",
    fontSize: 14,
    marginTop: 2,
  },
  userCarrera: {
    color: "#666",
    fontSize: 13,
    marginTop: 3,
  },
  addButton: {
    backgroundColor: "#E60023",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    color: "#666",
    fontSize: 16,
    marginTop: 15,
  },
});

export default styles;
