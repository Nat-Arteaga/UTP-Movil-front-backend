import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useBottomNav } from "../hooks/useBottomNav";
import styles from "./csscarrera";

export default function Carrera() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { paddingBottom } = useBottomNav();

  const [carreraSel, setCarreraSel] = useState(null);
  const [cicloSel, setCicloSel] = useState(null);

  // Configuración de carreras con sus ciclos máximos
  const CARRERAS = [
    { nombre: "Ingeniería de Sistemas e Informática", maxCiclos: 10 },
    { nombre: "Psicología", maxCiclos: 10 },
    { nombre: "Medicina Humana", maxCiclos: 12 },
    { nombre: "Ingeniería Industrial", maxCiclos: 10 },
    { nombre: "Derecho", maxCiclos: 10 },
    { nombre: "Arquitectura", maxCiclos: 10 },
    { nombre: "Administración de Empresas", maxCiclos: 10 },
    { nombre: "Contabilidad", maxCiclos: 10 },
    { nombre: "Ingeniería Civil", maxCiclos: 10 },
    { nombre: "Comunicaciones", maxCiclos: 10 },
  ];

  // Genera los ciclos según la carrera seleccionada
  const ciclosDisponibles = carreraSel
    ? Array.from({ length: carreraSel.maxCiclos }, (_, i) => i + 1)
    : [];

  const handleContinuar = () => {
  if (!carreraSel || !cicloSel) return;

  router.push({
    pathname: "/usuario",
    params: {
      ...params,
      carrera: carreraSel.nombre,
      ciclo: `${cicloSel}to ciclo`,
    },
  });
  };

  return (
    <SafeAreaView style={[styles.container, { paddingBottom: Math.max(paddingBottom, 20) }]}>
      <Text style={styles.title}>Selecciona tu carrera</Text>

      {/* Selector de Carrera */}
      <ScrollView
        style={styles.selectorBox}
        showsVerticalScrollIndicator={false}
      >
        {CARRERAS.map((c) => (
          <TouchableOpacity
            key={c.nombre}
            style={[
              styles.option,
              carreraSel?.nombre === c.nombre && styles.optionSelected,
            ]}
            onPress={() => {
              setCarreraSel(c);
              setCicloSel(null);
            }}
          >
            <Text
              style={[
                styles.optionText,
                carreraSel?.nombre === c.nombre && styles.optionTextSelected,
              ]}
            >
              {c.nombre}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {carreraSel && (
        <>
          <Text style={styles.subtitle}>¿En qué ciclo vas?</Text>
          <View style={styles.gridCiclos}>
            {ciclosDisponibles.map((num) => (
              <TouchableOpacity
                key={num}
                style={[
                  styles.cicloBtn,
                  cicloSel === num && styles.cicloBtnSelected,
                ]}
                onPress={() => setCicloSel(num)}
              >
                <Text
                  style={[
                    styles.cicloText,
                    cicloSel === num && styles.cicloTextSelected,
                  ]}
                >
                  {num}°
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      <TouchableOpacity
        style={[
          styles.continueBtn,
          (!carreraSel || !cicloSel) && styles.disabledBtn,
        ]}
        onPress={handleContinuar}
        disabled={!carreraSel || !cicloSel}
      >
        <Text style={styles.continueText}>Continuar</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
