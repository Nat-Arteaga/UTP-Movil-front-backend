const pool = require("../db");

const MAX_CONTENT_LENGTH = 2000;

// Mapa único: entrada del cliente ("up"/"down", o "like"/"dislike" por
// compatibilidad) -> valor que se guarda en la BD.
const REACTION_TYPES = new Map([
  ["up", "like"],
  ["like", "like"],
  ["down", "dislike"],
  ["dislike", "dislike"],
]);

// Mapa inverso: valor guardado en la BD -> lo que espera el frontend
// (post.userVote === "up" | "down"). Antes reaccionarPost devolvía
// directamente "like"/"dislike" y el frontend nunca hacía match contra
// "up"/"down", por eso la flechita nunca cambiaba de color aunque el
// contador sí se actualizaba.
const REACTION_LABELS = new Map([
  ["like", "up"],
  ["dislike", "down"],
]);

// Todas las fechas se devuelven como texto ISO-8601 con sufijo "Z"
// (UTC explícito) usando to_char en SQL, en vez de dejar que
// json_build_object serialice el timestamp "a su manera". Los timestamps
// de esta BD se guardan en hora UTC (proceso de Node y sesión de
// Postgres en UTC), así que solo hace falta declarar explícitamente esa
// zona horaria para que el celular no la reinterprete como hora local.
// Antes esto solo pasaba bien con las publicaciones (pg-node ya parsea
// esas columnas como UTC), pero los comentarios venían embebidos en un
// json_build_object que perdía esa información y el celular los mostraba
// desfasados según su propio huso horario.
const ISO_UTC = (column) => `to_char(${column}, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')`;

