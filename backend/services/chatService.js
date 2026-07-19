const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// ─────────────────────────────────────────────────────────────
// REPORTES (en memoria por ahora — pendiente migrar a reportes_sae)
// ─────────────────────────────────────────────────────────────
const reportes = new Map();

function reportarMensaje(msgId, chatId) {
  const key = `${chatId}_${msgId}`;
  const actual = (reportes.get(key) || 0) + 1;
  reportes.set(key, actual);
  return { eliminado: actual >= 5, reportes: actual };
}

// ─────────────────────────────────────────────────────────────
// CHATS / CONTACTOS (100% BD: grupos + privados)
// ─────────────────────────────────────────────────────────────
async function getChatsDeUsuario(userId) {
  try {
    const res = await pool.query(
      `SELECT 
        c.id_chat AS id,
        CASE 
          WHEN c.tipo_chat = 'privado' THEN u2.username
          ELSE c.nombre
        END AS nombre,
        CASE 
          WHEN c.tipo_chat = 'privado' THEN 'amigo'
          ELSE 'grupo'
        END AS tipo,
        COALESCE(u2.estado, 'Ausente') AS estado,
        0 AS "mensajesNoLeidos"
      FROM participantes_chat pc
      JOIN chats c ON c.id_chat = pc.id_chat
      LEFT JOIN chats_privados cp ON cp.id_chat = c.id_chat
      LEFT JOIN usuarios u2 ON (
        (u2.codigo_usu = cp.id_usuario_1 AND cp.id_usuario_1 != $1)
        OR
        (u2.codigo_usu = cp.id_usuario_2 AND cp.id_usuario_2 != $1)
      )
      WHERE pc.codigo_usu = $1 AND pc.estado = 'activo'
      ORDER BY c.tipo_chat DESC`,
      [userId]
    );
    return res.rows;
  } catch (err) {
    console.error("[getChatsDeUsuario] Error:", err.message);
    return []; // si falla la query, no reventar el servidor
  }
}

