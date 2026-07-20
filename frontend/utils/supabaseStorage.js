// Mismo proyecto de Supabase Storage que ya usa EditarPerfil.jsx para las
// fotos de perfil (bucket "avatars"). Aquí se sube el contenido multimedia
// de las publicaciones (fotos y videos) a un bucket separado.
//
// IMPORTANTE: el bucket "publicaciones" debe existir en el panel de
// Supabase Storage (público, con inserts permitidos), igual que ya existe
// el bucket "avatars". No se puede crear un bucket nuevo solo con la
// anon key: hay que crearlo una vez desde el dashboard de Supabase.
const SUPABASE_URL = "https://inrrylewaerumbpfrxqp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlucnJ5bGV3YWVydW1icGZyeHFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5MDU3NTEsImV4cCI6MjA5OTQ4MTc1MX0.EBZq_kwpJDiG_W7acMj7J32D_LFy_dx4GcZwGauU1jI";
const BUCKET_PUBLICACIONES = "publicaciones";

function extensionFromUri(uri, fallback) {
  const match = /\.([a-zA-Z0-9]+)(\?|$)/.exec(uri || "");
  return (match?.[1] || fallback).toLowerCase();
}

/**
 * Sube una imagen o video (uri local del picker de Expo) a Supabase
 * Storage y devuelve la URL pública final.
 *
 * @param {string} uriLocal - uri devuelta por expo-image-picker
 * @param {"imagen"|"video"} tipo
 * @param {number|string} userId - para armar un nombre de archivo único
 */
export async function subirMediaPublicacion(uriLocal, tipo, userId) {
  const isVideo = tipo === "video";
  const ext = extensionFromUri(uriLocal, isVideo ? "mp4" : "jpg");
  const contentType = isVideo ? `video/${ext === "mov" ? "quicktime" : ext}` : `image/${ext === "jpg" ? "jpeg" : ext}`;
  const nombreArchivo = `${userId}-${Date.now()}.${ext}`;
  const uploadUrl = `${SUPABASE_URL}/storage/v1/object/${BUCKET_PUBLICACIONES}/${nombreArchivo}`;

  const respuestaArchivo = await fetch(uriLocal);
  const blob = await respuestaArchivo.blob();

  const resultado = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": contentType,
      "x-upsert": "true",
    },
    body: blob,
  });

  if (!resultado.ok) {
    const detalle = await resultado.text();
    throw new Error(`No se pudo subir el archivo (${resultado.status}): ${detalle}`);
  }

  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_PUBLICACIONES}/${nombreArchivo}?t=${Date.now()}`;
}
