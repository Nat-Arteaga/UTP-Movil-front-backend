import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050505",
  },
  closeButton: {
    padding: 15,
    alignSelf: "flex-end",
  },
  avatarContainer: {
    alignSelf: "center",
    position: "relative",
    marginVertical: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#222",
  },
  statusDot: {
    position: "absolute",
    right: 5,
    bottom: 5,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#30D158",
    borderWidth: 4,
    borderColor: "#050505",
  },
  statusAway: {
    backgroundColor: "#8A8A8A",
  },
  username: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
  },
  carrera: {
    color: "#8A8A8A",
    fontSize: 16,
    textAlign: "center",
    marginTop: 5,
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 30,
    paddingHorizontal: 20,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  statLabel: {
    color: "#8A8A8A",
    fontSize: 12,
    marginTop: 4,
  },
  chatButton: {
    flexDirection: "row",
    backgroundColor: "#E60023",
    paddingVertical: 15,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  chatButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  addButton: {
    borderWidth: 1,
    borderColor: "#8a8a8a",
    paddingVertical: 15,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default styles;
