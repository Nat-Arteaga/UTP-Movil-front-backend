// Formatea una fecha (string ISO-8601 UTC o timestamp) como tiempo relativo
// en español: "Hace unos segundos", "Hace 3 minutos", "Hace 2 horas",
// "Hace 1 día", etc. Se usa tanto para publicaciones como para
// comentarios, para que ambos se comporten exactamente igual.
export function formatRelativeTime(value) {
  if (!value) return "";

  const timestamp = typeof value === "number" ? value : new Date(value).getTime();
  if (Number.isNaN(timestamp)) return "";

  const diffSeconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));

  if (diffSeconds < 60) return "Hace unos segundos";

  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return `Hace ${diffMinutes} minuto${diffMinutes === 1 ? "" : "s"}`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `Hace ${diffHours} hora${diffHours === 1 ? "" : "s"}`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `Hace ${diffDays} día${diffDays === 1 ? "" : "s"}`;

  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks < 5) return `Hace ${diffWeeks} semana${diffWeeks === 1 ? "" : "s"}`;

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `Hace ${diffMonths} mes${diffMonths === 1 ? "" : "es"}`;

  const diffYears = Math.floor(diffDays / 365);
  return `Hace ${diffYears} año${diffYears === 1 ? "" : "s"}`;
}
