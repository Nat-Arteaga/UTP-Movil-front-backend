// Para desarrollo local define EXPO_PUBLIC_API_URL, por ejemplo:
// EXPO_PUBLIC_API_URL=http://192.168.1.5:3000
// Sin esa variable se usa el backend publicado.
const configuredUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
export const API_URL = (configuredUrl || "https://front-backend-utp-movil-production.up.railway.app").replace(/\/$/, "");

function getErrorMessage(data, fallback) {
  if (data?.error && data?.details) return `${data.error} Detalle: ${data.details}`;
  return data?.error || data?.message || data?.details || fallback;
}

async function request(path, { method = "GET", token, body } = {}) {
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        Accept: "application/json",
        ...(body ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
  } catch (networkError) {
    throw new Error(`No se pudo conectar con el backend (${API_URL}). ${networkError.message}`);
  }

  const rawBody = await response.text();
  let data = null;
  try {
    data = rawBody ? JSON.parse(rawBody) : {};
  } catch {
    data = null;
  }

  if (!response.ok || !data?.success) {
    const routeHint = response.status === 404
      ? `El backend en ${API_URL} no tiene la ruta ${method} ${path}. Despliega la versión más reciente del backend.`
      : `Error HTTP ${response.status || "desconocido"}.`;
    throw new Error(getErrorMessage(data, routeHint));
  }

  return data;
}

export const feedApi = {
  getPosts: (token) => request("/api/posts", { token }),
  createPost: (token, post) => request("/api/posts", {
    method: "POST",
    token,
    // El controlador acepta texto/contenido y categoria/tipo_post. Se envía
    // explícitamente el contrato de la pantalla para evitar valores undefined.
    body: {
      texto: post.texto ?? post.contenido,
      categoria: post.categoria ?? post.tipo_post ?? "General",
      ...(post.visibilidad ? { visibilidad: post.visibilidad } : {}),
      ...(post.mediaUrl ? { media_url: post.mediaUrl, media_type: post.mediaType } : {}),
      ...(post.etiquetas ? { etiquetas: post.etiquetas } : {}),
    },
  }),
  updatePost: (token, id, post) => request(`/api/posts/${id}`, { method: "PUT", token, body: post }),
  deletePost: (token, id) => request(`/api/posts/${id}`, { method: "DELETE", token }),
  addComment: (token, id, texto) => request(`/api/posts/${id}/comentarios`, { method: "POST", token, body: { texto } }),
  react: (token, id, type) => request(`/api/posts/${id}/reacciones`, { method: "POST", token, body: { type } }),
  toggleSaved: (token, id) => request(`/api/posts/${id}/guardado`, { method: "POST", token }),
};
