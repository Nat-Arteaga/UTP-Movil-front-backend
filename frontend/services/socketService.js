// =============================================================
// services/socketService.js
//
// Singleton del cliente Socket.IO.
// Toda la app usa la misma conexión a través de este módulo.
// Cuando el servidor cambie de dirección, solo se cambia SOCKET_URL.
// =============================================================

import { io } from "socket.io-client";

// ── Cambia esta IP a la de tu máquina en la red local ──────────
// Ejemplo: "http://192.168.1.5:3000"
// Para emulador Android en Android Studio: "http://10.0.2.2:3000"
// Para web en Expo Go:                     "http://localhost:3000"
export const SOCKET_URL = "https://front-backend-utp-movil-production.up.railway.app";

let socket = null;

/**
 * Inicia la conexión con el servidor.
 * Si ya hay una conexión activa, la devuelve sin crear otra.
 * @returns {Socket}
 */
export function conectar() {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socket.on("connect", () =>
      console.log("[socket] conectado:", socket.id)
    );
    socket.on("disconnect", (reason) =>
      console.log("[socket] desconectado:", reason)
    );
    socket.on("connect_error", (err) =>
      console.warn("[socket] error de conexión:", err.message)
    );
  }
  return socket;
}

/**
 * Devuelve el socket activo (o null si no se ha conectado).
 * @returns {Socket|null}
 */
export function getSocket() {
  return socket;
}

/**
 * Cierra la conexión y limpia la instancia.
 */
export function desconectar() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
