// =============================================================
// sockets/chatSocket.js
// =============================================================

const chatService = require("../services/chatService");
const pool = require("../db");

const usuariosConectados = new Map();
const reacciones = new Map(); // ← agrega esta línea
// ── Lista de palabras censuradas ──────────────────────────────
const PALABRAS_CENSURADAS = [
  "conchetumadre",
  "conchatumare",
  "hijo de puta",
  "malparido",
  "puta",
  "idiota",
  "basura",
  "estupido",
  "perro",
  "maricon",
  "pendejo",
  "cagon de mierda",
  "mierda",
  "puto",
  "huevon",
  "puta madre",
  "carajo",
  "cabro",
  "wueon",
  "sonzo",
  "tarado",
  "imbecil",
  "baboso",
  "mongol",
  "cojudo",
  "gil",
  "tarao",
  "atorrante",
  "me llegas al pincho",
  "desahuevate",
  "rosquete",
  "pastrulo",
  "pastelero",
  "drogo",
  "fumon",
  "fumeque",
  "marihuanero",
  "chupapinga",
  "mostro",
  "careperro",
  "caremuerto",
  "cachudo",
  "venado",
  "terruco",
];

function censurar(texto) {
  let resultado = texto;
  PALABRAS_CENSURADAS.forEach((palabra) => {
    const regex = new RegExp(palabra, "gi");
    resultado = resultado.replace(regex, "*".repeat(palabra.length));
  });
  return resultado;
}

