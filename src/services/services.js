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

export const userApi = {
  login: async (data) => {
    const response = await adminApi.post("/authUser/findUser", data);
    return response.data;
  },
  registrar: async (data) => {
    const response = await adminApi.post("/authUser/registerParticipant", data);
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
  importListado: async (data, config) => {
    const response = await adminApi.post("/contactos/importar", data, config);
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
