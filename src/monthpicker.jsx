import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";

const meses = [
  { value: "1", label: "Enero" },
  { value: "2", label: "Febrero" },
  { value: "3", label: "Marzo" },
  { value: "4", label: "Abril" },
  { value: "5", label: "Mayo" },
  { value: "6", label: "Junio" },
  { value: "7", label: "Julio" },
  { value: "8", label: "Agosto" },
  { value: "9", label: "Septiembre" },
  { value: "10", label: "Octubre" },
  { value: "11", label: "Noviembre" },
  { value: "12", label: "Diciembre" },
];

const anios = ["2025", "2026"];

export function MonthPicker({ onChange = () => {} }) {
  const [mes, setMes] = useState("");
  const [anio, setAnio] = useState("");

  const handleChange = async (nuevoMes, nuevoAnio) => {
    if (nuevoMes && nuevoAnio) {
      onChange({ mes: nuevoMes, anio: nuevoAnio });
      console.log({ mes: nuevoMes, anio: nuevoAnio });
      /*console.log("Mes seleccionado:", nuevoMes);
      console.log("Año seleccionado:", nuevoAnio);*/
      /*const { data } = await axios.get("/dashboard/started-chats", {
        params: { periodo: "mes", anio: nuevoAnio, mes: nuevoMes },
      });*/
      /*console.log("Respuesta:", data);*/
    }
  };

  return (
    <div className="flex gap-2">
      <Select
        onValueChange={(val) => {
          setMes(val);
          handleChange(val, anio);
        }}
      >
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Mes" />
        </SelectTrigger>
        <SelectContent>
          {meses.map((m) => (
            <SelectItem key={m.value} value={m.value}>
              {m.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        onValueChange={(val) => {
          setAnio(val);
          handleChange(mes, val);
        }}
      >
        <SelectTrigger className="w-24">
          <SelectValue placeholder="Año" />
        </SelectTrigger>
        <SelectContent>
          {anios.map((a) => (
            <SelectItem key={a} value={a}>
              {a}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
