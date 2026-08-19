import { useState, useRef } from "react";
import { BarsSucursales } from "./barcharts";
import { Button } from "@/components/ui/button";
import axios from "axios";

export function SucursalesData() {
  const [informacion, setInformaciton] = useState(null);
  const [loading, setLoading] = useState(false);
  const controllerConv = useRef(null);

  const fetchData = async (signal) => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/dashboard/sucursal", { signal });
      console.log("Respuesta:", data);
      setInformaciton(data.data);
    } catch (error) {
      if (axios.isCancel(error)) return;
      console.error("Error sucursales:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVer = (e) => {
    e.currentTarget.blur();
    if (controllerConv.current) controllerConv.current.abort();
    controllerConv.current = new AbortController();
    fetchData(controllerConv.current.signal);
  };
  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <Button onClick={handleVer}>Mostrar</Button>
      </div>
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-muted border-t-primary" />
        </div>
      ) : (
        <BarsSucursales categorias={informacion} />
      )}
    </>
  );
}
