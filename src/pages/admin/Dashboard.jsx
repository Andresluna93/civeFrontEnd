import { useState } from "react";
import {
  HeartPulse,
  Users,
  MessageSquare,
  Calendar,
  ChartBarBig,
  Building2,
  FileSearchCorner,
  History,
  Ticket,
  ClipboardList,
  FileUser,
  Contact,
} from "lucide-react";

import { AtencionGeneral } from "../../atencion_general";
import { LimeTimeAtention } from "../../general_atention_linetime";
import ListaContactos from "./ListaContactos";
import ListaMensajes from "./ListaMensajes";
import Calendarios from "./Calendarios";
import InteractiveList from "./contactos";
import UserMenu from "./UserMenu";
import DataFetcher from "@/components/moleculas/dataFetcher";
import HistoryProcess from "@/components/HistoryProcess/historyProcess";
import TicketsSelectionCard from "@/components/Tickets/TicketsMenu";
import TareasSelectionCard from "@/components/Tickets/TareasMenu";
import { SucursalesData } from "../../sucursalesInfo";
import { TareaFormRegister } from "@/components/Tickets/RegistroRequerimiento";

const NAV_ITEMS = [
  { key: "atencion", label: "Atencion", icon: ChartBarBig },
  { key: "tiempo", label: "Tiempo", icon: MessageSquare },
  { key: "sucursales", label: "Sucursales", icon: Building2 },
  { key: "contactos", label: "Contactos", icon: Contact },
  // { key: "calendarios", label: "Calendarios", icon: Calendar },
  // { key: "Fetching", label: "Fetching", icon: FileSearchCorner },
  // { key: "Tickets", label: "Tickets", icon: Ticket },
  { key: "Registros", label: "Registros", icon: FileUser },
  { key: "Tareas", label: "Tareas", icon: ClipboardList },
];

const Dashboard = () => {
  const [seccion, setSeccion] = useState("contactos");

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-solid-head text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <HeartPulse className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-display font-bold">
                  Centro de Especialidades
                </h1>
                <p className="text-white/80 text-sm">Panel de administración</p>
              </div>
            </div>
            <UserMenu nombre="Ramiro" />
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-56 bg-white border-r border-gray-200 flex-shrink-0">
          <nav className="py-6 px-3 space-y-1">
            {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setSeccion(key)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  seccion === key
                    ? "bg-[oklch(62.3%_0.214_259.815)] text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Contenido */}
        <main className="flex-1 bg-gradient-to-br from-background via-white to-accent-light px-8 py-10">
          {seccion === "atencion" && <AtencionGeneral />}
          {seccion === "tiempo" && <LimeTimeAtention />}
          {seccion === "sucursales" && <SucursalesData />}
          {seccion === "contactos" && <InteractiveList />}
          {/* {seccion === "calendarios" && <Calendarios />} */}
          {/* {seccion === "Fetching" && (
            <DataFetcher url={"https://jsonplaceholder.typicode.com/users"} />
          )} */}
          <br />
          {/* {seccion === "Tickets" && <TicketsSelectionCard />} */}
          {seccion === "Registros" && <TareaFormRegister />}
          {seccion === "Tareas" && <TareasSelectionCard />}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
