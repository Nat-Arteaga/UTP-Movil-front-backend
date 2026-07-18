import { StyleSheet } from "react-native";

export const ColorLogin = {
  fondo: "#050505",
  fondoCaja: "#101010",
  negroSuave: "#0B0B0B",
  rojo: "#E60023",
  rojoOscuro: "#7A0012",
  blanco: "#FFFFFF",
  grisTexto: "#B8B8B8",
  grisInput: "#2A2A2A",
  placeholder: "#8A8A8A",
};

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
      paddingHorizontal: 28,
      justifyContent: "center",
    },
    logoRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 35,
    },
    logoBox: {
      width: 70,
      height: 70,
      alignItems: "center",
      justifyContent: "center",
      marginHorizontal: 4,
    },
    logoRed: {
      backgroundColor: ColorLogin.rojo,
    },
    logoDark: {
      backgroundColor: theme.colors.card,
    },
    logoText: {
      color: theme.colors.text,
      fontSize: 42,
      fontWeight: "900",
    },
    plus: {
      color: ColorLogin.rojo,
      fontSize: 36,
      fontWeight: "900",
      marginLeft: 15,
    },
    movil: {
      color: theme.colors.text,
      fontSize: 30,
      fontWeight: "800",
      marginLeft: 4,
    },
    title: {
      color: theme.colors.text,
      fontSize: 32,
      fontWeight: "900",
      textAlign: "center",
      marginBottom: 12,
    },
    subtitle: {
      color: theme.colors.textSecondary,
      fontSize: 18,
      textAlign: "center",
      lineHeight: 26,
      marginBottom: 40,
    },
    spacing: {
      height: 40,
    },
    utpButton: {
      backgroundColor: ColorLogin.rojo,
      height: 64,
      borderRadius: 13,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      gap: 12,
      shadowColor: ColorLogin.rojo,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    buttonDisabled: {
      opacity: 0.7,
    },
    utpText: {
      color: ColorLogin.blanco,
      fontSize: 20,
      fontWeight: "900",
    },
    infoText: {
      color: theme.colors.textSecondary,
      fontSize: 14,
      textAlign: "center",
      marginTop: 24,
      lineHeight: 20,
    },
    trianguloDerecha: {
      position: "absolute",
      right: -70,
      top: 0,
      width: 180,
      height: 180,
      backgroundColor: ColorLogin.rojoOscuro,
      transform: [{ rotate: "45deg" }],
      opacity: 0.65,
    },
    trianguloIzquierda: {
      position: "absolute",
      left: -80,
      bottom: 0,
      width: 180,
      height: 180,
      backgroundColor: ColorLogin.rojoOscuro,
      transform: [{ rotate: "45deg" }],
      opacity: 0.6,
    },
  });

export default createStyles;
