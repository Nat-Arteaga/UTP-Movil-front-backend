const pool = require("../db");

const MAX_CONTENT_LENGTH = 2000;
const REACTION_TYPES = new Map([
  ["up", "like"],
  ["like", "like"],
  ["down", "dislike"],
  ["dislike", "dislike"],
]);

const postFields = `
  p.id_post AS id,
  p.codigo_usu AS "authorId",
  p.contenido AS texto,
  COALESCE(p.tipo_post, 'General') AS categoria,
  p.visibilidad AS visibilidad,
  p.fecha_publicacion AS "createdAt",
  p.fecha_actualizacion AS "updatedAt",
  u.username AS usuario,
  COALESCE(perfil.carrera, 'Estudiante UTP') AS carrera,
  COALESCE((
    SELECT SUM(CASE
      WHEN r.tipo_reaccion = 'like' THEN 1
      WHEN r.tipo_reaccion = 'dislike' THEN -1
      ELSE 0
    END)::integer
    FROM reacciones r
    WHERE r.id_post = p.id_post
  ), 0) AS likes,
  (
    SELECT r.tipo_reaccion
    FROM reacciones r
    WHERE r.id_post = p.id_post AND r.codigo_usu = $1::integer
    ORDER BY r.fecha_reaccion DESC, r.id_reaccion DESC
    LIMIT 1
  ) AS "userVote",
  EXISTS(
    SELECT 1 FROM guardados g
    WHERE g.id_post = p.id_post AND g.codigo_usu = $1::integer
  ) AS saved,
  COALESCE(comentarios.comentarios, '[]'::json) AS comments`;

const postJoins = `
  FROM posts p
  JOIN usuarios u ON u.codigo_usu = p.codigo_usu
  LEFT JOIN perfil_usuario perfil ON perfil.codigo_usu = u.codigo_usu
  LEFT JOIN LATERAL (
    SELECT json_agg(
      json_build_object(
        'id', c.id_comentario,
        'authorId', c.codigo_usu,
        'usuario', cu.username,
        'avatar', UPPER(LEFT(cu.username, 1)),
        'texto', c.contenido,
        'hora', c.fecha_comentario,
        'createdAt', c.fecha_comentario
      ) ORDER BY c.fecha_comentario ASC, c.id_comentario ASC
    ) AS comentarios
    FROM comentarios c
    JOIN usuarios cu ON cu.codigo_usu = c.codigo_usu
    WHERE c.id_post = p.id_post AND c.estado = 'activo'
  ) comentarios ON TRUE`;

