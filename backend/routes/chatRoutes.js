// =============================================================
// routes/chatRoutes.js
// Rutas HTTP del módulo de chat.
// Este archivo no necesita cambios cuando llegue la BD.
// =============================================================

const { Router } = require("express");
const multer = require("multer");
const ctrl = require("../controllers/chatController");

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }, // 15 MB
});

// Lista de chats del usuario  →  GET /api/chats?userId=xxx
router.get("/chats", ctrl.listarChats);

// Mensajes de un chat         →  GET /api/chats/:chatId/mensajes
router.get("/chats/:chatId/mensajes", ctrl.obtenerMensajes);

// Buscar usuarios             →  GET /api/usuarios/buscar?q=texto
router.get("/usuarios/buscar", ctrl.buscarUsuarios);

// Crear grupo (genera código)  →  POST /api/grupos/crear
router.post("/grupos/crear", ctrl.crearGrupo);

// Unirse a grupo con código    →  POST /api/grupos/unirse
router.post("/grupos/unirse", ctrl.unirseGrupo);

// Subir archivo adjunto        →  POST /api/mensajes/archivo
router.post("/mensajes/archivo", upload.single("archivo"), ctrl.subirArchivoMensaje);

// Miembros de un grupo         →  GET /api/grupos/:idChat/miembros
router.get("/grupos/:idChat/miembros", ctrl.obtenerMiembrosGrupo);

// Expulsar miembro (solo admin) →  POST /api/grupos/:idChat/expulsar
router.post("/grupos/:idChat/expulsar", ctrl.expulsarMiembro);

// Editar nombre/descripción (solo admin) → PUT /api/grupos/:idChat
router.put("/grupos/:idChat", ctrl.actualizarGrupo);

// Salir del grupo               →  POST /api/grupos/:idChat/salir
router.post("/grupos/:idChat/salir", ctrl.salirDeGrupo);

// Regenerar código (solo admin)  →  POST /api/grupos/:idChat/regenerar-codigo
router.post("/grupos/:idChat/regenerar-codigo", ctrl.regenerarCodigoInvitacion);

module.exports = router;