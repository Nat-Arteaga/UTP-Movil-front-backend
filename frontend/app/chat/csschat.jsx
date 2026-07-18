import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  // El container NO usa paddingBottom fijo — lo maneja SafeAreaView
  container: {
    flex: 1,
    backgroundColor: "#050505",
  },
  header: {
    height: 60,
    paddingHorizontal: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#050505",
    zIndex: 1,
  },
  logo: {
    color: "#E60023",
    fontSize: 28,
    fontWeight: "900",
  },
  logoBlanco: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
  },
  headerIcons: {
    flexDirection: "row",
    gap: 18,
    alignItems: "center",
  },
  body: {
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  sidebar: {
    width: "38%",
    backgroundColor: "#0D0D0D",
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 4,
    marginRight: 4,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
    marginLeft: 4,
    letterSpacing: 1,
    marginTop: 10,
    marginBottom: 6,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 14,
    marginBottom: 4,
  },
  contactActive: {
    backgroundColor: "rgba(230,0,35,0.22)",
  },
  initialAvatarContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#333333",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  initialAvatarText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  initialAvatarHeader: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  initialAvatarHeaderText: {
    fontSize: 18,
  },
  initialAvatarMessage: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 2,
  },
  initialAvatarMessageText: {
    fontSize: 11,
  },
  statusDot: {
    position: "absolute",
    right: 8,
    bottom: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
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
    fontSize: 12,
    fontWeight: "800",
  },
  contactStatus: {
    color: "#8A8A8A",
    fontSize: 11,
    marginTop: 2,
  },
  badge: {
    backgroundColor: "#E60023",
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "auto",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "900",
  },
  chatPanel: {
    flex: 1,
    backgroundColor: "#0D0D0D",
    borderRadius: 18,
    overflow: "hidden",
  },
  chatHeader: {
    height: 70,
    borderBottomWidth: 1,
    borderBottomColor: "#1F1F1F",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  chatHeaderInfo: {
    flex: 1,
    marginLeft: 8,
  },
  chatName: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },
  chatStatus: {
    color: "#B8B8B8",
    fontSize: 12,
    marginTop: 2,
  },
  messages: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
    backgroundColor: "#0F0F0F",
  },
  dayBox: {
    alignSelf: "center",
    backgroundColor: "#222",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 12,
  },
  dayText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 11,
  },
  messageRow: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "flex-end",
  },
  messageLeft: {
    justifyContent: "flex-start",
  },
  messageRight: {
    justifyContent: "flex-end",
  },
  bubble: {
    maxWidth: "75%",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  otherBubble: {
    backgroundColor: "#242424",
    borderBottomLeftRadius: 4,
  },
  myBubble: {
    backgroundColor: "#C9142B",
    borderBottomRightRadius: 4,
  },
  messageText: {
    color: "#FFFFFF",
    fontSize: 14,
    lineHeight: 20,
  },
  messageTime: {
    color: "#CFCFCF",
    fontSize: 10,
    marginTop: 4,
    alignSelf: "flex-end",
  },
  inputArea: {
    height: 60,
    borderTopWidth: 1,
    borderTopColor: "#1F1F1F",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    gap: 8,
    backgroundColor: "#0D0D0D",
  },
  circleButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#E60023",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "#151515",
    borderRadius: 20,
    color: "#FFFFFF",
    paddingHorizontal: 14,
    height: 38,
    fontSize: 13,
  },

  // ─── BOTTOM NAV ───────────────────────────────────────────
  // NO usa paddingBottom fijo — useSafeAreaInsets lo maneja
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#050505",
    borderTopWidth: 1,
    borderTopColor: "#1F1F1F",
    paddingTop: 12,
    paddingHorizontal: 20,
    justifyContent: "space-between",
    // paddingBottom se agrega dinámicamente en el componente
    // usando insets.bottom de useSafeAreaInsets
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  navText: {
    color: "#8A8A8A",
    fontSize: 10,
    marginTop: 4,
  },
  navTextActive: {
    color: "#FF4D67",
    fontWeight: "bold",
  },
  smallBadge: {
    position: "absolute",
    right: -6,
    top: -6,
    backgroundColor: "#E60023",
    borderRadius: 8,
    width: 14,
    height: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  smallBadgeText: {
    color: "white",
    fontSize: 8,
    fontWeight: "bold",
  },
});

export default styles;