function normalizeContent(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeCategory(value) {
  const category = typeof value === "string" ? value.trim() : "";
  return category.slice(0, 80) || "General";
}

function isValidContent(content) {
  return content.length > 0 && content.length <= MAX_CONTENT_LENGTH;
}

async function getPostById(id, viewerId) {
  const { rows } = await pool.query(
    `SELECT ${postFields}
     ${postJoins}
     WHERE p.id_post = $2
       AND p.estado = 'activo'
       AND (p.visibilidad = 'publico' OR p.codigo_usu = $1::integer)`,
    [viewerId || null, id],
  );
  return rows[0] || null;
}

async function syncReactionTotal(client, postId) {
  await client.query(
    `UPDATE posts
        SET total_reacciones = COALESCE((
          SELECT SUM(CASE
            WHEN tipo_reaccion = 'like' THEN 1
            WHEN tipo_reaccion = 'dislike' THEN -1
            ELSE 0
          END)::integer
          FROM reacciones
          WHERE id_post = $1
        ), 0)
      WHERE id_post = $1`,
    [postId],
  );
}

async function obtenerPosts(req, res) {
  try {
    const viewerId = req.user?.id || null;
    const { rows } = await pool.query(
      `SELECT ${postFields}
       ${postJoins}
       WHERE p.estado = 'activo'
         AND (p.visibilidad = 'publico' OR p.codigo_usu = $1::integer)
       ORDER BY p.fecha_publicacion DESC, p.id_post DESC`,
      [viewerId],
    );

    res.json({ success: true, posts: rows });
  } catch (error) {
    console.error("Error obteniendo publicaciones:", error);
    res.status(500).json({ success: false, error: "No se pudieron obtener las publicaciones" });
  }
}

async function crearPost(req, res) {
  const contenido = normalizeContent(req.body.texto ?? req.body.contenido);
  const categoria = normalizeCategory(req.body.categoria ?? req.body.tipo_post);
  const visibilidad = req.body.visibilidad === "privado" ? "privado" : "publico";

  if (!isValidContent(contenido)) {
    return res.status(400).json({
      success: false,
      error: `La publicación debe tener entre 1 y ${MAX_CONTENT_LENGTH} caracteres.`,
    });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO posts (codigo_usu, contenido, tipo_post, visibilidad)
       VALUES ($1, $2, $3, $4)
       RETURNING id_post`,
      [req.user.id, contenido, categoria, visibilidad],
    );
    const post = await getPostById(rows[0].id_post, req.user.id);
    res.status(201).json({ success: true, post });
  } catch (error) {
    console.error("Error creando publicación:", error);
    res.status(500).json({
      success: false,
      error: "No se pudo crear la publicación.",
      details: error.message,
      code: error.code || null,
    });
  }
}

async function editarPost(req, res) {
  const contenido = normalizeContent(req.body.texto ?? req.body.contenido);
  const categoria = req.body.categoria ?? req.body.tipo_post;

  if (!isValidContent(contenido)) {
    return res.status(400).json({
      success: false,
      error: `La publicación debe tener entre 1 y ${MAX_CONTENT_LENGTH} caracteres.`,
    });
  }

  try {
    const { rows } = await pool.query(
      `UPDATE posts
          SET contenido = $1,
              tipo_post = COALESCE($2, tipo_post),
              fecha_actualizacion = NOW()
        WHERE id_post = $3 AND codigo_usu = $4 AND estado = 'activo'
        RETURNING id_post`,
      [contenido, categoria ? normalizeCategory(categoria) : null, req.params.id, req.user.id],
    );

    if (!rows.length) {
      return res.status(404).json({ success: false, error: "No tienes permiso para editar esta publicación." });
    }

    const post = await getPostById(rows[0].id_post, req.user.id);
    res.json({ success: true, post });
  } catch (error) {
    console.error("Error editando publicación:", error);
    res.status(500).json({ success: false, error: "No se pudo editar la publicación" });
  }
}

async function eliminarPost(req, res) {
  try {
    const { rowCount } = await pool.query(
      `UPDATE posts
          SET estado = 'eliminado', fecha_actualizacion = NOW()
        WHERE id_post = $1 AND codigo_usu = $2 AND estado = 'activo'`,
      [req.params.id, req.user.id],
    );

    if (!rowCount) {
      return res.status(404).json({ success: false, error: "No tienes permiso para eliminar esta publicación." });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Error eliminando publicación:", error);
    res.status(500).json({ success: false, error: "No se pudo eliminar la publicación" });
  }
}

async function obtenerComentarios(req, res) {
  try {
    const { rows } = await pool.query(
      `SELECT c.id_comentario AS id, c.codigo_usu AS "authorId", u.username AS usuario,
              UPPER(LEFT(u.username, 1)) AS avatar, c.contenido AS texto,
              c.fecha_comentario AS hora, c.fecha_comentario AS "createdAt"
         FROM comentarios c
         JOIN usuarios u ON u.codigo_usu = c.codigo_usu
        WHERE c.id_post = $1 AND c.estado = 'activo'
        ORDER BY c.fecha_comentario ASC, c.id_comentario ASC`,
      [req.params.id],
    );
    res.json({ success: true, comments: rows });
  } catch (error) {
    console.error("Error obteniendo comentarios:", error);
    res.status(500).json({ success: false, error: "No se pudieron obtener los comentarios" });
  }
}

async function crearComentario(req, res) {
  const contenido = normalizeContent(req.body.texto ?? req.body.contenido);
  if (!isValidContent(contenido)) {
    return res.status(400).json({ success: false, error: "Escribe un comentario válido." });
  }

  try {
    const exists = await pool.query(
      `SELECT 1 FROM posts WHERE id_post = $1 AND estado = 'activo'`,
      [req.params.id],
    );
    if (!exists.rows.length) {
      return res.status(404).json({ success: false, error: "La publicación ya no está disponible." });
    }

    const { rows } = await pool.query(
      `INSERT INTO comentarios (id_post, codigo_usu, contenido)
       VALUES ($1, $2, $3)
       RETURNING id_comentario AS id, fecha_comentario AS "createdAt"`,
      [req.params.id, req.user.id, contenido],
    );
    const user = await pool.query(`SELECT username FROM usuarios WHERE codigo_usu = $1`, [req.user.id]);
    const username = user.rows[0].username;
    res.status(201).json({
      success: true,
      comment: {
        ...rows[0],
        authorId: req.user.id,
        usuario: username,
        avatar: username.charAt(0).toUpperCase(),
        texto: contenido,
        hora: rows[0].createdAt,
      },
    });
  } catch (error) {
    console.error("Error creando comentario:", error);
    res.status(500).json({ success: false, error: "No se pudo crear el comentario" });
  }
}

async function reaccionarPost(req, res) {
  const reaction = REACTION_TYPES.get(req.body.type ?? req.body.reaccion);
  if (!reaction) {
    return res.status(400).json({ success: false, error: "La reacción debe ser 'up', 'down' o 'like'." });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const post = await client.query(
      `SELECT id_post FROM posts WHERE id_post = $1 AND estado = 'activo' FOR UPDATE`,
      [req.params.id],
    );
    if (!post.rows.length) {
      await client.query("ROLLBACK");
      return res.status(404).json({ success: false, error: "La publicación ya no está disponible." });
    }

    const existing = await client.query(
      `SELECT id_reaccion, tipo_reaccion
         FROM reacciones
        WHERE id_post = $1 AND codigo_usu = $2
        ORDER BY fecha_reaccion DESC, id_reaccion DESC
        LIMIT 1`,
      [req.params.id, req.user.id],
    );

    let userVote = reaction;
    if (existing.rows[0]?.tipo_reaccion === reaction) {
      await client.query(`DELETE FROM reacciones WHERE id_reaccion = $1`, [existing.rows[0].id_reaccion]);
      userVote = null;
    } else if (existing.rows.length) {
      await client.query(
        `UPDATE reacciones SET tipo_reaccion = $1, fecha_reaccion = NOW() WHERE id_reaccion = $2`,
        [reaction, existing.rows[0].id_reaccion],
      );
    } else {
      await client.query(
        `INSERT INTO reacciones (id_post, codigo_usu, tipo_reaccion) VALUES ($1, $2, $3)`,
        [req.params.id, req.user.id, reaction],
      );
    }

    await syncReactionTotal(client, req.params.id);
    const total = await client.query(`SELECT total_reacciones FROM posts WHERE id_post = $1`, [req.params.id]);
    await client.query("COMMIT");
    res.json({ success: true, likes: total.rows[0].total_reacciones, userVote });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error reaccionando a publicación:", error);
    res.status(500).json({ success: false, error: "No se pudo registrar la reacción" });
  } finally {
    client.release();
  }
}

async function alternarGuardado(req, res) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const post = await client.query(
      `SELECT 1 FROM posts WHERE id_post = $1 AND estado = 'activo'`,
      [req.params.id],
    );
    if (!post.rows.length) {
      await client.query("ROLLBACK");
      return res.status(404).json({ success: false, error: "La publicación ya no está disponible." });
    }

    const saved = await client.query(
      `SELECT id_guardado FROM guardados WHERE id_post = $1 AND codigo_usu = $2 LIMIT 1`,
      [req.params.id, req.user.id],
    );
    const isSaved = !saved.rows.length;
    if (isSaved) {
      await client.query(`INSERT INTO guardados (id_post, codigo_usu) VALUES ($1, $2)`, [req.params.id, req.user.id]);
    } else {
      await client.query(`DELETE FROM guardados WHERE id_guardado = $1`, [saved.rows[0].id_guardado]);
    }
    await client.query("COMMIT");
    res.json({ success: true, saved: isSaved });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error guardando publicación:", error);
    res.status(500).json({ success: false, error: "No se pudo actualizar el guardado" });
  } finally {
    client.release();
  }
}

module.exports = {
  obtenerPosts,
  crearPost,
  editarPost,
  eliminarPost,
  obtenerComentarios,
  crearComentario,
  reaccionarPost,
  alternarGuardado,
};
