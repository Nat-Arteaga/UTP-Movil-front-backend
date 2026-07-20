const express = require("express");
const router = express.Router();

const posts = require("../controllers/postsController");
const { optionalAuth, requireAuth } = require("../middleware/auth");

router.get("/", optionalAuth, posts.obtenerPosts);
router.post("/", requireAuth, posts.crearPost);
router.put("/:id", requireAuth, posts.editarPost);
router.delete("/:id", requireAuth, posts.eliminarPost);

router.get("/:id/comentarios", posts.obtenerComentarios);
router.post("/:id/comentarios", requireAuth, posts.crearComentario);
router.post("/:id/reacciones", requireAuth, posts.reaccionarPost);
router.post("/:id/guardado", requireAuth, posts.alternarGuardado);

module.exports = router;
