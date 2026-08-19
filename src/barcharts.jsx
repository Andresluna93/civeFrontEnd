import { BarChart } from "@mui/x-charts/BarChart";
export function Barcharts({ categorias }) {
  /*if (!categorias) return null;
  console.log("Claves recibidas:", Object.keys(categorias));
  console.log("Valores:", categorias);*/
  return (
    <>
      <label className="text-lg font-medium mb-2">
        {categorias
          ? `Total de atenciones por Categorias durante ${categorias.periodo}`
          : "Selecciona un período"}
      </label>
      <br></br>
      <BarChart
        xAxis={[
          {
            id: "barCategories",
            data: ["ingresado", "en proceso", "finalizada", "abandono"],
            scaleType: "band",
            height: 70,
            tickLabelStyle: { textAnchor: "end", fontSize: 12 },
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
            data: [
              categorias?.ingresado ?? 0,
              categorias?.en_proceso ?? 0,
              categorias?.finalizado ?? 0,
              categorias?.abandono ?? 0,
            ],
          },
        ]}
        width={550}
        height={300}
      />
    </>
  );
}

export function BarsGeneral({ categorias }) {
  /*if (!categorias) return null;
  console.log("Claves recibidas:", Object.keys(categorias));
  console.log("Valores:", categorias);*/
  return (
    <>
      <label className="text-lg font-medium mb-2">
        {categorias
          ? `Total de atenciones por ${categorias.periodo}`
          : "Selecciona un período"}
      </label>
      <br></br>
      <BarChart
        xAxis={[
          {
            id: "barCategories",
            data: ["Atenciones"],
            scaleType: "band",
            height: 70,
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
            data: [categorias?.total ?? 0],
          },
        ]}
        width={450}
        height={300}
      />
    </>
  );
}

export function BarsSucursales({ categorias }) {
  const data = categorias ?? [];
  return (
    <>
      <label className="text-lg font-medium mb-2">
        Numero Global de Agendamientos en Sucursales
      </label>
      <br></br>
      <BarChart
        xAxis={[
          {
            id: "barCategories",
            data: data.map((item) => item.sucursal),
            scaleType: "band",
            height: 70,
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
            data: data.map((item) => item.total),
          },
        ]}
        localeText={{ noData: "No hay datos para mostrar" }}
        width={450}
        height={300}
      />
    </>
  );
}
