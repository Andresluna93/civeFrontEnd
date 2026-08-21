import { useState, useEffect } from "react";
import { Phone, User, RefreshCw, AlertCircle } from "lucide-react";
import { contactosAPI } from "../../services/services";

const ListaContactos = () => {
  const [contactos, setContactos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarContactos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await contactosAPI.listar();
      console.log("Contactos cargados:", data);
      setContactos(data);
    } catch (err) {
      console.error("Error al cargar contactos:", err);
      setError("No se pudo cargar la lista de contactos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarContactos();
  }, []);

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-display font-bold text-gray-800">
          Contactos
        </h2>
        <button
          onClick={cargarContactos}
          disabled={loading}
          className="btn-secondary flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Actualizar
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" />
        </div>
      ) : error ? (
        <div className="card flex items-center gap-3 text-red-600">
          <AlertCircle className="w-6 h-6 flex-shrink-0" />
          <p>{error}</p>
        </div>
      ) : contactos.length === 0 ? (
        <div className="card text-center py-12 text-gray-400">
          <User className="w-12 h-12 mx-auto mb-3" />
          <p>No hay contactos registrados.</p>
        </div>
      ) : (
        <div className="card overflow-hidden p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b text-left">
                <th className="px-6 py-3 font-semibold text-gray-600">
                  <User className="w-4 h-4 inline mr-2" />
                  Nombre
                </th>
                <th className="px-6 py-3 font-semibold text-gray-600">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Teléfono
                </th>
              </tr>
            </thead>
            <tbody>
              {contactos.map((contacto, i) => (
                <tr
                  key={contacto._id ?? i}
                  className="border-b last:border-0 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-gray-800 font-medium">
                    {contacto.nombres} {contacto.apellidos}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{contacto.telefono}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-gray-400 px-6 py-3 border-t">
            {contactos.length} contacto{contactos.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}
    </section>
  );
};

export default ListaContactos;
