// =============================================================
// controllers/chatController.js
//
// El controlador NUNCA toca la BD ni el mock directamente.
// Solo recibe el request HTTP, llama al service y responde.
// Este archivo no necesita cambios cuando llegue la BD.
// =============================================================

const chatService = require("../services/chatService");
const { getIO } = require("../services/ioBus");

/**
 * POST /api/mensajes/archivo  (multipart/form-data)
 * fields: chatId, remitenteId, remitente, archivo (file)
 * Sube el archivo a Storage, guarda el mensaje, y lo emite por socket.
 */
async function subirArchivoMensaje(req, res) {
  try {
    const { chatId, remitenteId, remitente } = req.body;
    if (!chatId || !remitenteId || !req.file) {
      return res
        .status(400)
        .json({ success: false, error: "chatId, remitenteId y archivo son requeridos" });
    }

    const msg = await chatService.guardarMensajeConArchivo({
      chatId,
      remitenteId,
      remitente,
      buffer: req.file.buffer,
      nombreOriginal: req.file.originalname,
      mimetype: req.file.mimetype,
      tamano: req.file.size,
    });

    const io = getIO();
    if (io) io.to(`chat_${chatId}`).emit("mensaje:nuevo", msg);

    res.json({ success: true, data: msg });
  } catch (err) {
    console.error("[subirArchivoMensaje]", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * GET /api/chats?userId=xxx
 * Lista todos los chats (amigos + grupos) del usuario.
 */
async function listarChats(req, res) {
  try {
    const { userId } = req.query;
    const chats = await chatService.getChatsDeUsuario(userId);
    res.json({ success: true, data: chats });
  } catch (err) {
    console.error("[listarChats]", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * GET /api/chats/:chatId/mensajes
 * Devuelve los mensajes de un chat específico.
 */
async function obtenerMensajes(req, res) {
  try {
    const { chatId } = req.params;
    const mensajes = await chatService.getMensajes(chatId);
    res.json({ success: true, data: mensajes });
  } catch (err) {
    console.error("[obtenerMensajes]", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * GET /api/usuarios/buscar?q=texto
 * Busca usuarios por nombre o username.
 */
async function buscarUsuarios(req, res) {
  try {
    const { q } = req.query;
    const usuarios = await chatService.buscarUsuarios(q);
    res.json({ success: true, data: usuarios });
  } catch (err) {
    console.error("[buscarUsuarios]", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * POST /api/grupos/crear
 * body: { nombre, descripcion, creadorId }
 * Crea un grupo nuevo y devuelve su código de invitación.
 */
async function crearGrupo(req, res) {
  try {
    const { nombre, descripcion, creadorId } = req.body;
    if (!nombre || !creadorId) {
      return res
        .status(400)
        .json({ success: false, error: "nombre y creadorId son requeridos" });
    }
    const grupo = await chatService.crearGrupo({ nombre, descripcion, creadorId });
    res.json({ success: true, data: grupo });
  } catch (err) {
    console.error("[crearGrupo]", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * POST /api/grupos/unirse
 * body: { codigo, userId }
 * Une al usuario a un grupo existente usando su código de invitación.
 */
async function unirseGrupo(req, res) {
  try {
    const { codigo, userId } = req.body;
    if (!codigo || !userId) {
      return res
        .status(400)
        .json({ success: false, error: "codigo y userId son requeridos" });
    }
    const grupo = await chatService.unirseGrupoConCodigo({ codigo, userId });
    res.json({ success: true, data: grupo });
  } catch (err) {
    console.error("[unirseGrupo]", err.message);
    res.status(err.status || 500).json({ success: false, error: err.message });
  }
}

/**
 * GET /api/grupos/:idChat/miembros
 * Lista los miembros de un grupo con su rol.
 */
async function obtenerMiembrosGrupo(req, res) {
  try {
    const { idChat } = req.params;
    const miembros = await chatService.obtenerMiembrosGrupo(idChat);
    res.json({ success: true, data: miembros });
  } catch (err) {
    console.error("[obtenerMiembrosGrupo]", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
}

/**
 * POST /api/grupos/:idChat/expulsar
 * body: { adminId, userIdExpulsar }
 */
async function expulsarMiembro(req, res) {
  try {
    const { idChat } = req.params;
    const { adminId, userIdExpulsar } = req.body;
    if (!adminId || !userIdExpulsar) {
      return res.status(400).json({ success: false, error: "adminId y userIdExpulsar son requeridos" });
    }
    const resultado = await chatService.expulsarMiembro({ idChat, adminId, userIdExpulsar });
    res.json({ success: true, data: resultado });
  } catch (err) {
    console.error("[expulsarMiembro]", err.message);
    res.status(err.status || 500).json({ success: false, error: err.message });
  }
}

/**
 * PUT /api/grupos/:idChat
 * body: { adminId, nombre, descripcion }
 */
async function actualizarGrupo(req, res) {
  try {
    const { idChat } = req.params;
    const { adminId, nombre, descripcion } = req.body;
    if (!adminId) {
      return res.status(400).json({ success: false, error: "adminId es requerido" });
    }
    const grupo = await chatService.actualizarGrupo({ idChat, adminId, nombre, descripcion });
    res.json({ success: true, data: grupo });
  } catch (err) {
    console.error("[actualizarGrupo]", err.message);
    res.status(err.status || 500).json({ success: false, error: err.message });
  }
}

/**
 * POST /api/grupos/:idChat/salir
 * body: { userId }
 */
async function salirDeGrupo(req, res) {
  try {
    const { idChat } = req.params;
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ success: false, error: "userId es requerido" });
    }
    const resultado = await chatService.salirDeGrupo({ idChat, userId });
    res.json({ success: true, data: resultado });
  } catch (err) {
    console.error("[salirDeGrupo]", err.message);
    res.status(err.status || 500).json({ success: false, error: err.message });
  }
}

/**
 * POST /api/grupos/:idChat/regenerar-codigo
 * body: { adminId }
 */
async function regenerarCodigoInvitacion(req, res) {
  try {
    const { idChat } = req.params;
    const { adminId } = req.body;
    if (!adminId) {
      return res.status(400).json({ success: false, error: "adminId es requerido" });
    }
    const resultado = await chatService.regenerarCodigoInvitacion({ idChat, adminId });
    res.json({ success: true, data: resultado });
  } catch (err) {
    console.error("[regenerarCodigoInvitacion]", err.message);
    res.status(err.status || 500).json({ success: false, error: err.message });
  }
}

module.exports = {
  listarChats,
  obtenerMensajes,
  buscarUsuarios,
  crearGrupo,
  unirseGrupo,
  subirArchivoMensaje,
  obtenerMiembrosGrupo,
  expulsarMiembro,
  actualizarGrupo,
  salirDeGrupo,
  regenerarCodigoInvitacion,
};