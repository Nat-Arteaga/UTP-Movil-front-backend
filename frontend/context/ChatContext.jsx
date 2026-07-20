import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { conectar, desconectar, getSocket, SOCKET_URL } from "../services/socketService";

const ChatContext = createContext(null);

export function ChatProvider({ children, userId = "1", nombreUsuario = "Yo" }) {
  const [contactos, setContactos] = useState([]);
  const [conversaciones, setConversaciones] = useState({});
  const [chatActivo, setChatActivoState] = useState(null);
  const [escribiendoPor, setEscribiendoPor] = useState({});
  const [conectado, setConectado] = useState(false);

  useEffect(() => {
    const socket = conectar();

    socket.on("connect", () => {
      setConectado(true);
      socket.emit("usuario:conectar", { userId, nombre: nombreUsuario });
    });

    socket.on("disconnect", () => setConectado(false));

    socket.on("chat:listar", ({ chats }) => {
      setContactos(chats);
    });

    socket.on("mensajes:historial", ({ chatId, mensajes }) => {
      const mensajesConMio = mensajes.map((m) => ({
      ...m,
      mio: String(m.remitenteId) === String(userId),
    }));
      setConversaciones((prev) => ({ ...prev, [chatId]: mensajesConMio }));
    });

    socket.on("mensaje:nuevo", (msg) => {
      setConversaciones((prev) => {
        const prevMsgs = prev[msg.chatId] || [];
        const yaExiste = prevMsgs.some((m) => m.id === msg.id);
        if (yaExiste) return prev;
        const mensajeConMio = {
          ...msg,
          mio: String(msg.remitenteId) === String(userId),
        };
        return { ...prev, [msg.chatId]: [...prevMsgs, mensajeConMio] };
      });
    });

    // ── Mensaje eliminado por reportes ────────────────────
    socket.on("mensaje:eliminado", ({ msgId, chatId, textoReemplazado }) => {
      setConversaciones((prev) => {
        const msgs = prev[chatId] || [];
        const actualizados = msgs.map((m) =>
          String(m.id) === String(msgId)
            ? { ...m, texto: textoReemplazado, eliminado: true }
            : m
        );
        return { ...prev, [chatId]: actualizados };
      });
      
    });
    // ── Mensaje eliminado por el usuario ─────────────────────────
    socket.on("mensaje:eliminadoPorUsuario", ({ msgId, chatId, texto }) => {
      setConversaciones((prev) => {
        const msgs = prev[chatId] || [];
        const actualizados = msgs.map((m) =>
          String(m.id) === String(msgId)
            ? { ...m, texto, eliminado: true }
            : m
        );
        return { ...prev, [chatId]: actualizados };
      });
    });
    // ── Chat privado creado ───────────────────────────────────────
    socket.on("chat:creado", ({ chatId }) => {
      socket.emit("chat:unirse", { chatId });
      
      setChatActivoState((prev) => ({
        ...prev,
        id: chatId,
      }));

      // Recargar lista de contactos
      socket.emit("usuario:conectar", { userId, nombre: nombreUsuario });
    });
    // ── Reacción a mensaje ────────────────────────────────────────
    socket.on("mensaje:reaccion", ({ msgId, chatId, emoji, count, quitar }) => {
      setConversaciones((prev) => {
        const msgs = prev[chatId] || [];
        const actualizados = msgs.map((m) => {
          if (String(m.id) !== String(msgId)) return m;
          const reacciones = { ...(m.reacciones || {}) };
          if (quitar && count === 0) {
            delete reacciones[emoji];
          } else {
            reacciones[emoji] = count;
          }
          return { ...m, reacciones };
        });
        return { ...prev, [chatId]: actualizados };
      });
    });
    socket.on("presencia:cambio", ({ userId: uid, estado }) => {
      setContactos((prev) =>
        prev.map((c) => (String(c.id) === String(uid) ? { ...c, estado } : c))
      );
    });

    socket.on("escribiendo", ({ chatId, nombre, escribiendo }) => {
      setEscribiendoPor((prev) => ({ ...prev, [chatId]: escribiendo ? nombre : null }));
    });

    return () => {
      desconectar();
    };
  }, [userId, nombreUsuario]);

  const setChatActivo = useCallback((chat) => {
    setChatActivoState(chat);
    if (!chat) return;
    const socket = getSocket();
    if (socket) {
      socket.emit("chat:unirse", { chatId: chat.id });
      socket.emit("mensaje:marcarVisto", { chatId: chat.id });
    }
  }, []);

  const enviarMensaje = useCallback(
    (texto) => {
      if (!chatActivo || !texto.trim()) return;
      const socket = getSocket();
      if (!socket) return;
      socket.emit("mensaje:enviar", {
        chatId: chatActivo.id,
        texto: texto.trim(),
        remitente: nombreUsuario,
      });
    },
    [chatActivo, nombreUsuario]
  );

  const emitirEscribiendo = useCallback(
    (activo) => {
      const socket = getSocket();
      if (!socket || !chatActivo) return;
      socket.emit(activo ? "escribiendo:inicio" : "escribiendo:fin", {
        chatId: chatActivo.id,
      });
    },
    [chatActivo]
  );

  // ── Reportar mensaje ──────────────────────────────────────
  const reportarMensaje = useCallback(
    (msgId) => {
      const socket = getSocket();
      if (!socket || !chatActivo) return;
      socket.emit("mensaje:reportar", {
        msgId,
        chatId: chatActivo.id,
      });
    },
    [chatActivo]
  );
  const eliminarMensaje = useCallback(
    (msgId, paraTodos) => {
      const socket = getSocket();
      if (!socket || !chatActivo) return;
      socket.emit("mensaje:eliminar", {
        msgId,
        chatId: chatActivo.id,
        paraTodos,
      });
    },
    [chatActivo]
  );
  const crearChatPrivado = useCallback(
  (userId2, nombreContacto) => {
    const socket = getSocket();
    if (!socket) return;
    socket.emit("chat:crear", {
      userId1: userId,
      userId2,
    });
    // Mientras se crea, preparamos el chat en el estado
    const chatTemporal = {
      id: `temp_${userId2}`,
      nombre: nombreContacto,
      tipo: "amigo",
      estado: "En línea",
    };
    setChatActivoState(chatTemporal);
  },
  [userId]
  );
  // ── Crear grupo con código de invitación ──────────────────────
  const crearGrupo = useCallback(
    async (nombre, descripcion) => {
      const res = await fetch(`${SOCKET_URL}/api/grupos/crear`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, descripcion, creadorId: userId }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "No se pudo crear el grupo");

      // Refrescar lista de chats para que aparezca el grupo nuevo
      const socket = getSocket();
      if (socket) socket.emit("usuario:conectar", { userId, nombre: nombreUsuario });

      return data.data; // { idChat, codigo, nombre }
    },
    [userId, nombreUsuario]
  );

  // ── Unirse a un grupo existente con código de invitación ───────
  const unirseGrupo = useCallback(
    async (codigo) => {
      const res = await fetch(`${SOCKET_URL}/api/grupos/unirse`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codigo, userId }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Código inválido");

      const socket = getSocket();
      if (socket) socket.emit("usuario:conectar", { userId, nombre: nombreUsuario });

      return data.data; // { idChat, nombre }
    },
    [userId, nombreUsuario]
  );

  // ── Administración de grupo ─────────────────────────────────────
  const obtenerMiembrosGrupo = useCallback(async (idChat) => {
    const res = await fetch(`${SOCKET_URL}/api/grupos/${idChat}/miembros`);
    const data = await res.json();
    if (!data.success) throw new Error(data.error || "No se pudo cargar la lista");
    return data.data; // [{ id, username, avatar, rol }]
  }, []);

  const expulsarMiembro = useCallback(
    async (idChat, userIdExpulsar) => {
      const res = await fetch(`${SOCKET_URL}/api/grupos/${idChat}/expulsar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminId: userId, userIdExpulsar }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "No se pudo expulsar");
      return data.data;
    },
    [userId]
  );

  const actualizarGrupo = useCallback(
    async (idChat, nombre, descripcion) => {
      const res = await fetch(`${SOCKET_URL}/api/grupos/${idChat}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminId: userId, nombre, descripcion }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "No se pudo actualizar");

      const socket = getSocket();
      if (socket) socket.emit("usuario:conectar", { userId, nombre: nombreUsuario });

      return data.data;
    },
    [userId, nombreUsuario]
  );

  const salirDeGrupo = useCallback(
    async (idChat) => {
      const res = await fetch(`${SOCKET_URL}/api/grupos/${idChat}/salir`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "No se pudo salir del grupo");

      const socket = getSocket();
      if (socket) socket.emit("usuario:conectar", { userId, nombre: nombreUsuario });

      return data.data;
    },
    [userId, nombreUsuario]
  );

  const regenerarCodigoGrupo = useCallback(
    async (idChat) => {
      const res = await fetch(`${SOCKET_URL}/api/grupos/${idChat}/regenerar-codigo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminId: userId }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "No se pudo regenerar el código");
      return data.data; // { codigo }
    },
    [userId]
  );

  const reaccionarMensaje = useCallback(
  (msgId, emoji) => {
    const socket = getSocket();
    if (!socket || !chatActivo) return;
    socket.emit("mensaje:reaccionar", {
      msgId,
      chatId: chatActivo.id,
      emoji,
      userId,
    });
  },
  [chatActivo, userId]
  );
  const mensajesActuales = chatActivo
    ? conversaciones[chatActivo.id] || []
    : [];

  const quienEscribe = chatActivo ? escribiendoPor[chatActivo.id] : null;

  return (
    <ChatContext.Provider
      value={{
      contactos,
      conversaciones,
      chatActivo,
      setChatActivo,
      mensajesActuales,
      enviarMensaje,
      emitirEscribiendo,
      reportarMensaje,
      eliminarMensaje,
      reaccionarMensaje, 
      crearChatPrivado, // ← nueva
      crearGrupo,
      unirseGrupo,
      obtenerMiembrosGrupo,
      expulsarMiembro,
      actualizarGrupo,
      salirDeGrupo,
      regenerarCodigoGrupo,
      conectado,
      quienEscribe,
      userId,
      nombreUsuario,
    }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChats() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChats debe usarse dentro de <ChatProvider>");
  return ctx;
}