// Obtiene (o crea) el chat privado entre dos usuarios
async function obtenerOCrearChatPrivado(userId1, userId2) {
  const existente = await pool.query(
    `
    SELECT id_chat FROM chats_privados
    WHERE (id_usuario_1 = $1 AND id_usuario_2 = $2)
       OR (id_usuario_1 = $2 AND id_usuario_2 = $1)
    `,
    [userId1, userId2]
  );

  if (existente.rows.length > 0) {
    return existente.rows[0].id_chat;
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const chat = await client.query(
      `INSERT INTO chats (nombre, tipo_chat, creado_por)
       VALUES (NULL, 'privado', $1)
       RETURNING id_chat`,
      [userId1]
    );
    const idChat = chat.rows[0].id_chat;

    await client.query(
      `INSERT INTO chats_privados (id_chat, id_usuario_1, id_usuario_2)
       VALUES ($1, $2, $3)`,
      [idChat, userId1, userId2]
    );

    await client.query("COMMIT");
    return idChat;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

// ─────────────────────────────────────────────────────────────
// GRUPOS: crear y unirse por código de invitación
// ─────────────────────────────────────────────────────────────
function generarCodigoInvitacion() {
  // Código legible: 6 caracteres, sin 0/O/1/I para evitar confusión
  const alfabeto = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let codigo = "";
  for (let i = 0; i < 6; i++) {
    codigo += alfabeto[Math.floor(Math.random() * alfabeto.length)];
  }
  return codigo;
}

async function crearGrupo({ nombre, descripcion, creadorId }) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Reintenta si por mala suerte el código generado ya existe (es UNIQUE)
    let idChat, codigo;
    for (let intento = 0; intento < 5; intento++) {
      codigo = generarCodigoInvitacion();
      try {
        const res = await client.query(
          `INSERT INTO chats (nombre, descripcion, tipo_chat, creado_por, codigo_invitacion)
           VALUES ($1, $2, 'grupo', $3, $4)
           RETURNING id_chat`,
          [nombre, descripcion || null, creadorId, codigo]
        );
        idChat = res.rows[0].id_chat;
        break;
      } catch (err) {
        if (err.code === "23505" && intento < 4) continue; // unique_violation → reintenta
        throw err;
      }
    }

    await client.query(
      `INSERT INTO participantes_chat (id_chat, codigo_usu, rol)
       VALUES ($1, $2, 'admin')`,
      [idChat, creadorId]
    );

    await client.query("COMMIT");
    return { idChat, codigo, nombre };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

async function unirseGrupoConCodigo({ codigo, userId }) {
  const grupo = await pool.query(
    `SELECT id_chat, nombre FROM chats WHERE codigo_invitacion = $1 AND tipo_chat = 'grupo'`,
    [(codigo || "").toUpperCase()]
  );

  if (grupo.rows.length === 0) {
    const err = new Error("Código de invitación inválido");
    err.status = 404;
    throw err;
  }

  const { id_chat: idChat, nombre } = grupo.rows[0];

  const yaEsParticipante = await pool.query(
    `SELECT 1 FROM participantes_chat WHERE id_chat = $1 AND codigo_usu = $2`,
    [idChat, userId]
  );

  if (yaEsParticipante.rows.length === 0) {
    await pool.query(
      `INSERT INTO participantes_chat (id_chat, codigo_usu) VALUES ($1, $2)`,
      [idChat, userId]
    );
  }

  return { idChat, nombre };
}

// ─────────────────────────────────────────────────────────────
// MENSAJES (100% BD, genérico para cualquier chatId)
// ─────────────────────────────────────────────────────────────
async function getMensajes(chatId) {
  const res = await pool.query(
    `SELECT
      m.id_mensaje AS id,
      m.id_chat AS "chatId",
      m.contenido AS texto,
      TO_CHAR(m.fecha_envio, 'HH12:MI AM') AS hora,
      m.codigo_usu AS "remitenteId",
      u.username AS remitente,
      m.eliminado,
      false AS mio
    FROM mensajes m
    JOIN usuarios u ON u.codigo_usu = m.codigo_usu
    WHERE m.id_chat = $1 AND m.eliminado = false
    ORDER BY m.fecha_envio ASC
    LIMIT 50`,
    [chatId]
  );
  return res.rows;
}

async function guardarMensaje({ chatId, texto, remitenteId, remitente }) {
  const res = await pool.query(
    `INSERT INTO mensajes (id_chat, codigo_usu, contenido, tipo_mensaje)
     VALUES ($1, $2, $3, 'texto')
     RETURNING id_mensaje AS id, id_chat AS "chatId", contenido AS texto,
               TO_CHAR(fecha_envio, 'HH12:MI AM') AS hora, codigo_usu AS "remitenteId"`,
    [chatId, remitenteId, texto]
  );
  const msg = res.rows[0];
  return {
    ...msg,
    remitente: remitente || "Usuario",
    mio: false,
    eliminado: false,
  };
}

// ─────────────────────────────────────────────────────────────
// BÚSQUEDA DE USUARIOS
// ─────────────────────────────────────────────────────────────
async function buscarUsuarios(query) {
  const res = await pool.query(
    `SELECT codigo_usu AS id, username, estado
     FROM usuarios
     WHERE LOWER(username) LIKE $1
     LIMIT 20`,
    [`%${(query || "").toLowerCase()}%`]
  );
  return res.rows;
}

// ─────────────────────────────────────────────────────────────
// PRESENCIA
// ─────────────────────────────────────────────────────────────
async function actualizarPresencia(userId, estado) {
  await pool.query(
    `UPDATE usuarios SET ultima_conexion = NOW(), estado = $1 WHERE codigo_usu = $2`,
    [estado === "En línea" ? "activo" : "inactivo", userId]
  );
}

module.exports = {
  getChatsDeUsuario,
  obtenerOCrearChatPrivado,
  crearGrupo,
  unirseGrupoConCodigo,
  getMensajes,
  guardarMensaje,
  buscarUsuarios,
  actualizarPresencia,
  reportarMensaje,
};