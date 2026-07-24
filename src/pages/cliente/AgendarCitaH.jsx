import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  CreditCard,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Search,
  X,
  Star,
  UserCircle,
  HeartPulse,
} from "lucide-react";
import toast from "react-hot-toast";
import DatePicker, { registerLocale } from "react-datepicker";
import es from "date-fns/locale/es";
import { format, addDays } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import { citasAPI, citashAPI } from "../../services/services";
import { useParams } from "react-router-dom";

//import { useServicios, useCitas, useAsesores } from '../../hooks/useServicios';
//import { asesoresAPI } from '../../services/api';

registerLocale("es", es);

// ==================== COMPONENTES AUXILIARES ====================

const Header = () => (
  <header className="bg-solid-head text-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <HeartPulse className="w-8 h-8" />
          <div>
            <h1 className="text-2xl font-display font-bold">
              Centro de Especialidades
            </h1>
            <p className="text-white/80 text-sm">
              Tu bienestar, nuestra compromiso
            </p>
          </div>
        </div>
      </div>
    </div>
  </header>
);

const Stepper = ({ currentStep, steps }) => (
  <div className="flex items-center justify-center py-8 px-4 overflow-x-auto">
    {steps.map((step, index) => (
      <div key={index} className="flex items-center">
        <div className="flex flex-col items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
              index < currentStep
                ? "bg-green-500 text-white"
                : index === currentStep
                  ? "bg-primary-500 text-white shadow-lg"
                  : "bg-gray-200 text-gray-500"
            }`}
          >
            {index < currentStep ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              index + 1
            )}
          </div>
          <span
            className={`text-xs mt-2 hidden sm:block font-medium whitespace-nowrap ${
              index <= currentStep ? "text-primary-600" : "text-gray-400"
            }`}
          >
            {step}
          </span>
        </div>
        {index < steps.length - 1 && (
          <div
            className={`w-8 sm:w-16 h-1 mx-1 sm:mx-2 rounded-full transition-all duration-300 ${
              index < currentStep ? "bg-green-500" : "bg-gray-200"
            }`}
          />
        )}
      </div>
    ))}
  </div>
);

const ServiceCard = ({ servicio, selected, onSelect }) => (
  <div
    onClick={() => onSelect(servicio)}
    className={`card cursor-pointer border-2 transition-all duration-300 ${selected ? "border-primary-500 bg-primary-50/50 shadow-medium" : "border-transparent hover:border-primary-200 hover:-translate-y-1"}`}
  >
    <div className="flex justify-between items-start mb-3">
      <h3 className="font-semibold text-gray-800">{servicio.nombre}</h3>
      {selected && <CheckCircle className="w-5 h-5 text-primary-500" />}
    </div>
    <p className="text-sm text-gray-500 mb-4 line-clamp-2">
      {servicio.descripcionCorta || servicio.descripcion}
    </p>
    <div className="flex items-center justify-between">
      <span className="text-primary-600 font-bold">
        ${servicio.precio?.base}
        {servicio.precio?.maximo && ` - $${servicio.precio.maximo}`}
      </span>
      <span className="text-xs text-gray-400 flex items-center">
        <Clock className="w-3 h-3 mr-1" />
        {servicio.duracion?.estandar} min
      </span>
    </div>
  </div>
);

const AsesorCard = ({ asesor, selected, onSelect }) => (
  <div
    onClick={() => onSelect(asesor)}
    className={`card cursor-pointer border-2 transition-all duration-300 ${selected ? "border-primary-500 bg-primary-50/50 shadow-medium" : "border-transparent hover:border-primary-200 hover:-translate-y-1"}`}
  >
    <div className="flex items-center gap-4">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: asesor.color || "#E8B4BC" }}
      >
        {asesor.fotoUrl ? (
          <img
            src={asesor.fotoUrl}
            alt={asesor.nombres}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <UserCircle className="w-10 h-10 text-white" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-800 truncate">
            {asesor.nombres} {asesor.apellidos}
          </h3>
          {selected && (
            <CheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0" />
          )}
        </div>
        <p className="text-sm text-primary-600">
          {asesor.cargo || "Esteticista"}
        </p>
        {asesor.estadisticas?.calificacionPromedio > 0 && (
          <div className="flex items-center gap-1 mt-1">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm text-gray-600">
              {asesor.estadisticas.calificacionPromedio.toFixed(1)}
            </span>
            <span className="text-xs text-gray-400">
              ({asesor.estadisticas.totalCalificaciones})
            </span>
          </div>
        )}
      </div>
    </div>
    {asesor.descripcion && (
      <p className="text-sm text-gray-500 mt-3 line-clamp-2">
        {asesor.descripcion}
      </p>
    )}
  </div>
);

// ==================== PASO 1: SERVICIOS ====================
const Step1Servicios = ({
  servicios,
  categorias,
  loading,
  selected,
  onSelect,
  onNext,
}) => {
  const [categoriaActiva, setCategoriaActiva] = useState("");
  const [busqueda, setBusqueda] = useState("");

  const serviciosFiltrados = servicios.filter((s) => {
    const matchCategoria = !categoriaActiva || s.categoria === categoriaActiva;
    const matchBusqueda =
      !busqueda || s.nombre.toLowerCase().includes(busqueda.toLowerCase());
    return matchCategoria && matchBusqueda;
  });

  const handleToggle = (servicio) => {
    const isSelected = selected.some((s) => s._id === servicio._id);
    onSelect(
      isSelected
        ? selected.filter((s) => s._id !== servicio._id)
        : [...selected, servicio],
    );
  };

  const totalSeleccionado = selected.reduce(
    (sum, s) => sum + (s.precio?.base || 0),
    0,
  );
  const duracionTotal = selected.reduce(
    (sum, s) => sum + (s.duracion?.estandar || 0),
    0,
  );

  return (
    <div className="fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-display font-bold text-gray-800 mb-2">
          Selecciona tus servicios
        </h2>
        <p className="text-gray-500">Elige uno o más servicios para tu cita</p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar servicios..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="input pl-12"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setCategoriaActiva("")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${!categoriaActiva ? "bg-primary-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
        >
          Todos
        </button>
        {categorias.map((cat) => (
          <button
            key={cat.codigo}
            onClick={() => setCategoriaActiva(cat.codigo)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${categoriaActiva === cat.codigo ? "bg-primary-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >
            {cat.nombre}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {serviciosFiltrados.map((servicio) => (
            <ServiceCard
              key={servicio._id}
              servicio={servicio}
              selected={selected.some((s) => s._id === servicio._id)}
              onSelect={handleToggle}
            />
          ))}
        </div>
      )}

      {selected.length > 0 && (
        <div className="sticky bottom-4 bg-white rounded-2xl shadow-medium p-4 border border-gray-100">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-sm text-gray-500">Servicios</p>
                <p className="font-semibold">{selected.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Duración</p>
                <p className="font-semibold">{duracionTotal} min</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="font-bold text-primary-600 text-xl">
                  ${totalSeleccionado}
                </p>
              </div>
            </div>
            <button onClick={onNext} className="btn-primary">
              Continuar <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ==================== PASO 2: ASESOR ====================
const Step2Asesor = ({
  serviciosSeleccionados,
  asesorSeleccionado,
  onSelect,
  onNext,
  onBack,
}) => {
  const [asesores, setAsesores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarAsesores = async () => {
      try {
        setLoading(true);
        const serviciosIds = serviciosSeleccionados.map((s) => s._id);
        //const response = await asesoresAPI.getPorServicios(serviciosIds);
        const response = {
          data: [
            {
              _id: "1",
              nombres: "María López",
              apellidos: "García",
              cargo: "Esteticista Senior",
              color: "#E8B4BC",
              estadisticas: {
                calificacionPromedio: 4.8,
                totalCalificaciones: 120,
              },
              descripcion:
                "Especialista en tratamientos faciales y corporales con más de 10 años de experiencia.",
            },
          ],
        };
        setAsesores(response.data);
      } catch (error) {
        toast.error("Error cargando asesores");
      } finally {
        setLoading(false);
      }
    };
    cargarAsesores();
  }, [serviciosSeleccionados]);

  return (
    <div className="fade-in max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-display font-bold text-gray-800 mb-2">
          Elige tu asesor
        </h2>
        <p className="text-gray-500">
          Selecciona el profesional que te atenderá
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
        </div>
      ) : asesores.length === 0 ? (
        <div className="text-center py-12">
          <UserCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">
            No hay asesores disponibles para los servicios seleccionados
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {asesores.map((asesor) => (
            <AsesorCard
              key={asesor._id}
              asesor={asesor}
              selected={asesorSeleccionado?._id === asesor._id}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}

      <div className="flex justify-between mt-8">
        <button onClick={onBack} className="btn-secondary">
          <ArrowLeft className="w-5 h-5 mr-2" /> Atrás
        </button>
        <button
          onClick={onNext}
          disabled={!asesorSeleccionado}
          className="btn-primary disabled:opacity-50"
        >
          Continuar <ArrowRight className="w-5 h-5 ml-2" />
        </button>
      </div>
    </div>
  );
};

// ==================== PASO 3: FECHA Y HORA ====================
const Step3FechaHora = ({
  asesor,
  duracionTotal,
  fecha,
  hora,
  onFechaChange,
  onHoraChange,
  onNext,
  onBack,
}) => {
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [diaDisponible, setDiaDisponible] = useState(true);

  useEffect(() => {
    const cargarHorarios = async () => {
      //if (!fecha || !asesor) return;
      try {
        setLoading(true);
        //const response = await asesoresAPI.getDisponibilidad(asesor._id, format(fecha, 'yyyy-MM-dd'), duracionTotal);
        const response = {
          horarios: [
            { hora: "09:00" },
            { hora: "10:30" },
            { hora: "11:00" },
            { hora: "11:30" },
            { hora: "12:00" },
            { hora: "13:00" },
            { hora: "14:00" },
            { hora: "15:00" },
            { hora: "16:00" },
            { hora: "17:00" },
            { hora: "18:00" },
          ],
          disponible: true,
        };
        setHorarios(response.horarios || []);
        setDiaDisponible(response.disponible);
      } catch (error) {
        setHorarios([]);
      } finally {
        setLoading(false);
      }
    };
    cargarHorarios();
  }, [fecha, asesor, duracionTotal]);

  return (
    <div className="fade-in max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-display font-bold text-gray-800 mb-2">
          Elige fecha y hora
        </h2>
        <p className="text-gray-500">
          Horarios disponibles de <strong>{asesor?.nombres}</strong>
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-azul-dark" />
            Fecha
          </h3>
          <DatePicker
            selected={fecha}
            onChange={onFechaChange}
            minDate={new Date()}
            maxDate={addDays(new Date(), 30)}
            locale="es"
            inline
            filterDate={(date) => date.getDay() !== 0}
          />
        </div>

        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-azul-dark" />
            Hora
          </h3>
          {!fecha ? (
            <p className="text-gray-400 text-center py-8">
              Selecciona una fecha
            </p>
          ) : loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent"></div>
            </div>
          ) : !diaDisponible ? (
            <p className="text-red-500 text-center py-8">
              No disponible este día
            </p>
          ) : horarios.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              Sin horarios disponibles
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
              {horarios.map((h) => (
                <button
                  key={h.hora}
                  onClick={() => onHoraChange(h)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${hora?.hora === h.hora ? "bg-azul-dark text-white" : "bg-gray-100 text-gray-600 hover:bg-azul-light"}`}
                >
                  {h.hora}
                </button>
              ))}
            </div>
          )}
          <div
            style={{
              backgroundColor: "#bd6ef1",
              borderRadius: "5px",
              color: "white",
              marginTop: "10px",
            }}
          >
            <p>Descuento del 10% en el horario de 9:00 a 12:00</p>
          </div>
        </div>
      </div>

      {fecha && hora && (
        <div className="mt-6 p-4 bg-azul-light rounded-xl border border-azul-dark">
          <p className="text-center text-azul-dark">
            Tu cita será el{" "}
            <strong>{format(fecha, "EEEE d 'de' MMMM", { locale: es })}</strong>{" "}
            a las <strong>{hora.hora}</strong>
          </p>
        </div>
      )}

      <div className="flex justify-evenly mt-8">
        {/*<button onClick={onBack} className="btn-secondary"><ArrowLeft className="w-5 h-5 mr-2" /> Atrás</button>*/}
        <button
          onClick={onNext}
          disabled={!fecha || !hora}
          className="btn-agendar disabled:opacity-50"
        >
          Agendar <ArrowRight className="w-5 h-5 ml-2" />
        </button>
      </div>
    </div>
  );
};

