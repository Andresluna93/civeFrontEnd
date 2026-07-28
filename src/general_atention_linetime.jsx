import { LineChart } from "@mui/x-charts/LineChart";
import { ScatterChart } from "@mui/x-charts/ScatterChart";
import axios from "axios";
import { useState, useEffect } from "react";
import { format, getISOWeek } from "date-fns";
import { Button } from "@/components/ui/button";

export function LimeTimeAtention() {
  const [info, setInfo] = useState(null);
  const [periodoActivo, setPeriodoActivo] = useState("dia");
  const [loading, setLoading] = useState(false);

  const fetchData = async (param) => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/dashboard/conversations", {
        params: { periodo: param },
      });
      setInfo(data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData("dia");
  }, []);

  if (!info) return null;

  const handleToday = (e) => {
    e.currentTarget.blur();
    setPeriodoActivo("dia");
    fetchData("dia");
  };

  const handleSemana = (e) => {
    e.currentTarget.blur();
    setPeriodoActivo("semana");
    fetchData("semana");
  };

  const handleMes = (e) => {
    e.currentTarget.blur();
    setPeriodoActivo("mes");
    fetchData("mes");
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">
        Numero de atenciones por {periodoActivo}
      </h1>
      <div className="flex items-center gap-2 mb-4">
        <Button
          variant={periodoActivo === "dia" ? "default" : "outline"}
          onClick={handleToday}
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
      </div>
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-muted border-t-primary" />
        </div>
      ) : periodoActivo === "dia" ? (
        <ScatterChart
          xAxis={[{ label: "Cantidad", tickMinStep: 1 }]}
          yAxis={[
            {
              label: "Tiempo",
              tickMinStep: 1,
              valueFormatter: (v) => `${String(v).padStart(2, "0")}:00`,
            },
          ]}
          series={[
            {
              data: info.informacion.map((item, index) => ({
                x: item.total,
                y: parseInt(item.hora.split(":")[0], 10),
                id: index,
              })),
              label: "Requerimientos",
              valueFormatter: (v) =>
                `${v.x} a las ${String(v.y).padStart(2, "0")}:00`,
            },
          ]}
          height={300}
        />
      ) : (
        <LineChart
          xAxis={[
            {
              data: info.informacion.map((item) => item.hora),
              label: "Tiempo",
              scaleType: "point",
            },
          ]}
          yAxis={[
            {
              tickMinStep: 1,
              valueFormatter: (v) => Math.round(v).toString(),
            },
          ]}
          series={[
            {
              data: info.informacion.map((item) => item.total),
              label: "Requerimientos",
            },
          ]}
          height={300}
        />
      )}
    </>
  );
}