module.exports = function registrarSocketsChat(io) {
  io.on("connection", (socket) => {
    console.log(`[socket] conectado: ${socket.id}`);

    socket.on("usuario:conectar", async ({ userId, nombre }) => {
      socket.data.userId = userId;
      socket.data.nombre = nombre;
      usuariosConectados.set(socket.id, { userId, nombre });

      await chatService.actualizarPresencia(userId, "En línea");

      socket.broadcast.emit("presencia:cambio", {
        userId,
        nombre,
        estado: "En línea",
      });

      const chats = await chatService.getChatsDeUsuario(userId);
      socket.emit("chat:listar", { chats });

      console.log(`[socket] usuario conectado: ${nombre} (${userId})`);
    });

    socket.on("chat:unirse", async ({ chatId }) => {
      const rooms = [...socket.rooms].filter(
        (r) => r !== socket.id && r.startsWith("chat_")
      );
      rooms.forEach((r) => socket.leave(r));

      socket.join(`chat_${chatId}`);
      socket.data.chatActivo = chatId;

      const mensajes = await chatService.getMensajes(chatId);
      socket.emit("mensajes:historial", { chatId, mensajes });

      console.log(`[socket] ${socket.data.nombre} unido a chat_${chatId}`);
    });

    socket.on("mensaje:enviar", async ({ chatId, texto, remitente }) => {
      if (!texto || !texto.trim()) return;

      const userId = socket.data.userId;
      const nombreRemitente = remitente || socket.data.nombre || "Usuario";

      const mensaje = await chatService.guardarMensaje({
        chatId,
        texto: censurar(texto.trim()),
        remitenteId: userId,
        remitente: nombreRemitente,
      });

      io.to(`chat_${chatId}`).emit("mensaje:nuevo", mensaje);
    });

    socket.on("escribiendo:inicio", ({ chatId }) => {
      socket.to(`chat_${chatId}`).emit("escribiendo", {
        chatId,
        userId: socket.data.userId,
        nombre: socket.data.nombre,
        escribiendo: true,
      });
    });

    socket.on("escribiendo:fin", ({ chatId }) => {
      socket.to(`chat_${chatId}`).emit("escribiendo", {
        chatId,
        userId: socket.data.userId,
        nombre: socket.data.nombre,
        escribiendo: false,
      });
    });

    socket.on("mensaje:marcarVisto", async ({ chatId }) => {
      const userId = socket.data.userId;
      socket.to(`chat_${chatId}`).emit("mensaje:visto", {
        chatId,
        userId,
      });
    });

    // ── Reportar mensaje ─────────────────────────────────────
    socket.on("mensaje:reportar", ({ msgId, chatId }) => {
      console.log(`[reporte] msgId: ${msgId}, chatId: ${chatId}`);
      const resultado = chatService.reportarMensaje(msgId, chatId);
      console.log(`[reporte] resultado:`, resultado);

      if (resultado.eliminado) {
        io.to(`chat_${chatId}`).emit("mensaje:eliminado", {
          msgId,
          chatId,
          textoReemplazado: "⚠️ Mensaje eliminado por límite de reportes",
        });
      } else {
        socket.emit("reporte:confirmado", { msgId, reportes: resultado.reportes });
      }
    });
    // ── Eliminar mensaje ─────────────────────────────────────────
    socket.on("mensaje:eliminar", ({ msgId, chatId, paraTodos }) => {
      const userId = socket.data.userId;
      console.log(`[eliminar] msgId: ${msgId}, paraTodos: ${paraTodos}`);

      if (paraTodos) {
        io.to(`chat_${chatId}`).emit("mensaje:eliminadoPorUsuario", {
          msgId,
          chatId,
          texto: "🗑️ Mensaje eliminado",
        });
      } else {
        socket.emit("mensaje:eliminadoPorUsuario", {
          msgId,
          chatId,
          texto: "🗑️ Mensaje eliminado",
          soloYo: true,
        });
      }
    });

    // ── Reaccionar a mensaje ─────────────────────────────────────
    socket.on("mensaje:reaccionar", ({ msgId, chatId, emoji, userId }) => {
      const key = `${chatId}_${msgId}_${emoji}`;
      if (!reacciones.has(key)) reacciones.set(key, new Set());

      const usuarios = reacciones.get(key);

      if (usuarios.has(userId)) {
        usuarios.delete(userId);
        io.to(`chat_${chatId}`).emit("mensaje:reaccion", {
          msgId, chatId, emoji,
          count: usuarios.size,
          quitar: true,
        });
      } else {
        usuarios.add(userId);
        io.to(`chat_${chatId}`).emit("mensaje:reaccion", {
          msgId, chatId, emoji,
          count: usuarios.size,
          quitar: false,
        });
      }
    });
    // ── Crear chat privado ────────────────────────────────────────
    socket.on("chat:crear", async ({ userId1, userId2 }) => {
        console.log(`[chat:crear] userId1: ${userId1}, userId2: ${userId2}`);
      try {
        // Verificar si ya existe
        const existe = await pool.query(
          `SELECT cp.id_chat FROM chats_privados cp
          WHERE (cp.id_usuario_1 = $1 AND cp.id_usuario_2 = $2)
          OR (cp.id_usuario_1 = $2 AND cp.id_usuario_2 = $1)`,
          [userId1, userId2]
        );

        if (existe.rows.length > 0) {
          socket.emit("chat:creado", { chatId: existe.rows[0].id_chat });
          return;
        }

        // Crear nuevo chat
        const nuevoChat = await pool.query(
          `INSERT INTO chats (nombre, tipo_chat, creado_por)
          VALUES ('Chat privado', 'privado', $1)
          RETURNING id_chat`,
          [userId1]
        );
        const chatId = nuevoChat.rows[0].id_chat;

        await pool.query(
          `INSERT INTO participantes_chat (id_chat, codigo_usu) VALUES ($1, $2), ($1, $3)`,
          [chatId, userId1, userId2]
        );

        await pool.query(
          `INSERT INTO chats_privados (id_chat, id_usuario_1, id_usuario_2) VALUES ($1, $2, $3)`,
          [chatId, userId1, userId2]
        );

        socket.emit("chat:creado", { chatId });
        console.log(`[chat] Chat privado creado: ${chatId} entre ${userId1} y ${userId2}`);

      } catch (err) {
        console.error("[chat:crear] Error:", err.message);
        socket.emit("chat:error", { mensaje: "No se pudo crear el chat" });
      }
    });
    // ── Desconexión ───────────────────────────────────────────────
    socket.on("disconnect", async () => {
      const { userId, nombre } = socket.data;
      usuariosConectados.delete(socket.id);

      if (userId) {
        await chatService.actualizarPresencia(userId, "Ausente");

        socket.broadcast.emit("presencia:cambio", {
          userId,
          nombre,
          estado: "Ausente",
        });
      }

      console.log(`[socket] desconectado: ${socket.id}`);
    });
  });
};