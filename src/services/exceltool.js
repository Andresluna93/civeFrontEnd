import * as XLSX from "xlsx";

export const exportarEstadosAExcel = (registros) => {
  const datos = registros.mensajes.map((r) => ({
    Teléfono: r.telefono,
    Fecha: new Date(r.fecha).toLocaleString(),
    Estado: r.estado,
  }));

  const worksheet = XLSX.utils.json_to_sheet(datos);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Estados de mensajes");

  XLSX.writeFile(
    workbook,
    `Plantilla_${registros.nombre}_Mensajes_${registros.tipo}_${Date.now()}.xlsx`,
  );
};
