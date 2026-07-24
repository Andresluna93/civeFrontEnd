import { useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import es from "date-fns/locale/es";
import "react-datepicker/dist/react-datepicker.css";
import { Clock, User } from "lucide-react";

registerLocale("es", es);

const MEDICOS = [
  {
    id: 1,
    nombre: "Dr. Carlos Rodríguez",
    especialidad: "Cardiología",
    citas: [
      { fecha: new Date(2026, 4, 11), hora: "09:00", paciente: "Luis Pérez" },
      { fecha: new Date(2026, 4, 11), hora: "10:30", paciente: "Ana Gómez" },
      { fecha: new Date(2026, 4, 13), hora: "08:00", paciente: "Jorge Mora" },
      { fecha: new Date(2026, 4, 16), hora: "11:00", paciente: "Carmen Díaz" },
      { fecha: new Date(2026, 4, 20), hora: "09:30", paciente: "Roberto Lara" },
    ],
  },
  {
    id: 2,
    nombre: "Dra. María González",
    especialidad: "Pediatría",
    citas: [
      { fecha: new Date(2026, 4, 12), hora: "08:30", paciente: "Sofía Torres" },
      { fecha: new Date(2026, 4, 12), hora: "10:00", paciente: "Mateo Silva" },
      { fecha: new Date(2026, 4, 14), hora: "09:00", paciente: "Valentina Cruz" },
      { fecha: new Date(2026, 4, 19), hora: "11:30", paciente: "Emilio Vega" },
      { fecha: new Date(2026, 4, 26), hora: "08:00", paciente: "Isabella Ríos" },
    ],
  },
  {
    id: 3,
    nombre: "Dr. Luis Martínez",
    especialidad: "Dermatología",
    citas: [
      { fecha: new Date(2026, 4, 11), hora: "14:00", paciente: "Patricia Núñez" },
      { fecha: new Date(2026, 4, 15), hora: "09:00", paciente: "Fernando Alva" },
      { fecha: new Date(2026, 4, 15), hora: "10:30", paciente: "Diana Suárez" },
      { fecha: new Date(2026, 4, 21), hora: "08:30", paciente: "Marcos León" },
      { fecha: new Date(2026, 4, 28), hora: "13:00", paciente: "Claudia Pinto" },
    ],
  },
  {
    id: 4,
    nombre: "Dra. Ana Torres",
    especialidad: "Ginecología",
    citas: [
      { fecha: new Date(2026, 4, 13), hora: "09:00", paciente: "Lucía Herrera" },
      { fecha: new Date(2026, 4, 13), hora: "11:00", paciente: "Natalia Campos" },
      { fecha: new Date(2026, 4, 18), hora: "10:00", paciente: "Daniela Reyes" },
      { fecha: new Date(2026, 4, 25), hora: "09:30", paciente: "Valeria Mora" },
      { fecha: new Date(2026, 4, 27), hora: "14:30", paciente: "Gabriela Soto" },
    ],
  },
];

const mismoDia = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const CalendarioMedico = ({ medico }) => {
  const [diaSeleccionado, setDiaSeleccionado] = useState(new Date(2026, 4, 11));

  const fechasConCitas = medico.citas.map((c) => c.fecha);

  const citasDelDia = medico.citas.filter((c) =>
    mismoDia(c.fecha, diaSeleccionado)
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
      <div className="px-4 py-3 bg-[oklch(62.3%_0.214_259.815)]">
        <p className="text-white font-semibold text-sm">{medico.nombre}</p>
        <p className="text-white/80 text-xs">{medico.especialidad}</p>
      </div>

      <div className="flex justify-center pt-2">
        <DatePicker
          selected={diaSeleccionado}
          onChange={(date) => setDiaSeleccionado(date)}
          highlightDates={fechasConCitas}
          locale="es"
          inline
        />
      </div>

      <div className="px-4 pb-4 border-t pt-3">
        <p className="text-xs font-semibold text-gray-500 mb-2">
          {citasDelDia.length > 0
            ? `${citasDelDia.length} cita${citasDelDia.length > 1 ? "s" : ""}`
            : "Sin citas este día"}
        </p>
        <div className="space-y-1.5 max-h-24 overflow-y-auto">
          {citasDelDia.length === 0 ? (
            <p className="text-xs text-gray-300 italic">Día libre</p>
          ) : (
            citasDelDia.map((c, i) => (
              <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-lg px-2 py-1.5">
                <Clock className="w-3 h-3 text-gray-400 flex-shrink-0" />
                <span className="text-xs font-medium text-gray-600">{c.hora}</span>
                <User className="w-3 h-3 text-gray-400 flex-shrink-0" />
                <span className="text-xs text-gray-500 truncate">{c.paciente}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const Calendarios = () => (
  <div>
    <h2 className="text-2xl font-display font-bold text-gray-800 mb-6">Calendarios</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {MEDICOS.map((medico) => (
        <CalendarioMedico key={medico.id} medico={medico} />
      ))}
    </div>
  </div>
);

export default Calendarios;
