import AsyncStorage from "@react-native-async-storage/async-storage";

export const STORAGE_KEYS = {
  THEME: "app_theme",
  LANGUAGE: "app_language",
  TOKEN: "auth_token",
};

// Guardar un valor
export const saveData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error al guardar datos:", error);
  }
};

// Obtener un valor
export const getData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);

    return value != null ? JSON.parse(value) : null;
  } catch (error) {
    console.error("Error al obtener datos:", error);
    return null;
  }
};

// Eliminar un valor
export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error("Error al eliminar datos:", error);
  }
};
