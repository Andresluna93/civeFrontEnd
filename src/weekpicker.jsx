import { useState } from "react";
import { getISOWeek } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const MONTHS = [
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

function getWeeksOfMonth(month) {
  const weeks = [];
  const firstDay = new Date(new Date().getFullYear(), month - 1, 1);
  const lastDay = new Date(new Date().getFullYear(), month, 0);

  let current = new Date(firstDay);
  // Retroceder al lunes anterior si no comienza en lunes
  const dayOfWeek = current.getDay();
  const offset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  current.setDate(current.getDate() - offset);

  let weekIndex = 1;
  while (current <= lastDay) {
    const start = new Date(current);
    const end = new Date(current);
    end.setDate(end.getDate() + 6);

    const fmt = (d) =>
      d.toLocaleDateString("es-EC", { day: "numeric", month: "short" });

    weeks.push({
      id: weekIndex,
      label: `Semana ${weekIndex}`,
      range: `${fmt(start)} – ${fmt(end)}`,
      weekOfYear: getISOWeek(start),
    });

    current.setDate(current.getDate() + 7);
    weekIndex++;
  }

  return weeks;
}

export function WeekSelector({ onSelect = () => {} }) {
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(
    String(today.getMonth() + 1),
  );
  const [selectedWeek, setSelectedWeek] = useState(null);

  const year = today.getFullYear();
  const weeks = getWeeksOfMonth(Number(selectedMonth));

  const handleMonthChange = (value) => {
    setSelectedMonth(value);
    setSelectedWeek(null);
  };

  return (
    <div className="p-6 max-w-md space-y-5">
      {/* Selector de mes */}
      <div className="space-y-1.5">
        <label className="text-sm text-muted-foreground">Mes</label>
        <Select value={selectedMonth} onValueChange={handleMonthChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecciona un mes" />
          </SelectTrigger>
          <SelectContent>
            {MONTHS.map((m) => (
              <SelectItem key={m.value} value={m.value}>
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Selector de semana */}
      <div className="space-y-1.5">
        <label className="text-sm text-muted-foreground">Semana</label>
        <div className="grid grid-cols-2 gap-2">
          {weeks.map((week) => (
            <button
              key={week.id}
              onClick={() => {
                setSelectedWeek(week.id);
                onSelect({ semana: week.weekOfYear, anio: year });
              }}
              className={cn(
                "flex flex-col items-start rounded-lg border px-3 py-2.5 text-left text-sm transition-colors",
                selectedWeek === week.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background hover:bg-muted text-foreground",
              )}
            >
              <span className="font-medium">{week.label}</span>
              <span
                className={cn(
                  "text-xs mt-0.5",
                  selectedWeek === week.id
                    ? "text-primary-foreground/70"
                    : "text-muted-foreground",
                )}
              >
                {week.range}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
