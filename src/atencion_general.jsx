import { useState, useRef } from "react";
import { format, getISOWeek } from "date-fns";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import axios from "axios";
import { BarsGeneral, Barcharts } from "./barcharts";

export function AtencionGeneral({ onChange = () => {} }) {
  const [date, setDate] = useState();
  const [informacion, setInformacion] = useState(null);
  const [infoCategories, setInfoCategories] = useState(null);
  const [periodoActivo, setPeriodoActivo] = useState(null);
  const [periodoActivoCat, setPeriodoActivoCat] = useState(null);
  const [loadingConv, setLoadingConv] = useState(false);
  const [loadingCat, setLoadingCat] = useState(false);
  const controllerConv = useRef(null);
  const controllerCat = useRef(null);

  const fetchConversaciones = async (params, signal) => {
    setLoadingConv(true);
    try {
      const { data } = await axios.get("/api/dashboard/conversations", {
        params,
        signal,
      });
      setInformacion(data.data);
    } catch (error) {
      if (axios.isCancel(error)) return;
      console.error("Error conversaciones:", error);
    } finally {
      setLoadingConv(false);
    }
  };

  const fetchCategorias = async (params, signal) => {
    setLoadingCat(true);
    try {
      const { data } = await axios.get("/api/dashboard/chats-estado", {
        params,
        signal,
      });
      setInfoCategories(data.data);
    } catch (error) {
      if (axios.isCancel(error)) return;
      console.error("Error categorias:", error);
    } finally {
      setLoadingCat(false);
    }
  };

  const handleSelect = async (selected) => {
    setDate(selected);
    setPeriodoActivo("dia");
    if (selected) {
      onChange(format(selected, "yyyy-MM-dd"));
      if (controllerConv.current) controllerConv.current.abort();
      controllerConv.current = new AbortController();
      await fetchConversaciones(
        { periodo: "dia", fecha: format(selected, "yyyy-MM-dd") },
        controllerConv.current.signal,
      );
    }
  };

  const handlePeriodo = (e, periodo) => {
    e.currentTarget.blur();
    setPeriodoActivo(periodo);
    if (controllerConv.current) controllerConv.current.abort();
    controllerConv.current = new AbortController();
    fetchConversaciones({ periodo }, controllerConv.current.signal);
  };

  const handlePeriodoCat = (e, periodo) => {
    e.currentTarget.blur();
    setPeriodoActivoCat(periodo);
    if (controllerCat.current) controllerCat.current.abort();
    controllerCat.current = new AbortController();
    fetchCategorias({ periodo }, controllerCat.current.signal);
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Numero de atenciones</h1>

      <div className="flex items-center gap-2 mb-4">
        <Button
          variant={periodoActivo === "dia" ? "default" : "outline"}
          onClick={(e) => handlePeriodo(e, "dia")}
        >
          Hoy
        </Button>
        <Button
          variant={periodoActivo === "semana" ? "default" : "outline"}
          onClick={(e) => handlePeriodo(e, "semana")}
        >
          Semana
        </Button>
        <Button
          variant={periodoActivo === "mes" ? "default" : "outline"}
          onClick={(e) => handlePeriodo(e, "mes")}
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
              {date ? format(date, "PPP") : <span>Selecciona un Dia</span>}
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
      </div>

      {loadingConv ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-muted border-t-primary" />
        </div>
      ) : (
        <BarsGeneral categorias={informacion} />
      )}
      <div className="flex items-center gap-2 mb-4">
        <Button
          variant={periodoActivoCat === "dia" ? "default" : "outline"}
          onClick={(e) => handlePeriodoCat(e, "dia")}
        >
          Hoy
        </Button>
        <Button
          variant={periodoActivoCat === "semana" ? "default" : "outline"}
          onClick={(e) => handlePeriodoCat(e, "semana")}
        >
          Semana
        </Button>
        <Button
          variant={periodoActivoCat === "mes" ? "default" : "outline"}
          onClick={(e) => handlePeriodoCat(e, "mes")}
        >
          Mes
        </Button>
      </div>
      {loadingCat ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-muted border-t-primary" />
        </div>
      ) : (
        <Barcharts categorias={infoCategories} />
      )}
    </>
  );
}
