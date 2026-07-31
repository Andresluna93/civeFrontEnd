import { useState, useEffect, useRef } from "react";
import { Search, MessageSquare } from "lucide-react";
import { chatsAPI } from "../../services/services";

const Avatar = ({ nombre }) => (
  <div className="w-12 h-12 rounded-full bg-[oklch(62.3%_0.214_259.815)] flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
    {nombre?.charAt(0).toUpperCase() ?? "?"}
  </div>
);

const formatHora = (fecha) => {
  if (!fecha) return "";
  const d = new Date(fecha);
  const hoy = new Date();
  const esHoy =
    d.getDate() === hoy.getDate() &&
    d.getMonth() === hoy.getMonth() &&
    d.getFullYear() === hoy.getFullYear();
  return esHoy
    ? d.toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit" })
    : d.toLocaleDateString("es-EC", { day: "2-digit", month: "2-digit" });
};

const fechaClave = (fecha) => new Date(fecha).toDateString();

const etiquetaFecha = (fecha) => {
  const d = new Date(fecha);
  const hoy = new Date();
  const diffDias = Math.floor(
    (hoy.setHours(0, 0, 0, 0) - d.setHours(0, 0, 0, 0)) / 86400000,
  );
  if (diffDias === 0) return "Hoy";
  if (diffDias === 1) return "Ayer";
  if (diffDias < 7) return d.toLocaleDateString("es-EC", { weekday: "long" });
  return new Date(fecha).toLocaleDateString("es-EC", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const ListaMensajes = () => {
  const [chats, setChats] = useState([]);
  const [chatActivo, setChatActivo] = useState(null);
  const [mensajes, setMensajes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMensajes, setLoadingMensajes] = useState(false);
  const mensajesEndRef = useRef(null);

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await chatsAPI.listar();
        console.log(data);
        setChats(data.data ?? []);
      } catch (error) {
        console.error("Error cargando chats:", error);
      } finally {
        setLoadingChats(false);
      }
    };
    cargar();
  }, []);

  useEffect(() => {
    if (!chatActivo) return;
    const cargarMensajes = async () => {
      setLoadingMensajes(true);
      try {
        const data = await chatsAPI.mensajes(chatActivo.wa_id);
        console.log("useEffect: ", data);
        const historialCombinado = (data.data ?? [])
          .flatMap((registro) => registro.historial ?? [])
          .sort(
            (a, b) =>
              new Date(a.fecha ?? a.timestamp) -
              new Date(b.fecha ?? b.timestamp),
          );
        setMensajes(historialCombinado);
      } catch (error) {
        console.error("Error cargando mensajes:", error);
        setMensajes([]);
      } finally {
        setLoadingMensajes(false);
      }
    };
    cargarMensajes();
  }, [chatActivo]);

  useEffect(() => {
    mensajesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  const chatsFiltrados = chats.filter((c) =>
    c.name?.toLowerCase().includes(busqueda.toLowerCase()),
  );

  return (
    <div className="flex h-[calc(100vh-100px)] rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
      {/* Panel izquierdo */}
      <div className="w-80 flex-shrink-0 flex flex-col border-r border-gray-200 bg-white">
        <div className="px-4 py-3 bg-[oklch(62.3%_0.214_259.815)]">
          <p className="text-white font-semibold">Mensajes</p>
        </div>

        <div className="px-3 py-2 bg-[#f0f2f5]">
          <div className="flex items-center bg-white rounded-lg px-3 gap-2">
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Buscar..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full py-2 text-sm outline-none bg-transparent"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loadingChats ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-[oklch(62.3%_0.214_259.815)] border-t-transparent" />
            </div>
          ) : chatsFiltrados.length === 0 ? (
            <p className="text-center text-gray-400 py-10 text-sm">
              Sin conversaciones
            </p>
          ) : (
            chatsFiltrados.map((chat) => (
              <button
                key={chat._id}
                onClick={() => setChatActivo(chat)}
                className={`w-full flex items-center gap-3 px-4 py-3 border-b border-gray-100 hover:bg-[#f5f6f6] transition-colors text-left ${
                  chatActivo?._id === chat._id ? "bg-[#ebebeb]" : ""
                }`}
              >
                <Avatar nombre={chat.name} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {chat.name}
                    </p>
                    <span className="text-[11px] text-gray-400 ml-2 flex-shrink-0">
                      {formatHora(chat.ultimoMensaje?.fecha)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-400 truncate flex-1">
                      {chat.ultimoMensaje?.texto ?? ""}
                    </p>
                    {chat.noLeidos > 0 && (
                      <span className="ml-2 flex-shrink-0 w-5 h-5 rounded-full bg-[#25d366] text-white text-[10px] font-bold flex items-center justify-center">
                        {chat.noLeidos}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Panel derecho */}
      <div className="flex-1 flex flex-col bg-[#efeae2]">
        {!chatActivo ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-3">
            <MessageSquare className="w-16 h-16 opacity-30" />
            <p className="text-sm">Selecciona una conversación</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 px-4 py-3 bg-[#f0f2f5] border-b border-gray-200">
              <Avatar nombre={chatActivo.name} />
              <div>
                <p className="font-semibold text-gray-800 text-sm">
                  {chatActivo.name}
                </p>
                <p className="text-xs text-gray-400">{chatActivo.wa_id}</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
              {loadingMensajes ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-[oklch(62.3%_0.214_259.815)] border-t-transparent" />
                </div>
              ) : mensajes.length === 0 ? (
                <p className="text-center text-gray-400 text-sm py-10">
                  Sin mensajes
                </p>
              ) : (
                mensajes.map((msg, i) => {
                  const enviado =
                    msg.enviadoPor === "agente" || msg.enviadoPor === "bot";
                  const fechaActual = fechaClave(msg.fecha ?? msg.timestamp);
                  const fechaAnterior =
                    i > 0
                      ? fechaClave(
                          mensajes[i - 1].fecha ?? mensajes[i - 1].timestamp,
                        )
                      : null;
                  const mostrarEtiqueta = fechaActual !== fechaAnterior;
                  return (
                    <div key={msg._id ?? i}>
                      {mostrarEtiqueta && (
                        <div className="flex justify-center my-3">
                          <span className="bg-[#e1f0fb] text-gray-500 text-[11px] px-3 py-1 rounded-full shadow-sm capitalize">
                            {etiquetaFecha(msg.fecha ?? msg.timestamp)}
                          </span>
                        </div>
                      )}
                      <div
                        className={`flex ${enviado ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] px-3 py-2 rounded-lg shadow-sm text-sm whitespace-pre-wrap ${
                            enviado
                              ? "bg-[#d9fdd3] text-gray-800 rounded-br-none"
                              : "bg-white text-gray-800 rounded-bl-none"
                          }`}
                        >
                          <p>{msg.texto ?? msg.mensaje ?? msg.contenido}</p>
                          <p className="text-[10px] text-gray-400 text-right mt-1">
                            {formatHora(msg.fecha ?? msg.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={mensajesEndRef} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ListaMensajes;
