import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    marginTop: 10,
    paddingHorizontal: 6,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
    marginLeft: 8,
    letterSpacing: 1,
  },
  marginTop: {
    marginTop: 25,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 14,
    marginBottom: 6,
  },
  contactActive: {
    backgroundColor: "rgba(230,0,35,0.22)",
  },
  avatarContainer: {
    position: "relative",
    marginRight: 10,
    marginTop: 2,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 25,
    backgroundColor: "#222",
  },
  initialAvatarContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#333333",
    alignItems: "center",
    justifyContent: "center",
  },
  initialAvatarText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  statusDot: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 12,
    height: 12,
    borderRadius: 10,
    backgroundColor: "#30D158",
    borderWidth: 2,
    borderColor: "#0D0D0D",
  },
  statusAway: {
    backgroundColor: "#8A8A8A",
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  contactStatus: {
    color: "#8A8A8A",
    fontSize: 12,
    marginTop: 2,
  },
  badge: {
    backgroundColor: "#E60023",
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "900",
  },
});

export default styles;