const postFields = `
  p.id_post AS id,
  p.codigo_usu AS "authorId",
  p.contenido AS texto,
  COALESCE(p.tipo_post, 'General') AS categoria,
  p.visibilidad AS visibilidad,
  p.media_url AS "mediaUrl",
  p.media_type AS "mediaType",
  ${ISO_UTC("p.fecha_publicacion")} AS "createdAt",
  ${ISO_UTC("p.fecha_actualizacion")} AS "updatedAt",
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
    SELECT CASE r.tipo_reaccion WHEN 'like' THEN 'up' WHEN 'dislike' THEN 'down' ELSE NULL END
    FROM reacciones r
    WHERE r.id_post = p.id_post AND r.codigo_usu = $1::integer
    ORDER BY r.fecha_reaccion DESC, r.id_reaccion DESC
    LIMIT 1
  ) AS "userVote",
  EXISTS(
    SELECT 1 FROM guardados g
    WHERE g.id_post = p.id_post AND g.codigo_usu = $1::integer
  ) AS saved,
  COALESCE(comentarios.comentarios, '[]'::json) AS comments,
  COALESCE(etiquetas.etiquetas, '[]'::json) AS etiquetas`;

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
        'hora', ${ISO_UTC("c.fecha_comentario")},
        'createdAt', ${ISO_UTC("c.fecha_comentario")}
      ) ORDER BY c.fecha_comentario ASC, c.id_comentario ASC
    ) AS comentarios
    FROM comentarios c
    JOIN usuarios cu ON cu.codigo_usu = c.codigo_usu
    WHERE c.id_post = p.id_post AND c.estado = 'activo'
  ) comentarios ON TRUE
  LEFT JOIN LATERAL (
    SELECT json_agg(et.nombre ORDER BY et.nombre ASC) AS etiquetas
    FROM post_etiquetas pe
    JOIN etiquetas et ON et.id_etiqueta = pe.id_etiqueta
    WHERE pe.id_post = p.id_post
  ) etiquetas ON TRUE`;

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

function normalizeMediaType(value) {
  return value === "imagen" || value === "video" ? value : null;
}

function normalizeMediaUrl(value) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

// Acepta un array de strings ("etiquetas") o un string separado por comas.
// Normaliza a minúsculas sin "#", recorta espacios y quita duplicados.
function normalizeTags(value) {
  const raw = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split(",")
      : [];

  const seen = new Set();
  const tags = [];
  for (const item of raw) {
    const tag = String(item ?? "").trim().replace(/^#/, "").toLowerCase().slice(0, 40);
    if (tag && !seen.has(tag)) {
      seen.add(tag);
      tags.push(tag);
    }
  }
  return tags.slice(0, 10);
}

// Reemplaza las etiquetas de un post: crea las que no existan en la tabla
// `etiquetas` (reutilizando las que ya existen por nombre) y reescribe la
// relación en `post_etiquetas`. Se ejecuta dentro de la misma transacción
// que crea/edita el post para que quede todo o nada.
async function syncPostTags(client, postId, tagNames) {
  await client.query(`DELETE FROM post_etiquetas WHERE id_post = $1`, [postId]);
  if (!tagNames.length) return;

  for (const nombre of tagNames) {
    const { rows } = await client.query(
      `INSERT INTO etiquetas (nombre) VALUES ($1)
       ON CONFLICT (nombre) DO UPDATE SET nombre = EXCLUDED.nombre
       RETURNING id_etiqueta`,
      [nombre],
    );
    await client.query(
      `INSERT INTO post_etiquetas (id_post, id_etiqueta) VALUES ($1, $2)
       ON CONFLICT DO NOTHING`,
      [postId, rows[0].id_etiqueta],
    );
  }
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
  const mediaUrl = normalizeMediaUrl(req.body.media_url ?? req.body.mediaUrl);
  const mediaType = mediaUrl ? normalizeMediaType(req.body.media_type ?? req.body.mediaType) : null;
  const etiquetas = normalizeTags(req.body.etiquetas ?? req.body.tags);

  if (!isValidContent(contenido)) {
    return res.status(400).json({
      success: false,
      error: `La publicación debe tener entre 1 y ${MAX_CONTENT_LENGTH} caracteres.`,
    });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { rows } = await client.query(
      `INSERT INTO posts (codigo_usu, contenido, tipo_post, visibilidad, media_url, media_type)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id_post`,
      [req.user.id, contenido, categoria, visibilidad, mediaUrl, mediaType],
    );
    await syncPostTags(client, rows[0].id_post, etiquetas);
    await client.query("COMMIT");

    const post = await getPostById(rows[0].id_post, req.user.id);
    res.status(201).json({ success: true, post });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error creando publicación:", error);
    res.status(500).json({
      success: false,
      error: "No se pudo crear la publicación.",
      details: error.message,
      code: error.code || null,
    });
  } finally {
    client.release();
  }
}

async function editarPost(req, res) {
  const contenido = normalizeContent(req.body.texto ?? req.body.contenido);
  const categoria = req.body.categoria ?? req.body.tipo_post;
  const mediaProvided = req.body.media_url !== undefined || req.body.mediaUrl !== undefined;
  const mediaUrl = normalizeMediaUrl(req.body.media_url ?? req.body.mediaUrl);
  const mediaType = mediaUrl ? normalizeMediaType(req.body.media_type ?? req.body.mediaType) : null;
  const tagsProvided = req.body.etiquetas !== undefined || req.body.tags !== undefined;
  const etiquetas = normalizeTags(req.body.etiquetas ?? req.body.tags);

  if (!isValidContent(contenido)) {
    return res.status(400).json({
      success: false,
      error: `La publicación debe tener entre 1 y ${MAX_CONTENT_LENGTH} caracteres.`,
    });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { rows } = await client.query(
      `UPDATE posts
          SET contenido = $1,
              tipo_post = COALESCE($2, tipo_post),
              media_url = CASE WHEN $5 THEN $6 ELSE media_url END,
              media_type = CASE WHEN $5 THEN $7 ELSE media_type END,
              fecha_actualizacion = NOW()
        WHERE id_post = $3 AND codigo_usu = $4 AND estado = 'activo'
        RETURNING id_post`,
      [contenido, categoria ? normalizeCategory(categoria) : null, req.params.id, req.user.id, mediaProvided, mediaUrl, mediaType],
    );

    if (!rows.length) {
      await client.query("ROLLBACK");
      return res.status(404).json({ success: false, error: "No tienes permiso para editar esta publicación." });
    }

    if (tagsProvided) {
      await syncPostTags(client, rows[0].id_post, etiquetas);
    }
    await client.query("COMMIT");

    const post = await getPostById(rows[0].id_post, req.user.id);
    res.json({ success: true, post });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error editando publicación:", error);
    res.status(500).json({ success: false, error: "No se pudo editar la publicación" });
  } finally {
    client.release();
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
              ${ISO_UTC("c.fecha_comentario")} AS hora, ${ISO_UTC("c.fecha_comentario")} AS "createdAt"
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
       RETURNING id_comentario AS id, ${ISO_UTC("fecha_comentario")} AS "createdAt"`,
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

    let userVote = REACTION_LABELS.get(reaction);
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
