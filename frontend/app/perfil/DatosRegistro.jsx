import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import styles from "./cssDatosRegistro";

export default function DatosRegistro({ usuario }) {
  const isPrivado = usuario.privado === true || usuario.privado === "true";

  const todosDatos = [
    {
      icono: "male-female-outline",
      titulo: "GÉNERO",
      valor: usuario.genero,
      color: "#E60023",
      hideIfPrivate: true,
    },
    {
      icono: "heart-outline",
      titulo: "INTERESES",
      // Cada interés se muestra en su propia línea (no todos juntos con comas)
      lista: Array.isArray(usuario.intereses) ? usuario.intereses : [],
      color: "#E60023",
      hideIfPrivate: true,
    },
    {
      icono: "school-outline",
      titulo: "CARRERA",
      valor: usuario.carrera,
      color: "#E60023",
      hideIfPrivate: false,
    },
    {
      icono: "calendar-outline",
      titulo: "CICLO",
      valor: usuario.ciclo,
      color: "#E60023",
      hideIfPrivate: true,
    },
  ];

  const datos = isPrivado
    ? todosDatos.filter((item) => !item.hideIfPrivate)
    : todosDatos;

  return (
    <View style={styles.container}>
      {datos.map((item, index) => (
        <View
          key={index}
          style={[
            styles.tarjeta,
            index < datos.length - 1 && styles.borderRight,
          ]}
        >
          <View style={styles.iconoContainer}>
            <Ionicons name={item.icono} size={22} color={item.color} />
          </View>
          <Text style={styles.titulo}>{item.titulo}</Text>

          {item.lista ? (
            item.lista.length > 0 ? (
              item.lista.map((interes, i) => (
                <Text key={i} style={styles.valor}>
                  {interes}
                </Text>
              ))
            ) : (
              <Text style={styles.valor}>N/A</Text>
            )
          ) : (
            <Text style={styles.valor}>{item.valor || "N/A"}</Text>
          )}
        </View>
      ))}
    </View>
  );
}
