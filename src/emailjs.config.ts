// Credenciales de EmailJS.
// Estos tres valores son PÚBLICOS (viajan al navegador de todas formas),
// así que es seguro dejarlos en el repo. NUNCA pongas aquí la Private Key.
// Si existe un archivo .env con VITE_EMAILJS_*, esos valores tienen prioridad.
export const EMAILJS = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_3gmbqe5",
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "template_jom9061",
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "uBnsbJKyuFnPp_vX_",
}