// ==================== PASO 4: DATOS DEL CLIENTE ====================
const Step4DatosCliente = ({ datos, onChange, onNext, onBack, loading }) => {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!datos.cedula || datos.cedula.length < 8)
      newErrors.cedula = "Cédula inválida";
    if (!datos.nombres || datos.nombres.length < 2)
      newErrors.nombres = "Requerido";
    if (!datos.apellidos || datos.apellidos.length < 2)
      newErrors.apellidos = "Requerido";
    if (!datos.celular || datos.celular.length < 10)
      newErrors.celular = "Celular inválido";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) onNext();
  };

  return (
    <div className="fade-in max-w-xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-display font-bold text-gray-800 mb-2">
          Tus datos
        </h2>
        <p className="text-gray-500">Ingresa tu información para confirmar</p>
      </div>

      <div className="card space-y-4">
        <div>
          <label className="label">
            <CreditCard className="w-4 h-4 mr-2 inline" />
            Cédula
          </label>
          <input
            type="text"
            value={datos.cedula}
            onChange={(e) =>
              onChange({ ...datos, cedula: e.target.value.replace(/\D/g, "") })
            }
            placeholder="0912345678"
            className={`input ${errors.cedula ? "input-error" : ""}`}
            maxLength={13}
          />
          {errors.cedula && (
            <p className="text-red-500 text-xs mt-1">{errors.cedula}</p>
          )}
        </div>
        <div>
          <label className="label">
            <User className="w-4 h-4 mr-2 inline" />
            Nombres
          </label>
          <input
            type="text"
            value={datos.nombres}
            onChange={(e) => onChange({ ...datos, nombres: e.target.value })}
            className={`input ${errors.nombres ? "input-error" : ""}`}
          />
        </div>
        <div>
          <label className="label">
            <User className="w-4 h-4 mr-2 inline" />
            Apellidos
          </label>
          <input
            type="text"
            value={datos.apellidos}
            onChange={(e) => onChange({ ...datos, apellidos: e.target.value })}
            className={`input ${errors.apellidos ? "input-error" : ""}`}
          />
        </div>
        <div>
          <label className="label">
            <Phone className="w-4 h-4 mr-2 inline" />
            Celular (WhatsApp)
          </label>
          <input
            type="tel"
            value={datos.celular}
            onChange={(e) =>
              onChange({ ...datos, celular: e.target.value.replace(/\D/g, "") })
            }
            className={`input ${errors.celular ? "input-error" : ""}`}
            maxLength={15}
          />
          <p className="text-xs text-gray-400 mt-1">
            Recibirás confirmación por WhatsApp
          </p>
        </div>
        <div>
          <label className="label">
            <Mail className="w-4 h-4 mr-2 inline" />
            Correo (opcional)
          </label>
          <input
            type="email"
            value={datos.correo}
            onChange={(e) => onChange({ ...datos, correo: e.target.value })}
            className="input"
          />
        </div>
        <div>
          <label className="label">Notas (opcional)</label>
          <textarea
            value={datos.notas}
            onChange={(e) => onChange({ ...datos, notas: e.target.value })}
            className="input h-20 resize-none"
            maxLength={500}
          />
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button onClick={onBack} className="btn-secondary">
          <ArrowLeft className="w-5 h-5 mr-2" /> Atrás
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="btn-primary"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
              Procesando...
            </>
          ) : (
            <>
              Confirmar <CheckCircle className="w-5 h-5 ml-2" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// ==================== PASO 5: CONFIRMACIÓN ====================
const Step5Confirmacion = ({ cita, onNuevaCita }) => (
  <div className="fade-in max-w-xl mx-auto text-center">
    <div className="mb-8">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-12 h-12 text-green-500" />
      </div>
      <h2 className="text-3xl font-display font-bold text-gray-800 mb-2">
        ¡Cita Confirmada!
      </h2>
      <p className="text-gray-500">Recibirás un mensaje de WhatsApp</p>
    </div>

    <div className="card text-left mb-8">
      <div className="space-y-3">
        <div className="flex justify-between py-2 border-b">
          <span className="text-gray-500">Cliente</span>
          <span className="font-medium">
            {cita.datosCliente?.nombres} {cita.datosCliente?.apellidos}
          </span>
        </div>
        <div className="flex justify-between py-2 border-b">
          <span className="text-gray-500">Asesor</span>
          <span className="font-medium">
            {cita.datosAsesor?.nombres} {cita.datosAsesor?.apellidos}
          </span>
        </div>
        <div className="flex justify-between py-2 border-b">
          <span className="text-gray-500">Fecha</span>
          <span className="font-medium">
            {cita.fechaHora &&
              format(new Date(cita.fechaHora), "d 'de' MMMM, yyyy", {
                locale: es,
              })}
          </span>
        </div>
        <div className="flex justify-between py-2 border-b">
          <span className="text-gray-500">Hora</span>
          <span className="font-medium">
            {cita.fechaHora && format(new Date(cita.fechaHora), "HH:mm")}
          </span>
        </div>
        <div className="py-2 border-b">
          <span className="text-gray-500">Servicios</span>
          <ul className="mt-2 space-y-1">
            {cita.servicios?.map((s, i) => (
              <li key={i} className="flex justify-between text-sm">
                <span>{s.nombre}</span>
                <span>${s.precio}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex justify-between py-2 text-lg">
          <span className="font-semibold">Total</span>
          <span className="font-bold text-primary-600">${cita.total}</span>
        </div>
      </div>
    </div>

    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <button onClick={onNuevaCita} className="btn-primary">
        Agendar otra cita
      </button>
      <a href="/mis-citas" className="btn-secondary">
        Ver mis citas
      </a>
    </div>
  </div>
);

// ==================== COMPONENTE PRINCIPAL ====================
const AgendarCitaH = () => {
  const [step, setStep] = useState(0);
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState([]);
  const [asesorSeleccionado, setAsesorSeleccionado] = useState(null);
  const [fecha, setFecha] = useState(null);
  const [hora, setHora] = useState(null);
  const [datosCliente, setDatosCliente] = useState({
    cedula: "",
    nombres: "",
    apellidos: "",
    celular: "",
    correo: "",
    notas: "",
  });
  const [citaCreada, setCitaCreada] = useState(null);

  /*const { servicios, categorias, loading: loadingServicios } = useServicios();
  const { crearCita, loading: loadingCita } = useCitas();*/

  const steps = [
    "Servicios",
    "Asesor",
    "Fecha y Hora",
    "Tus Datos",
    "Confirmación",
  ];
  const duracionTotal = serviciosSeleccionados.reduce(
    (sum, s) => sum + (s.duracion?.estandar || 0),
    0,
  );
  const { conversacionId } = useParams();
  console.log("conversacionid:", conversacionId);
  const HandleCrearCita = async () => {
    const fechaMongo = fecha.toISOString().split("T")[0] + "T00:00:00.000Z";

    const datosCita = {
      conversacion: conversacionId,
      fecha: fechaMongo,
      hora: hora.hora,
    };
    console.log("cita", datosCita);
    const response = await citashAPI.crear(datosCita);
    setCitaCreada(response.data);
    console.log("respuesta de crear cita:", response);
    toast.success("¡Cita agendada exitosamente!");
  };
  /*const handleCrearCita = async () => {
    try {
      const datosCita = {
        cliente: { cedula: datosCliente.cedula, nombres: datosCliente.nombres, apellidos: datosCliente.apellidos, celular: datosCliente.celular, correo: datosCliente.correo },
        asesorId: asesorSeleccionado._id,
        servicios: serviciosSeleccionados.map(s => ({ servicioId: s._id, duracionExtendida: false })),
        fechaHora: hora.fechaHora.toISOString(),
        notasCliente: datosCliente.notas
      };
      const response = await crearCita(datosCita);
      setCitaCreada(response.data);
      setStep(4);
      toast.success('¡Cita agendada exitosamente!');
    } catch (error) {
      toast.error(error.message || 'Error al crear la cita');
    }
  };*/

  const resetForm = () => {
    setStep(0);
    setServiciosSeleccionados([]);
    setAsesorSeleccionado(null);
    setFecha(null);
    setHora(null);
    setDatosCliente({
      cedula: "",
      nombres: "",
      apellidos: "",
      celular: "",
      correo: "",
      notas: "",
    });
    setCitaCreada(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-white to-accent-light">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Step3FechaHora
          asesor={asesorSeleccionado}
          duracionTotal={duracionTotal}
          fecha={fecha}
          hora={hora}
          onFechaChange={setFecha}
          onHoraChange={setHora}
          onNext={HandleCrearCita}
          onBack={() => setStep(1)}
        />
      </main>
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2026 Centro de Especialidades. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AgendarCitaH;
