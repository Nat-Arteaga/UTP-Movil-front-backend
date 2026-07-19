// =============================================================
// controllers/chatController.js
//
// El controlador NUNCA toca la BD ni el mock directamente.
// Solo recibe el request HTTP, llama al service y responde.
// Este archivo no necesita cambios cuando llegue la BD.
// =============================================================

const chatService = require("../services/chatService");

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

module.exports = {
  listarChats,
  obtenerMensajes,
  buscarUsuarios,
  crearGrupo,
  unirseGrupo,
};