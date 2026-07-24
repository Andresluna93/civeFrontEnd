import { useState } from "react";
import { format } from "date-fns";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import axios from "axios";
import { Barcharts } from "./barcharts";

export function DatePicker({ onChange = () => {} }) {
  const [date, setDate] = useState();
  const [informacion, setInformaciton] = useState(null);
  const [periodoActivo, setPeriodoActivo] = useState(null);

  const fetchData = async (params) => {
    const { data } = await axios.get("/api/dashboard/chats-estado", {
      params,
    });
    console.log("Respuesta:", data);
    setInformaciton(data.data);
  };
  const handleSelect = async (selected) => {
    setPeriodoActivo("dia");
    if (selected) {
      const fecha = format(selected, "yyyy-MM-dd");
      onChange(fecha);

      const datos = await fetchData({
        periodo: "dia",
        fecha,
      });
      console.log("Respuesta:", datos);
    }
  };

  const handleHoy = () => {
    setPeriodoActivo("dia");
    fetchData({ periodo: "dia" });
  };

  const handleSemana = () => {
    setPeriodoActivo("semana");
    fetchData({ periodo: "semana" });
  };

  const handleMes = () => {
    setPeriodoActivo("mes");
    fetchData({ periodo: "mes" });
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">
        Numero de atenciones al dia por Categorias
      </h1>
      <div className="flex items-center gap-2 mb-4">
        <Button
          variant={periodoActivo === "dia" ? "default" : "outline"}
          onClick={handleHoy}
        >
          Hoy
        </Button>
        <Button
          variant={periodoActivo === "semana" ? "default" : "outline"}
          onClick={handleSemana}
        >
          Semana
        </Button>
        <Button
          variant={periodoActivo === "mes" ? "default" : "outline"}
          onClick={handleMes}
        >
          Mes
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              data-empty={!date}
              className="w-[212px] justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
            >
              {date ? format(date, "PPP") : <span>Pick a date</span>}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleSelect}
              defaultMonth={date}
            />
          </PopoverContent>
        </Popover>
        <br></br>
        <br></br>
      </div>
      <Barcharts categorias={informacion} />
    </>
  );
}
