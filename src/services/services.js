import axios from "axios";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
  //withCredentials: true // Para enviar cookies
});

// ==================== CITAS PÚBLICAS ====================

export const citasAPI = {
  // Crear nueva cita (público)
  crear: async (datosCita) => {
    const response = await api.post("/agenda/registrar", datosCita);
    return response.data;
  },
};

export const citashAPI = {
  // Crear nueva cita (público)
  crear: async (datosCita) => {
    const response = await api.post("/agenda/registrarh", datosCita);
    return response.data;
  },
};

// ==================== ADMIN ====================

const adminApi = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

// Instancia dedicada para envío de archivos (multipart/form-data).
// No se fija "Content-Type" a mano: al pasar un FormData, el navegador
// agrega el header con el boundary correcto automáticamente. Si se
// setea "multipart/form-data" manualmente, el boundary se pierde y el
// backend no puede parsear el archivo.
const adminApiMultipart = axios.create({
  baseURL: "/api",
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
});

export const userApi = {
  login: async (data) => {
    const response = await adminApi.post("/authUser/login", data);
    return response.data;
  },
  logout: async () => {
    const response = await adminApi.post("/authUser/logout");
    return response;
  },
  registrar: async (data) => {
    const response = await adminApi.post("/authUser/registerParticipant", data);
    return response.data;
  },
  dashboard: async () => {
    const response = await adminApi.get("/authUser/dashboard");
    return response.data;
  },
  getAllUsers: async () => {
    const response = await adminApi.get("/authUser/getUsers");
    return response.data;
  },
};

export const contactosAPI = {
  listar: async () => {
    const response = await adminApi.get("/contactos");
    return response.data;
  },
  registrar: async (data) => {
    const response = await adminApi.post("/contactos/register", data);
    return response.data;
  },
  importListado: async (formData) => {
    const response = await adminApiMultipart.post(
      "/contactos/importar",
      formData,
    );
    return response.data;
  },
};

export const chatsAPI = {
  listar: async () => {
    const response = await adminApi.get("/chats/listarmensajes");
    return response.data;
  },
  mensajes: async (wa_id) => {
    const response = await adminApi.get(`/chats/${wa_id}/historial`);
    return response.data;
  },
  enviarMensaje: async (wa_id, mensaje) => {
    const response = await adminApi.post(`/chats/${wa_id}/enviar`, { mensaje });
    return response.data;
  },
  toggleModoHumano: async (wa_id, modo) => {
    const response = await adminApi.put(`/chats/${wa_id}/modo`, { modo });
    return response.data;
  },
};

export const CampanaMarketingAPI = {
  enviarTemplate: async (data) => {
    const response = await adminApi.post(
      "/campanaMarketing/sendTemplate",
      data,
    );
    return response;
  },
  enviarUsersTemplate: async (formData) => {
    const response = await adminApiMultipart.post(
      "/campanaMarketing/sendTemplateArchivo",
      formData,
    );
    return response;
  },
};

export const TemplatesApi = {
  getAllTemplates: async () => {
    const response = await adminApi.get("/plantillas");
    return response.data;
  },
  updateListTemplate: async () => {
    const response = await adminApi.post("/plantillas/sincronizar");
    return response;
  },
};

export const EstadosMensajesApi = {
  getStatus: async (id) => {
    const response = await adminApi.get(`/estadosMensajes?plantilla=${id}`);
    return response.data;
  },
};
