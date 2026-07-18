import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function useBottomNav() {
  const insets = useSafeAreaInsets();

  // En Android los botones del sistema agregan espacio extra
  const extraAndroid = Platform.OS === "android" ? 8 : 0;

  // Mínimo 16px siempre para que no quede pegado
  const paddingBottom = Math.max(insets.bottom + extraAndroid, 16);

  return { paddingBottom };
}
