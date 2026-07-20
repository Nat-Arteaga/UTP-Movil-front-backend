const pool = require("../db");

function getBearerToken(req) {
  const header = req.headers.authorization || "";
  return header.startsWith("Bearer ") ? header.slice(7).trim() : null;
}

async function findSession(token) {
  if (!token) return null;

  const { rows } = await pool.query(
    `SELECT codigo_usu
       FROM sesiones
      WHERE token = $1
        AND activo = true
        AND (fecha_expiracion IS NULL OR fecha_expiracion > NOW())
      LIMIT 1`,
    [token],
  );

  return rows[0] || null;
}

async function optionalAuth(req, res, next) {
  try {
    const session = await findSession(getBearerToken(req));
    req.user = session ? { id: session.codigo_usu } : null;
    next();
  } catch (error) {
    console.error("Error validando la sesión del feed:", error);
    res.status(500).json({
      success: false,
      error: "No fue posible validar tu sesión.",
      details: error.message,
    });
  }
}

async function requireAuth(req, res, next) {
  try {
    const session = await findSession(getBearerToken(req));
    if (!session) {
      return res.status(401).json({
        success: false,
        error: "Tu sesión no es válida o expiró. Inicia sesión nuevamente.",
      });
    }

    req.user = { id: session.codigo_usu };
    next();
  } catch (error) {
    console.error("Error validando la sesión del feed:", error);
    res.status(500).json({
      success: false,
      error: "No fue posible validar tu sesión.",
      details: error.message,
    });
  }
}

module.exports = { optionalAuth, requireAuth };
