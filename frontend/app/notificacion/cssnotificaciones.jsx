import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050505",
    paddingTop: 45, // Espacio para la barra de estado
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoRed: {
    color: "#E60023",
    fontSize: 28,
    fontWeight: "900",
  },
  logoWhite: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "900",
    marginLeft: 5,
  },
  marcarLeidas: {
    color: "#8A8A8A",
    fontSize: 14,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111",
    borderRadius: 12,
    paddingHorizontal: 15,
    marginHorizontal: 20,
    marginBottom: 15,
    height: 45,
  },
  searchInput: {
    flex: 1,
    color: "white",
    fontSize: 14,
    marginLeft: 10,
  },
  filtros: {
    paddingHorizontal: 15,
    marginBottom: 20,
    height: 52, // Altura restaurada
  },
  filtro: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#333",
    height: 42, // Altura más cómoda
  },
  filtroActivo: {
    backgroundColor: "#E60023",
  },
  filtroTexto: {
    color: "#888",
    fontSize: 14,
    fontWeight: "bold",
  },
  filtroTextoActivo: {
    color: "white",
  },
  filtroBadge: {
    marginLeft: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  filtroBadgeActivo: {
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  filtroBadgeInactivo: {
    backgroundColor: "#333",
  },
  filtroBadgeText: {
    color: "white",
    fontSize: 11,
    fontWeight: "bold",
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
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#050505",
    borderTopWidth: 1,
    borderTopColor: "#1F1F1F",
    paddingTop: 12,
    paddingHorizontal: 20,
    justifyContent: "space-between",
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
