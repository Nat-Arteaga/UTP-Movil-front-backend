import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 15,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#E60023",
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarInitial: {
    color: "#FFFFFF",
    fontSize: 48,
    fontWeight: "bold",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
  },
  statusDot: {
    position: "absolute",
    bottom: 8,
    right: 8,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#30D158",
    borderWidth: 2,
    borderColor: "#050505",
  },
  statusAway: {
    backgroundColor: "#9A9A9A",
  },
  username: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 5,
  },
  carrera: {
    color: "#8A8A8A",
    fontSize: 15,
    marginBottom: 15,
  },
  bioContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    maxWidth: "80%",
  },
  comillas: {
    color: "#E60023",
    fontSize: 24,
    fontWeight: "bold",
    marginRight: 5,
  },
  bio: {
    color: "#B8B8B8",
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
});

export default styles;
