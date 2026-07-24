import { useState } from "react";
import { BarsSucursales } from "./barcharts";
export { BarsSucursales } from "./barcharts";
import { Button } from "@/components/ui/button";
import axios from "axios";

export function SucursalesData() {
  const [informacion, setInformaciton] = useState(null);
  const fetchData = async (params) => {
    const { data } = await axios.get("/api/dashboard/sucursal");
    console.log("Respuesta:", data);
    setInformaciton(data.data);
  };
  const handleVer = (e) => {
    e.currentTarget.blur();
    fetchData();
  };
  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <Button onClick={handleVer}>Ver</Button>
      </div>
      <BarsSucursales categorias={informacion} />
    </>
  );
}
