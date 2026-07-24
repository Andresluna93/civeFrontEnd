import { useState } from "react";
import { MonthPicker } from "./monthpicker";
import { DatePicker } from "./datepicker";
import { CalendarWithTime } from "./calendarwithtimepicker";
import { WeekSelector } from "./weekpicker";
import { AtencionGeneral } from "./atencion_general";
import { LimeTimeAtention } from "./general_atention_linetime";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/admin/Dashboard";
import Login from "./pages/admin/Login";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/admin" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
