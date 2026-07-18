// =============================================================
// hooks/useContactos.js
//
// Devuelve los contactos ya separados en amigos y grupos,
// igual que la lógica que chat.jsx tiene hardcodeada.
// =============================================================

import { useMemo } from "react";
import { useChat } from "./useChat";

export function useContactos() {
  const { contactos } = useChat();

  const amigos = useMemo(
    () => contactos.filter((c) => c.tipo === "amigo"),
    [contactos]
  );

  const grupos = useMemo(
    () => contactos.filter((c) => c.tipo === "grupo"),
    [contactos]
  );

  return { contactos, amigos, grupos };
}
