import { useState, useRef } from "react";
import { format } from "date-fns";
import { Clock2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

export function CalendarWithTime({ onSearch = () => {} }) {
  const [date, setDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 12),
  );
  const timeFromRef = useRef(null);
  const timeToRef = useRef(null);

  const handleSearch = () => {
    const result = {
      fecha: format(date, "yyyy-MM-dd"),
      horaInicio: timeFromRef.current.value,
      horaFin: timeToRef.current.value,
    };
    console.log("Búsqueda:", result);
    onSearch(result);
  };

  return (
    <Card size="sm" className="mx-auto w-fit">
      <CardContent>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="p-0"
        />
      </CardContent>
      <CardFooter className="border-t bg-card flex-col gap-3">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="time-from">Start Time</FieldLabel>
            <InputGroup>
              <InputGroupInput
                ref={timeFromRef}
                id="time-from"
                type="time"
                step="1"
                defaultValue="08:00:00"
                className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
              <InputGroupAddon>
                <Clock2Icon className="text-muted-foreground" />
              </InputGroupAddon>
            </InputGroup>
          </Field>
          <Field>
            <FieldLabel htmlFor="time-to">End Time</FieldLabel>
            <InputGroup>
              <InputGroupInput
                ref={timeToRef}
                id="time-to"
                type="time"
                step="1"
                defaultValue="09:00:00"
                className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
              <InputGroupAddon>
                <Clock2Icon className="text-muted-foreground" />
              </InputGroupAddon>
            </InputGroup>
          </Field>
        </FieldGroup>
        <Button className="w-full" onClick={handleSearch}>
          Buscar
        </Button>
      </CardFooter>
    </Card>
  );
}
