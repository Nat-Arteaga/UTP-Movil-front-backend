import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0F0F0F",
  },
  emptyText: {
    color: "#8A8A8A",
    fontSize: 16,
  },
  messages: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 15,
    backgroundColor: "#0F0F0F",
  },
  dayBox: {
    alignSelf: "center",
    backgroundColor: "#222",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 15,
  },
  dayText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 12,
  },
  messageRow: {
    flexDirection: "row",
    marginBottom: 14,
    alignItems: "flex-end",
  },
  messageLeft: {
    justifyContent: "flex-start",
  },
  messageRight: {
    justifyContent: "flex-end",
  },
  messageAvatar: {
    width: 26,
    height: 26,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 2,
  },
  bubble: {
    maxWidth: "75%",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
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
    fontSize: 15,
    lineHeight: 22,
  },
  messageTime: {
    color: "#CFCFCF",
    fontSize: 10,
    marginTop: 4,
    alignSelf: "flex-end",
  },
});

export default styles;
