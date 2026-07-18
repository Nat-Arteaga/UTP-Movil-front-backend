import { useChats } from "../context/ChatContext";

export function useChat() {
  const {
    contactos,
    conversaciones,
    chatActivo,
    setChatActivo,
    mensajesActuales,
    enviarMensaje,
    emitirEscribiendo,
    conectado,
    quienEscribe,
    reportarMensaje,
    eliminarMensaje,
    reaccionarMensaje,
    crearChatPrivado, // ← nueva
  } = useChats();

  return {
    contactos,
    conversaciones,
    chatSeleccionado: chatActivo,
    setChatSeleccionado: setChatActivo,
    mensajesActuales,
    enviarMensaje,
    emitirEscribiendo,
    conectado,
    quienEscribe,
    reportarMensaje,
    eliminarMensaje,
    reaccionarMensaje, 
    crearChatPrivado, // ← nueva
  };
}